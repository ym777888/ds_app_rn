import React, { createRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback, FlatList, ImageBackground } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video-bilibili';
import { GlobalStyle } from '../common/GlobalStyle';
import GridItem from '../component/GridItem';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from '../common/HttpUtil';
import Util from "../common/Util";


const testData = [
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1', thumb: '', price: 19 },
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳2', thumb: '', price: 19 },
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳3', thumb: '', price: 0 },
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳4', thumb: '', price: 19 },
    // Add more sections as needed
];

const Player = () => {
    const playerRef = createRef();
    const route = useRoute();
    const navigation = useNavigation();
    const [canPlay, setCanPlay] = useState(false);
    const [showPop, setShowPop] = useState(false);
    const [clipUrl, setClipUrl] = useState('');
    const { data } = route.params; // 获取传递的数据
    const [isFav, setIsFav] = useState(false);
    const [isRecom, setIsRecom] = useState(false);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        getMoreList();
        checkFavRecom();
    }, [])

    const renderItem = ({ item, index }) => {
        return <GridItem data={item} nav={navigation} index={index} />
    };

    const checkBuy = () => {
        let req = {
            clipKey: data.uuid,
            price: data.price
        }

        HttpUtil.postReq(Util.CHECK_BUY, req, (msg, data) => {
            setCanPlay(data.canPlay)
            if (!data.canPlay) {
                setShowPop(true)
            } else {
                setShowPop(false)
                setClipUrl(data.url);
                if (msg) {
                    Util.showToast(msg, 1000);
                }
            }
        })
    }

    //推荐
    const getMoreList = () => {
        let req = {
            title: data.title,
            num: Util.PAGE_SIZE,
            code: RNStorage.code ? RNStorage.code : ""
        }

        HttpUtil.postReq(Util.MORE_LIST, req, (msg, data) => {
            setDataList(data);
        })
    }

    const checkFavRecom = () => {
        let req = {
            clipKey: data.uuid,
        }

        HttpUtil.postReq(Util.CHECK_FAV_RECOM, req, (msg, data) => {
            setIsFav(data.fav);
            setIsRecom(data.recom);
        })
    }


    const addFav = () => {
        let req = {
            clipKey: data.uuid,
        }



        if (isFav) {
            HttpUtil.postReq(Util.DEL_FAV, req, (msg, data) => {

            })
            setIsFav(false);
        } else {
            HttpUtil.postReq(Util.ADD_FAV, req, (msg, data) => {

            })
            setIsFav(true);
        }



    }

    const addRecom = () => {
        let req = {
            clipKey: data.uuid,
        }



        if (isRecom) {
            HttpUtil.postReq(Util.DEL_RECOM, req, (msg, data) => {

            })
            setIsRecom(false);
        } else {
            HttpUtil.postReq(Util.ADD_RECOM, req, (msg, data) => {

            })
            setIsRecom(true);
        }

    }

    const openChat = () => {
        navigation.navigate('Chat', { data: {} });
    }

    const HeaderComponent = () => (
        <View>
            <View style={styles.row}>
                <View style={{ width: 5, height: 20, backgroundColor: '#CC0033' }}></View>
                <Text numberOfLines={2} style={styles.title}>{data.title}</Text>
            </View>
            <View style={styles.row2}>
                <TouchableWithoutFeedback onPress={addRecom}>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={isRecom ? require('../../assets/icon_heart2.png') : require('../../assets/icon_heart.png')}></Image>
                        <Text style={styles.btnTitle}>点赞</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={addFav}>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={isFav ? require('../../assets/icon_star2.png') : require('../../assets/icon_star.png')}></Image>
                        <Text style={styles.btnTitle}>收藏</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_share.png')}></Image>
                        <Text style={styles.btnTitle}>分享</Text>
                    </View>
                </TouchableWithoutFeedback>
                {/* <TouchableWithoutFeedback>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_write.png')}></Image>
                        <Text style={styles.btnTitle}>退款</Text>
                    </View>
                </TouchableWithoutFeedback> */}
                <TouchableWithoutFeedback onPress={openChat}>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_service.png')}></Image>
                        <Text style={styles.btnTitle}>客服</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={[styles.row,{ justifyContent: 'center'}]}>
                {!RNStorage.isLogin && (
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('Login', { data: {} }); }}>
                        <View style={styles.btn1}><Text style={styles.btn1Title}>注册 | 登录</Text></View>
                    </TouchableWithoutFeedback>
                )}

                <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyDiamond', { data: {} }); }}>
                    <View style={styles.btn1}><Text style={styles.btn1Title}>购买钻石</Text></View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyVip', { data: {} }); }}>
                    <View style={styles.btn1}><Text style={styles.btn1Title}>充值会员</Text></View>
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.row}>
                <View style={{ width: 5, height: 20, backgroundColor: '#CC0033' }}></View>
                <Text style={styles.title}>为你推荐</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.topBox}>
            {canPlay && clipUrl ? (
                <Video
                    ref={playerRef}
                    styles={{ container: [{ backgroundColor: 'black' }] }}
                    source={{ uri: clipUrl }}
                    poster={data.thumb}
                    title={data.title}
                    navigation={navigation}
                />
            ) : (

                <View>
                    <ImageBackground style={styles.normal} source={{ uri: data.thumb }}>
                        <View style={styles.mask}>
                            <TouchableWithoutFeedback onPress={() => { navigation.goBack() }}>
                                <Image tintColor={'#FFFFFF'} resizeMode='contain' style={{ position: 'absolute', left: 10, top: 0, opacity: 0.5 }} source={require('../../assets/back.png')}></Image>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={checkBuy}>
                                <Image tintColor={'#FFFFFF'} resizeMode='contain' style={{ width: 120, height: 60, opacity: 0.5 }} source={require('../../assets/icon_clip.png')}></Image>
                            </TouchableWithoutFeedback>
                        </View>
                    </ImageBackground>
                </View>
            )}

            <View style={styles.row}>
                <View style={styles.badge}>
                    <Image style={styles.coin} source={require('../../assets/icon_diamond3.png')}></Image>
                    <Text style={styles.money}>{data.price}</Text>
                </View>
                <View style={styles.url}>
                    <Text style={styles.small}>永久网址：</Text>
                    <Text style={styles.small} numberOfLines={1}> {RNStorage.info?.appSite}</Text>
                </View>
            </View>

            <FlatList
                style={{ backgroundColor: GlobalStyle.sysBg() }}
                data={dataList}
                renderItem={renderItem}
                ListHeaderComponent={<HeaderComponent />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
            />
            {showPop && (
                <View style={styles.modalBg}>
                    <View style={styles.modal}>
                        <TouchableWithoutFeedback onPress={() => { setShowPop(false) }}>
                            <Image resizeMode='contain' style={{ width: 34, height: 34, opacity: 0.4, position: 'absolute', right: 0, top: 0 }} source={require('../../assets/icon_close.png')}></Image>
                        </TouchableWithoutFeedback>
                        <Text style={styles.tip}>您余额不足，请充值后观看:</Text>
                        <Text style={styles.tip2}>本片价格<Text style={{ color: 'red' }}>{data.price}</Text>钻石，会员全站免费</Text>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyDiamond', { data: {} }); }}>
                            <View style={styles.btnBuy}>
                                <Text style={styles.btnBuyTxt}>购买钻石</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyVip', { data: {} }); }}>
                            <View style={[styles.btnBuy, { backgroundColor: '#FF9900' }]}>
                                <Text style={styles.btnBuyTxt}>购买会员</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            )}

        </View>
    );
}


