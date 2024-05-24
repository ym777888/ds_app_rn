import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableWithoutFeedback, Linking } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast, { DURATION } from 'react-native-easy-toast'
import { GlobalStyle } from '../common/GlobalStyle';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import { RNStorage } from '../common/RNStorage';

const BuyVip = () => {
    const navigation = useNavigation();
    const [listData, setListData] = useState([]);
    const [payListData, setPayListData] = useState([]);
    const [showPop, setShowPop] = useState(false);
    const [productId, setProductId] = useState(null);
    const [orderNo, setOrderNo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const timerRef = useRef(null);

    const guestInfo = () => {
        let req = {
        }

        HttpUtil.postReq(Util.USER_INFO, req, (msg, data) => {
            setUserInfo(data.user);
            RNStorage.userInfo = data.user;
        });
    }

    const getImg = (icon) => {
        if (icon == "1") {
            return require('../../assets/icon_wx.png')
        } else if (icon == "2") {
            return require('../../assets/icon_alipay.png')
        }
    }

    const openLink = (url) => {
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    console.log("无法识别链接: " + url);
                }
            })
            .catch((err) => console.error('链接错误', err));
    };

    const getProduct = () => {

        let req = {
            type: 9,
        }

        HttpUtil.postReq(Util.PRODUCT_LIST, req, (msg, data) => {
            setListData(data)
        })
    }


    const getPayList = (item) => {
        setProductId(item.productId);

        let req = {
            code: RNStorage.code ? RNStorage.code : "",
            price: item.price
        }

        HttpUtil.postReq(Util.PAY_LIST, req, (msg, data) => {
            setPayListData(data);
            setShowPop(true);
        })
    }

    const getOrderNo = (payId) => {
        let req = {
            payId: payId,
            code: RNStorage.code ? RNStorage.code : "",
            productId: productId
        }

        HttpUtil.postReq(Util.PAY_ORDER_NO, req, (msg, data) => {
            setOrderNo(data.orderNo);
            if (data.payUrl) {
                openLink(data.payUrl);
            }
        })
    }

    const checkOrder = () => {
        if (orderNo == null || orderNo == '') {
            return;
        }

        let req = {
            orderNo: orderNo
        }

        HttpUtil.postReq(Util.CHECK_ORDER_PAY, req, (msg, data) => {
            if (data) { //已支付
                setOrderNo(null);
                setShowPop(false);
                if (msg) {
                    this.toast.show(msg, 1000);
                }
                guestInfo();
            }
        })
    }

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        // Clear previous interval
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Set up new interval
        timerRef.current = setInterval(() => {
            checkOrder();
        }, 5000);

        // Clear interval on component unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [orderNo]);

    const renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => { getPayList(item) }}>
                <View style={styles.itemCard}>
                    <View style={{ backgroundColor: '#FFCC00', height: 24, width: '100%', borderRadius: 10, justifyContent: 'center' }}>
                        <Text style={{ marginLeft: 10, fontWeight: 'bold', color: 'black'}}>{item.name}</Text>
                        <View style={{ height: 15, width: '100%', backgroundColor: '#FFCC00', position: 'absolute', left: 0, bottom: 0, zIndex: -1 }}></View>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', padding: 10 }}>
                        <Text style={styles.price2}>¥{item.price}</Text>
                        <Text style={{ color: '#FFFF99', fontSize: 14}}>{item.remark}</Text>
                        {item.plusDiamond > 0 ? (<Text style={{ color: '#FFFF99', fontSize: 14, marginLeft: 10}}>多送<Text style={{ color: '#FFFFCC', fontSize: 14}}>{item.plusDiamond}</Text><Image resizeMode='contain' style={{ width: 12, height: 12 }} source={require('../../assets/icon_diamond3.png')}></Image></Text>) : <View><Text> </Text></View>}
                    </View>

                </View>
            </TouchableWithoutFeedback>
        )
    };

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={{ width: 5, height: 20, backgroundColor: '#CC0033' }}></View>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', marginLeft: 8 }}>购买会员</Text>
            </View>
        );
    };

    const renderFoot = () => {
        return (
            <View style={styles.footContainer}>
                <Text style={{ fontSize: 14, color: '#FF6666', marginLeft: 8, marginVertical: 4, fontWeight: 'bold' }}>会员身份可以无限免费观看所有影片</Text>
                <Text style={{ fontSize: 14, color: '#FF6666', marginLeft: 8, marginVertical: 4, fontWeight: 'bold' }}>钻石可以观看视频、在游戏中消费</Text>
                <TouchableWithoutFeedback onPress={() => { openChat() }}>
                    <Text style={{ fontSize: 14, color: '#CC0033', marginLeft: 8, marginVertical: 4, textDecorationLine: 'underline' }}>充值失败？联系客服</Text>
                </TouchableWithoutFeedback>
            </View>
        );
    };


    const renderPayFoot = () => {
        return (
            <View style={{ marginTop: 20 }}>
                <Text style={styles.tip}>支付失败，请尝试更换通道。</Text>
                <Text style={styles.tip}>微信风控严重，推荐使用支付宝。</Text>
            </View>
        )
    }

    const renderPayItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => { getOrderNo(item.id) }}>
                <View style={item.icon == "1" ? styles.wx : styles.ali}>
                    <Image style={styles.iconPay} source={getImg(item.icon)}></Image>
                    <Text style={{ color: 'white', fontSize: 14 }}>{item.icon == "1" ? '微信' : '支付宝'}支付{index + 1}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    const openChat = () => {
        navigation.navigate('Chat', { data: {} });
    }

    return (
        <View style={styles.box}>
            <TouchableWithoutFeedback onPress={() => { navigation.goBack() }}>
                <View>
                    <Image source={require('../../assets/icon_back.png')} style={{ width: 34, height: 34 }} tintColor="#888888" />
                </View>
            </TouchableWithoutFeedback>

            <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={styles.title1}>
                        <Image resizeMode='contain' style={{ width: 20, height: 20, marginHorizontal: 3 }} source={require('../../assets/icon_vip2.png')}></Image>
                        <Text style={{ color: 'white' }}>会员有效期</Text>
                    </View>
                    <View>
                        <Text style={{ color: 'white', fontSize: 12 }}></Text>
                    </View>
                </View>
                <Text style={styles.num}>{userInfo != null ? Util.getVip(userInfo.vipTime) : Util.getVip(RNStorage.userInfo.vipTime)}</Text>
            </View>
            <FlatList
                style={{ backgroundColor: GlobalStyle.sysBg() }}
                data={listData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1}

                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFoot}
            />
            <Toast ref={(toast) => this.toast = toast} position='center' style={{ backgroundColor: '#009966' }} textStyle={{ color: 'white' }} />
            {showPop && (
                <View style={styles.modalBg}>
                    <View style={styles.modal}>
                        <TouchableWithoutFeedback onPress={() => { setShowPop(false) }}>
                            <Image resizeMode='contain' style={{ width: 34, height: 34, opacity: 0.4, position: 'absolute', right: 0, top: 0 }} source={require('../../assets/icon_close.png')}></Image>
                        </TouchableWithoutFeedback>
                        <View style={styles.popTitle}><Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>选择支付方式:</Text></View>
                        <FlatList
                            style={{ backgroundColor: GlobalStyle.sysBg(), marginTop: 20 }}
                            data={payListData}
                            renderItem={renderPayItem}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                            columnWrapperStyle={styles.flatListContent2}
                            ListFooterComponent={renderPayFoot}
                        />

                    </View>
                </View>
            )}
        </View>

    );
};

