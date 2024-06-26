import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, RefreshControl, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import DeliveryItem from '../component/DeliveryItem';
import NavTitle from '../component/NavTitle';
import { RNStorage } from '../common/RNStorage';
const MyGift = () => {
    const navigation = useNavigation();
    const [dataEnd, setDataEnd] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDataList] = useState([]); // 初始数据
    const route = useRoute(); // 使用 useRoute 钩子获取路由参数
    const currentPageRef = useRef(1);

    useEffect(() => {
        queryDataList();
    }, []);

    const renderItem = ({ item, index }) => {
        return <DeliveryItem data={item} nav={navigation} index={index} />
    };

    const renderHeader = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {/* <Text style={{ fontSize: 12, color: '#993333' }}>记录保留3天</Text> */}
            </View>
        );
    };

    const loadMoreData = () => {
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
            p: currentPageRef.current, // 根据当前页数加载数据
            pageSize: 10
        };

        HttpUtil.postReq(Util.DELIVERY_LIST, req, (msg, newData) => {
            if (newData.length > 0) {
                setDataList(prevData => [...prevData, ...newData]); // 使用函数式更新，将新数据添加到原有数据列表中
            }
        })

        setRefreshing(false);
    }


    const doClear = () => {
        setDataList([]);
        if (type == "fav") {
            HttpUtil.postReq(Util.CLEAR_FAV)
        } else if (type == "recom") {
            HttpUtil.postReq(Util.CLEAR_RECOM)
        }
    }

    return (
        <View style={[styles.row, { backgroundColor: GlobalStyle.setBg(RNStorage.isDark), }]}>
            <NavTitle nav={navigation} title={'兑换记录'} />
            <FlatList
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
                numColumns={1}
                ListHeaderComponent={renderHeader}
            />
        </View>
    );
};

export default MyGift;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'column',
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
        flex: 1,
    },

});