const styles = StyleSheet.create({
    row: {
        margin: GlobalStyle.marginTop,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    row2: {
        margin: GlobalStyle.marginTop,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn1: {
        backgroundColor: '#993333',
        width: 110,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 8
    },
    btn1Title: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    btn: {
        width: 60,
        height: 60,
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    btnImg: {
        width: 30,
        height: 30,
    },
    btnTitle: {
        fontSize: 14,
        color: GlobalStyle.sysFont()
    },
    topBox: {
        flexDirection: 'column',
        backgroundColor: GlobalStyle.sysBg(),
        flex: 1,
    },
    coin: {
        width: 14,
        height: 14,
    },
    money: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 16
    },
    free: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    badge: {
        width: 40,
        height: 16,
        backgroundColor: '#993333',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    url: {
        flexDirection: 'row'
    },
    title: {
        overflow: 'hidden', color: '#000000', fontSize: 14, flex: 1, marginHorizontal: 10, lineHeight: 22
    },
    small: {
        fontSize: 14,
        color: GlobalStyle.sysFont(),
        fontWeight: 'bold'
    },
    normal: {
        width: '100%',
        height: Dimensions.get('window').width / 1.77,
    },
    mask: {
        backgroundColor: '#00000099',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBg: {
        position: 'absolute',
        backgroundColor: '#00000033',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: '#FFFFFF',
        width: '65%',
        height: 400,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnBuy: {
        width: '70%',
        height: 40,
        backgroundColor: '#0099CC',
        justifyContent: 'center',
        marginVertical: 10,
        alignItems: 'center',
        borderRadius: 10
    },
    btnBuyTxt: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    tip: {
        color: '#FF0000',
        fontSize: 16,
        width: '80%',
        textAlign: 'center'
    },
    tip2: {
        color: '#555555',
        fontSize: 14,
        width: '80%',
        marginVertical: 10,
        textAlign: 'center'
    }
})

export default Player;
