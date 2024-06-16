import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableWithoutFeedback, FlatList, RefreshControl, Image,TextInput } from 'react-native';
import { GlobalStyle } from '../common/GlobalStyle';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import GridItem from '../component/GridItem';
import NavTitle from '../component/NavTitle';
import { RNStorage } from '../common/RNStorage';



const Search = () => {
    const [clipType, setClipType] = useState([]);
    const navigation = useNavigation();
    const [dataEnd, setDataEnd] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDataList] = useState([]); // 初始数据
    const [text, setText] = useState('');
    const route = useRoute(); // 使用 useRoute 钩子获取路由参数
    const currentPageRef = useRef(1);
    const flatListRef = useRef(null);
    const keyword = useRef(null);
    const inputRef = useRef(null);


    useEffect(() => {
        handleFocus();
    }, []);


    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const renderItem = ({ item, index }) => {
        return <GridItem data={item} nav={navigation} index={index} />
    };

    const loadMoreData = () => {
        console.log('loadMoreData');
        if (dataEnd) {
            return;
        }
        currentPageRef.current += 1;
        queryDataList();
    };

    const onRefresh = () => {
        setRefreshing(true);
        currentPageRef.current = 1; // 加载下一页数据
        setDataList([]);
        queryDataList();
        setTimeout(() => {
            setRefreshing(false);
        }, 10000);
    };

    const queryDataList = () => {
        let req = {
            k: keyword.current,
            p: currentPageRef.current,
            pageSize: Util.PAGE_SIZE,
            code: RNStorage.code ? RNStorage.code : Util.DEF_CODE
        };

        HttpUtil.postReq(Util.CLIP_DATA, req, (msg, newData) => {
            if (newData.length > 0) {
                setDataList(prevData => [...prevData, ...newData]); // 使用函数式更新，将新数据添加到原有数据列表中
            } else {
                setDataEnd(true);
            }
            setRefreshing(false);
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
        currentPageRef.current = 1;
        setDataList([]);
        setDataEnd(false);
        queryDataList();
    }

    return (
        <View style={styles.row}>
            <View style={styles.navBox}>
                <TouchableWithoutFeedback onPress={()=>{ navigation.goBack()}}>
                <Image source={require('../../assets/icon_back.png')} style={styles.back} tintColor="#888888" />
                </TouchableWithoutFeedback>
                <View style={styles.search}>
                    <Image source={require('../../assets/icon_search.png')} style={{ width: 24, height: 24, borderRadius: 5 }} tintColor="#cccccc" />
                    <TextInput style={styles.searchTxt} placeholder="搜索国产、日韩..." numberOfLines={1} onChangeText={setText} ref={inputRef} />
                </View>
                <TouchableWithoutFeedback onPress={()=>{clickKey(text)}}>
                <View style={styles.right}>
                    <Text style={{ fontSize: 14, color: 'white' }}>搜索</Text>
                </View>
                </TouchableWithoutFeedback>
            </View>
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
                onEndReachedThreshold={0.1} // 距离列表底部多少比例触发 onEndReached 函数
                numColumns={2}
            />
            <TouchableWithoutFeedback onPress={goTop}>
                <View style={styles.btnTop}>
                    <Image tintColor={'#FFFFFFAA'} style={{ width: 40, height: 40 }} source={require('../../assets/icon_up.png')}></Image>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

export default Search;

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
    },
    back: {
        width: 34,
        height: 34,
    },
    navBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
    },
    right: {
        width: 80,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CC0033',
        marginRight: 10,
        borderRadius: 15
    },
    search: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginHorizontal: 10,
    },
    searchTxt: {
        flex: 1,
        height: 30,
        lineHeight: 30,

        marginLeft: 5,
        padding: 0,

    },
});
