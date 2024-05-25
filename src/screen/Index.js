import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, View, StyleSheet, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Base64 } from 'js-base64';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import DailyItem from '../component/DailyItem';
import { GlobalStyle } from '../common/GlobalStyle';

const data = [
    {
        title: 'Section 1', data: [
            { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1', thumb: '', price: 19 },
            { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳2', thumb: '', price: 19 },
            { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳3', thumb: '', price: 0 },
            { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳4', thumb: '', price: 19 },
            { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳5', thumb: '', price: 19 }
        ]
    },
    {
        title: 'Section 2', data: [
            { title: '2英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1', thumb: '', price: 19 },
            { title: '2英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳2', thumb: '', price: 19 },
            { title: '2英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳3', thumb: '', price: 19 },
            { title: '2英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳4', thumb: '', price: 19 },
            { title: '2英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳5', thumb: '', price: 19 }
        ]
    },
    {
        title: 'Section 3', data: [
            { title: '3英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1', thumb: '', price: 19 },
            { title: '3英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳2', thumb: '', price: 19 },
            { title: '3英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳3', thumb: '', price: 19 },
            { title: '3英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳4', thumb: '', price: 19 },
            { title: '3英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳5', thumb: '', price: 19 }
        ]
    },
    // Add more sections as needed
];


const Index = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [typeData, setTypeData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        // 在组件挂载时加载数据
        queryDataList();
    }, []);

    const queryDataList = () => {
        let req = {
            num: 6,
            pageSize: 5
        }

        HttpUtil.postReq(Util.CLIP_TYPE_DATA, req, (msg, data) => {
            if (data.length > 0) {
                setTypeData(data);
            }
            setRefreshing(false);
        })
    }

    const onRefresh = () => {
        setRefreshing(true);
        setTypeData([]);
        queryDataList();
        setTimeout(() => {
            setRefreshing(false);
        }, 10000);
    };

    const renderSectionHeader = ({ section }) => (
        <View style={styles.sectionHeader}>
            <Text style={{ color: GlobalStyle.black, fontWeight: 'bold', fontSize: GlobalStyle.textFont }}>{section.title}</Text>
        </View>
    );

    //查看更多
    const btn1Click = (key) => {
        navigation.navigate("All", { title: key, hideButton: true });
    }


    //换一批
    const btn2Click = (key) => {

        let req = {
            key: key,
            pageSize: 5
        }

        HttpUtil.postReq(Util.CLIP_KEY, req, (msg, data) => {
            if (data.length > 0) {

                // Create a copy of typeData
                let newData = [...typeData];
                // Find the section in typeData that matches the provided title
                const sectionIndex = newData.findIndex(section => section.title === key);

                if (sectionIndex !== -1) {
                    // Modify the desired part of the section's data
                    newData[sectionIndex].data = data;

                    // Update the state with the modified copy
                    setTypeData(newData);
                }
            }
        })
    }


    const renderItem = ({ item, index }) => {
        return <DailyItem data={item} nav={navigation} index={index} btn1Callback={btn1Click} btn2Callback={btn2Click} />
    };



    return (
        <FlatList
            style={{ backgroundColor: GlobalStyle.sysBg() }}
            data={typeData}
            renderItem={renderItem}

            keyExtractor={(item, index) => index.toString()}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
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

export default Index;
