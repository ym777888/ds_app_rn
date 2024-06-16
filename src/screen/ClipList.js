import React, { useState, useEffect, useRef, useCallback} from 'react';
import { FlatList, Text, View, StyleSheet, RefreshControl, Image } from 'react-native';
import { useNavigation, useRoute, useFocusEffect  } from '@react-navigation/native';
import { Base64 } from 'js-base64';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import ListItem from '../component/ListItem';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';

const data = [
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1', thumb: '', price: 19 },
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳2', thumb: '', price: 19 },
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳3', thumb: '', price: 0 },
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳4', thumb: '', price: 19 },
    // Add more sections as needed
];


const ClipList = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [typeData, setTypeData] = useState([]);
    const [data, setData] = useState([]); // 初始数据
    const [dataEnd, setDataEnd] = useState(false);
    const [isOnEndReachedEnabled, setIsOnEndReachedEnabled] = useState(false);//自动更多开关
    const navigation = useNavigation();
    const route = useRoute(); // 使用 useRoute 钩子获取路由参数
    const currentPageRef = useRef(1);
    const hasInit = useRef(false);
    const pageArr = useRef([]);
    const flatListRef = useRef(null);

    // 从路由参数中获取 category
    const { category } = route.params;

    useFocusEffect(
        useCallback(() => {
            if(!hasInit.current){
                hasInit.current = true;
                getMaxPage();
            }
        }, [])
    );

    useEffect(() => {
        if (typeData) {
            setData(typeData); // 更新数据
        }
    }, [typeData]);


    const getMaxPage = () => {
        let req = {
            k: category,
            pageSize: Util.PAGE_SIZE
        };

        HttpUtil.postReq(Util.CLIP_MAX_PAGE, req, (msg, data) => {
            pageArr.current = shuffleArray(data);
            queryDataList();
        })
    }

    //打乱数组
    const shuffleArray = (maxPage) => {
        const array = Array.from({ length: maxPage }, (_, i) => i + 1);

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }

        return array;
    }

    const queryDataList = () => {
        let req = {
            k: category,
            p: pageArr.current[currentPageRef.current],
            pageSize: 10,
            code: RNStorage.code ? RNStorage.code : Util.DEF_CODE
        };

        HttpUtil.postReq(Util.CLIP_DATA, req, (msg, newData) => {
            if (newData.length > 0) {
                setTypeData(prevData => [...prevData, ...newData]); // 使用函数式更新，将新数据添加到原有数据列表中
            } else {
                setDataEnd(true);
            }
            setRefreshing(false);
            setIsOnEndReachedEnabled(true);
        })
    }

    const loadMoreData = () => {
        if (dataEnd || !isOnEndReachedEnabled) {
            return;
        }
        currentPageRef.current += 1;
        queryDataList();
    };

    const onRefresh = () => {
        setRefreshing(true);
        currentPageRef.current = 1; // 加载下一页数据
        setTypeData([]);
        queryDataList();
        setTimeout(() => {
            setRefreshing(false);
        }, 10000);
    };

    const renderItem = ({ item, index }) => {
        return <ListItem data={item} nav={navigation} index={index} />
    };


    return (
        <FlatList
            style={{ backgroundColor: GlobalStyle.setBg(RNStorage.isDark) }}
            data={data}
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
        />
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    sectionHeader: {

    },

});

export default ClipList;
