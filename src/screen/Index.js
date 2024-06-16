import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Text, View, StyleSheet, RefreshControl, Image, TouchableWithoutFeedback, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { WebView } from 'react-native-webview';
import { Base64 } from 'js-base64';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import DailyItem from '../component/DailyItem';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import { ModalManager } from '../common/ModalManager';

const { width } = Dimensions.get('window');

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
    const [showPop, setShowPop] = useState(false);
    const [ads, setAds] = useState(null);
    const navigation = useNavigation();
    const [freeClip, setFreeClip] = useState(null);


    useEffect(() => {
        getAds()
        getDailyCoin();
        getDailyFree();
        queryDataList();
    }, []);

    const getDailyCoin = () => {
        let req = {
            code: RNStorage.code ? RNStorage.code : ""
        }

        HttpUtil.postReq(Util.DAILY_COIN, req, (msg, data) => {
            if (data > 0) {
                ModalManager.showModal(
                    '恭喜获得免费观看:' + data + '次',
                    '确定',
                    null,
                    '关闭',
                    null
                )
            }
        })
    }


    const getDailyFree = (key) => {

        let req = {
            code: RNStorage.code ? RNStorage.code : ""
        }

        HttpUtil.postReq(Util.DAILY_FREE, req, (msg, data) => {
            if (data) {
                setFreeClip(data);
            }
        })
    }

    const getAds = () => {
        let req = {
            alias: 'app_pop',
        }

        HttpUtil.postReq(Util.GET_ADV, req, (msg, data) => {
            if (data != null && data != "") {
                setShowPop(true);
                data.content = `<!DOCTYPE html>
                <html lang="zh">
                <head>
                    <meta charset="UTF-8">
                    <meta content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" name="viewport">
                    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
                    <meta http-equiv="Pragma" content="no-cache">
                    <meta http-equiv="Expires" content="0">
                </head>
                <body>`+ data.content + `</body></html>`;

                setAds(data);
            }
        }, (msg, data) => { }, true);
    }

    const queryDataList = () => {
        let req = {
            num: 6,
            pageSize: 5,
            code: RNStorage.code ? RNStorage.code : Util.DEF_CODE
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


    //查看更多
    const btn1Click = (key) => {
        navigation.navigate("All", { title: key, hideButton: true });
    }


    //换一批
    const btn2Click = (key) => {

        let req = {
            key: key,
            pageSize: 5,
            code: RNStorage.code ? RNStorage.code : Util.DEF_CODE
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


    const renderHeader = () => {
        return (freeClip && <TouchableWithoutFeedback onPress={() => { navigation.navigate('Player', { data: freeClip }); }}>
            <View style={styles.free}>
                <Text style={{ color: GlobalStyle.sysFont(), fontWeight: 'bold', fontSize: 16 }}>今日免费</Text>
                <View style={{ width: width }}>
                    <ImageBackground style={{ width: width, height: width * Util.HEIGHT_RATIO }} source={Util.getThumb(freeClip.thumb)}
                        resizeMode={FastImage.resizeMode.cover}>
                        <View style={styles.mask}>
                            <Image tintColor={'#FFFFFF'} resizeMode='contain' style={{ width: 120, height: 60, opacity: 0.7 }} source={require('../../assets/icon_clip.png')}></Image>
                        </View>
                    </ImageBackground>
                    <View style={styles.box}>
                        <Text style={{
                            fontSize: 14,
                            color: GlobalStyle.sysFont(),
                            lineHeight: 22,
                        }} numberOfLines={1}>{freeClip.title}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>)

    }


    return (

        <>
            <FlatList
                style={{ backgroundColor: GlobalStyle.setBg(RNStorage.isDark) }}
                data={typeData}
                renderItem={renderItem}

                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListHeaderComponent={renderHeader}
            />
            {showPop && (
                <View style={styles.modalBg}>
                    <View style={styles.modal}>
                        {ads?.pic && (
                            <FastImage
                                style={styles.img}
                                source={Util.getThumb(ads.pic)}
                                resizeMode='contain'
                            />
                        )}

                        {
                            ads?.content && (
                                <WebView
                                    originWhitelist={['*']}
                                    source={{ html: ads.content }}
                                    style={styles.webview}
                                />
                            )
                        }



                        <TouchableWithoutFeedback onPress={() => { setShowPop(false) }}>

                            <View style={{ position: 'absolute', bottom: -45, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Image tintColor={'#ffffff'} resizeMode='contain' style={{ width: 40, height: 40 }} source={require('../../assets/icon_close.png')}></Image>
                            </View>

                        </TouchableWithoutFeedback>
                    </View>
                </View>
            )}
        </>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    sectionHeader: {

    },
    modalBg: {
        position: 'absolute',
        backgroundColor: '#000000AA',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: '#FFFFFF',
        width: width * 0.8,
        height: 400,
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'column'
    },

    popTitle: {
        backgroundColor: '#FF9933', borderRadius: 20, width: '70%', height: 30, justifyContent: 'center', alignItems: 'center'
    },
    tip: {
        color: '#FF6666',
        fontSize: 14
    },
    img: {
        width: width * 0.8 - 10,
        height: width * 0.8 / 1.8,
        marginTop: 5
    },
    webview: {
        flex: 1,
        width: width * 0.8 - 10,

        borderColor: 'red',
        borderWidth: 1
    },
    free: {
        marginTop: 15
    },
    mask: {
        backgroundColor: '#00000044',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default Index;
