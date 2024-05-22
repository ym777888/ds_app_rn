import React,{ useState, useEffect }  from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, RefreshControl, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import ListItemSmall from '../component/ListItemSmall';

const Fav = () => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // 当前页数
    const [dataList, setDataList] = useState([]); // 初始数据
    const route = useRoute(); // 使用 useRoute 钩子获取路由参数

    useEffect(() => {
        // 在组件挂载时加载数据
        queryDataList();
    }, []);


    const renderItem = ({ item, index }) => {
        return <ListItemSmall data={item} nav={navigation} index={index} />
    };

    const renderHeader = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ fontSize: 12, color: '#993333'}}>已购视频只保留24小时免费观看</Text>
            </View>
        );
    };

    const loadMoreData = () => {
        setCurrentPage(prevPage => prevPage + 1); // 加载下一页数据
        queryDataList();
    };

    const { type } = route.params;

    const onRefresh = () => {
        setRefreshing(true);
        // 执行你的刷新操作，比如重新加载数据
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // 模拟加载延迟，实际使用时删除
    };


    
    const queryDataList = () => {
        let req = {
            p: currentPage, // 根据当前页数加载数据
            pageSize: 10
        };
    
        if(type=="fav"){
            HttpUtil.postReq(Util.FAV_LIST, req, (msg, newData) => {
                if (newData.length > 0) {
                    setDataList(prevData => [...prevData, ...newData]); // 使用函数式更新，将新数据添加到原有数据列表中
                }
            })
        }else if(type=="recom"){
            HttpUtil.postReq(Util.RECOM_LIST, req, (msg, newData) => {
                if (newData.length > 0) {
                    setDataList(prevData => [...prevData, ...newData]); // 使用函数式更新，将新数据添加到原有数据列表中
                }
            })
        }

    }


    return (
        <View style={styles.row}>
            <TouchableWithoutFeedback onPress={() => { navigation.goBack() }}>
                <View>
                    <Image source={require('../../assets/icon_back.png')} style={{ width: 34, height: 34 }} tintColor="#888888" />
                </View>
            </TouchableWithoutFeedback>
            <FlatList
                style={{ backgroundColor: GlobalStyle.sysBg() }}
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
        margin: GlobalStyle.marginTop,
        flexDirection: 'column',
        marginHorizontal: 10,
    },

});