import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, RefreshControl, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import ListItemSmall from '../component/ListItemSmall';
import NavTitle from '../component/NavTitle';
import { RNStorage } from '../common/RNStorage';

const Fav = () => {
    const navigation = useNavigation();
    const [dataEnd, setDataEnd] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDataList] = useState([]); // 初始数据
    const route = useRoute(); // 使用 useRoute 钩子获取路由参数
    const currentPageRef = useRef(1);
    const [isOnEndReachedEnabled, setIsOnEndReachedEnabled] = useState(false);//自动更多开关

    const { type, title } = route.params;

    useEffect(() => {
        queryDataList();
    }, []);

    const renderItem = ({ item, index }) => {
        return <ListItemSmall data={item} nav={navigation} index={index} />
    };

    const renderHeader = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#993333' }}>保留30条记录</Text>
            </View>
        );
    };

    const loadMoreData = () => {
        if(dataEnd || !isOnEndReachedEnabled){
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
            pageSize: Util.PAGE_SIZE
        };

        if (type == "fav") {
            HttpUtil.postReq(Util.FAV_LIST, req, (msg, newData) => {
                if (newData.length > 0) {
                    setDataList(prevData => [...prevData, ...newData]); // 使用函数式更新，将新数据添加到原有数据列表中
                }
                setIsOnEndReachedEnabled(true);
            })
        } else if (type == "recom") {
            HttpUtil.postReq(Util.RECOM_LIST, req, (msg, newData) => {
                if (newData.length > 0) {
                    setDataList(prevData => [...prevData, ...newData]); // 使用函数式更新，将新数据添加到原有数据列表中
                }
                setIsOnEndReachedEnabled(true);
            })
        }

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
        <View style={styles.row}>
            <NavTitle nav={navigation} title={title} rightTxt={'清除'} rightAction={doClear} />
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

export default Fav;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'column',
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
        flex: 1,
    },

});