export default BuyVip;


const styles = StyleSheet.create({
    box: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: GlobalStyle.sysBg()
    },
    row: {
        margin: GlobalStyle.marginTop,
        flexDirection: 'column',
        marginHorizontal: 10,
    },
    card: {
        backgroundColor: '#333333',
        margin: 10,
        borderRadius: 10,
        height: 110,
        padding: 10,

    },
    itemCard: {
        height: 80,
        backgroundColor: '#444444',
        borderColor: '#FF6600',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginHorizontal: 10,
        marginVertical: 8,
        flexDirection: 'column'
    },
    title: {
        fontSize: 14,
        color: '#663300',

    },
    price: {
        fontSize: 24,
        color: '#990033',
        fontWeight: 'bold',
        marginVertical: 10,
    },
    price2: {
        fontSize: 22,
        color: '#FFCC00',
        fontWeight: 'bold',
        width: 70
    },
    plus: {
        color: '#990033',
        fontSize: 12
    },
    plus2: {
        color: '#CC6600',
        fontSize: 12
    },
    red: {
        color: '#FF0000'
    },
    flatListContent: {
        justifyContent: 'center',
        marginHorizontal: 3
    },
    flatListContent2: {
        justifyContent: 'space-between',
        marginVertical: 8
    },
    title1: {
        flexDirection: 'row'
    },
    icon: {
        width: 14,
        height: 14,
        marginHorizontal: 3
    },
    num: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        margin: 10
    },
    footContainer: {
        flexDirection: 'column',
        margin: 10,
        backgroundColor: '#CCFFFF',
        borderRadius: 10,
        padding: 10
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
        width: '70%',
        height: 400,
        borderRadius: 14,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20
    },
    wx: {
        flexDirection: 'row',
        backgroundColor: '#38b22d',
        justifyContent: 'center',
        alignItems: 'center',
        width: '47%',
        borderRadius: 45,
        height: 34,
    },
    ali: {
        flexDirection: 'row',
        backgroundColor: '#0475fe',
        justifyContent: 'center',
        alignItems: 'center',
        width: '47%',
        borderRadius: 45,
        height: 34,
    },
    iconPay: {
        width: 30,
        height: 30,
        marginHorizontal: 5
    },
    popTitle: {
        backgroundColor: '#FF9933', borderRadius: 20, width: '70%', height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10
    },
    tip: {
        color: '#FF6666',
        fontSize: 14
    }
});