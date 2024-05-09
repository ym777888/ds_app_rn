import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, RefreshControl, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Base64 } from 'js-base64';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import ListItem from '../component/ListItem';
import { GlobalStyle } from '../common/GlobalStyle';

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
    const [currentPage, setCurrentPage] = useState(1); // 当前页数
    const [data, setData] = useState([]); // 初始数据
    const navigation = useNavigation();
    const route = useRoute(); // 使用 useRoute 钩子获取路由参数

    // 从路由参数中获取 category
    const { category } = route.params;

    useEffect(() => {
        // 在组件挂载时加载数据
        queryDataList();
    }, []);

    useEffect(() => {
        if (typeData) {
            setData(typeData); // 更新数据
        }
    }, [typeData]);

    const queryDataList = () => {
        let req = {
            k: category,
            p: currentPage, // 根据当前页数加载数据
            pageSize: 10
        };
    
        HttpUtil.postReq(Util.CLIP_DATA, req, (msg, newData) => {
            if (newData.length > 0) {
                setTypeData(prevData => [...prevData, ...newData]); // 使用函数式更新，将新数据添加到原有数据列表中
            }
        })
    }

    const loadMoreData = () => {
        setCurrentPage(prevPage => prevPage + 1); // 加载下一页数据
        queryDataList();
    };

    const onRefresh = () => {
        setRefreshing(true);
        // 执行你的刷新操作，比如重新加载数据
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // 模拟加载延迟，实际使用时删除
    };

    const renderItem = ({ item, index }) => {
        return <ListItem data={item} nav={navigation} index={index} />
    };


    return (
        <FlatList
            style={{ backgroundColor: GlobalStyle.sysBg() }}
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
