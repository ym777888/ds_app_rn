import React, { useState, useEffect } from 'react';
import { SectionList, Text, View, StyleSheet, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Base64 } from 'js-base64';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import DailyItem from '../component/DailyItem';
import { GlobalStyle } from '../common/GlobalStyle';

const data = [
    { title: 'Section 1', data: ['Item 1', 'Item 2', 'Item 3'] },
    { title: 'Section 2', data: ['Item 4', 'Item 5', 'Item 6'] },
    // Add more sections as needed
];


const Index = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [typeData, setTypeData] = useState(null);

    useEffect(() => {
        // 在组件挂载时加载数据
        queryDataList();
    }, []);

    const queryDataList = () => {
        let req = {
        }

        HttpUtil.postReq(Util.CLIP_TYPE, req, (msg, data) => {
            if (data.length > 0) {
                setTypeData(data);
                const decodedString = Base64.decode(data);
                let arr = decodedString.split(',');
            }
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
        // 执行你的刷新操作，比如重新加载数据
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // 模拟加载延迟，实际使用时删除
    };

    const renderSectionHeader = ({ section }) => (
        <View style={styles.sectionHeader}>
            <Text style={{ color: GlobalStyle.black, fontWeight: 'bold', fontSize: GlobalStyle.textFont }}>{section.title}</Text>
        </View>
    );

    const renderItem = ({ item, index }) => {
        const navigation = useNavigation();
        return <DailyItem data={item} nav={navigation} index={index} />
    };

    return (
        <View style={styles.container}>
            <SectionList
                sections={data}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
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

export default Index;
