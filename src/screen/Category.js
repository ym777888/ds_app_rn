import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableWithoutFeedback, FlatList, RefreshControl, Image } from 'react-native';
import { GlobalStyle } from '../common/GlobalStyle';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import GridItem from '../component/GridItem';
import NavTitle from '../component/NavTitle';
import { RNStorage } from '../common/RNStorage';


const Category = () => {
    const [clipType, setClipType] = useState([]);
    const navigation = useNavigation();
    const [dataEnd, setDataEnd] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDataList] = useState([]); // 初始数据
    const [isOnEndReachedEnabled, setIsOnEndReachedEnabled] = useState(false);//自动更多开关
    const route = useRoute(); // 使用 useRoute 钩子获取路由参数
    const currentPageRef = useRef(1);
    const pageArr = useRef([]);
    const flatListRef = useRef(null);
    const keyword = useRef('');
    const hasInit = useRef(false);

    const { title = '', hideButton = false } = route.params || {};

    useFocusEffect(
        useCallback(() => {
            if (!hasInit.current) {
                hasInit.current = true;
                getMaxPage(title);
            }
        }, [])
    );



    //打乱数组
    const shuffleArray = (maxPage) => {
        const array = Array.from({ length: maxPage }, (_, i) => i + 1);

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }

        return array;
    }

    const renderItem = ({ item, index }) => {
        return <GridItem data={item} nav={navigation} index={index} />
    };

    const renderHeader2 = () => {
        return (
            <></>
        )
    }


    const renderHeader = () => {
        const arr = RNStorage.info? (RNStorage.info?.clipType?.split(',')):[];
        let btnBox = [];
        for (let i = 0; i < arr.length; i++) {
            btnBox.push(
                <TouchableWithoutFeedback onPress={() => { clickKey(arr[i]) }} key={i}>
                    <View style={arr[i] === keyword.current ? styles.btnActive : styles.btn}>
                        <Text style={{ color: 'black' }}>{arr[i]}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
        return (
            <View style={styles.btnBox}>
                <TouchableWithoutFeedback onPress={resetKeyword}>
                    <View style={keyword.current === "" ? styles.btnActive : styles.btn}>
                        <Text style={{ color: 'black' }}>全部</Text>
                    </View>
                </TouchableWithoutFeedback>
                {btnBox}
            </View>
        );
    };

    const loadMoreData = () => {
        if (dataEnd || !isOnEndReachedEnabled) {
            return;
        }
        currentPageRef.current += 1;
        queryDataList();
    };

    const onRefresh = () => {
        setRefreshing(true);
        currentPageRef.current = 0; // 加载下一页数据
        setDataList([]);
        queryDataList();
        setTimeout(() => {
            setRefreshing(false);
        }, 10000);
    };

    const getMaxPage = (key) => {
        keyword.current = key;
        let req = {
            k: keyword.current,
            pageSize: Util.PAGE_SIZE
        };

        HttpUtil.postReq(Util.CLIP_MAX_PAGE, req, (msg, data) => {
            pageArr.current = shuffleArray(data);
            queryDataList();
        })
    }

    const getNextPage = () => {
        if (currentPageRef.current == pageArr.current.length) {
            currentPageRef.current = 0;
        }
        return pageArr.current[currentPageRef.current];
    }

    const queryDataList = () => {
        let req = {
            k: keyword.current,
            p: getNextPage(),
            pageSize: Util.PAGE_SIZE
        };

        HttpUtil.postReq(Util.CLIP_DATA, req, (msg, newData) => {
            if (newData.length > 0) {
                setDataList(prevData => [...prevData, ...newData]); // 使用函数式更新，将新数据添加到原有数据列表中
            } else {
                setDataEnd(true);
            }
            setRefreshing(false);
            setIsOnEndReachedEnabled(true);
        })
    }

    const goTop = () => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }

    const resetKeyword = () => {
        clickKey("");
    }

    const clickKey = (txt) => {
        goTop();
        keyword.current = txt;
        currentPageRef.current = 0;
        setDataList([]);
        setDataEnd(false);
        getMaxPage(keyword.current);
    }

    return (
        <View style={styles.row}>
            {hideButton && (<NavTitle nav={navigation} title={title} />)}
            <FlatList
                ref={flatListRef}
                style={{ backgroundColor: GlobalStyle.setBg(RNStorage.isDark), }}
                data={dataList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                onEndReached={loadMoreData} // 当滚动到列表底部时触发加载下一页数据的函数
                onEndReachedThreshold={0.2} // 距离列表底部多少比例触发 onEndReached 函数
                numColumns={2}
                ListHeaderComponent={hideButton ? renderHeader2 : renderHeader}
            />
            <TouchableWithoutFeedback onPress={goTop}>
                <View style={styles.btnTop}>
                    <Image tintColor={'#FFFFFFAA'} style={{ width: 40, height: 40 }} source={require('../../assets/icon_up.png')}></Image>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

export default Category;

const styles = StyleSheet.create({
    row: {
        padding: 0,
        flexDirection: 'column',
        flex: 1,
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
    },
    btn: {
        backgroundColor: '#dddddd',
        paddingHorizontal: 10,
        margin: 5,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
    },
    btnActive: {
        backgroundColor: '#FF9999',
        paddingHorizontal: 10,
        margin: 5,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
    },
    btnBox: {
        justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', flex: 1, flexWrap: 'wrap'
    },
    btnTop: {
        position: 'absolute',
        bottom: 10, right: 10,
        width: 36, height: 36,
        backgroundColor: '#000000AA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row'
    }
});
