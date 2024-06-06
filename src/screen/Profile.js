import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { XStorage } from 'react-native-easy-app';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from '../common/HttpUtil';
import Util from "../common/Util";
import CellItem from '../component/CellItem';

const packageJson = require('../../package.json');

const { width } = Dimensions.get('window');

const Profile = () => {
    const navigation = useNavigation();
    const [isLogin, setIsLogin] = useState(RNStorage.isLogin);
    const [userInfo, setUserInfo] = useState({});
    const subscription = useRef(null);
    const [showLog,setShowLog] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            guestInfo();
        }, [])
    );

    useEffect(() => {
        // 订阅事件
        if (!subscription.current) {
            subscription.current = eventEmitter.on('RNStorageUpdate', (sdata) => {
                console.log('接收到事件:', sdata);
                setIsLogin(RNStorage.isLogin);
            });
        }

        // 返回一个清理函数，在组件卸载时移除监听器
        return () => {
            if (subscription.current && (typeof subscription.current === "function")) {
                subscription.current.remove();
            }
        };

    }, []);

    const configData = [
        { id: 1, name: '免费观看', tip: '免费观看' + userInfo?.user?.coin + '次', value: userInfo?.user?.coin },
        { id: 2, name: '分享好友', nav: 'Share', value: '奖励免费观看' },
        { id: 3, name: '兑换记录', nav: 'MyGift', value: '' },
        // { id: 4, name: '收货地址', nav: 'Address', value: '' },
        { id: 4, name: '绑定银行卡', nav: 'BindBank', value: '' },
        { id: 5, name: '绑定支付宝', nav: 'BindAlipay', value: '' },
        { id: 6, name: '修改密码', nav: 'Password' },
        { id: 7, name: '当前版本', value: packageJson.version },
    ]

    const guestInfo = () => {
        let req = {
            code: RNStorage.code ? RNStorage.code : ""
        }

        HttpUtil.postReq(Util.USER_INFO, req, (msg, data) => {
            setUserInfo(data);
            RNStorage.userInfo = data.user;
            RNStorage.minPrice = data.minPrice;
            RNStorage.maxPrice = data.maxPrice;
        }, () => {
            setUserInfo(Util.nouser());
            RNStorage.userInfo = Util.nouser();
            RNStorage.isLogin = false;
            RNStorage.accessToken = '';
            RNStorage.token = '';
        }, true);
    }

    const login = () => {
        if (RNStorage.isLogin) {
            RNStorage.isLogin = false;
            RNStorage.accessToken = '';
            RNStorage.token = '';
        } else {
            navigation.navigate('Login', { data: {} });
        }
        setIsLogin(RNStorage.isLogin);
    }

    const logout = () => {

        let req = {
            phone: RNStorage.userInfo.phone,
            token: RNStorage.token
        }

        HttpUtil.postReq(Util.LOGOUT, req, (msg, data) => {
            Util.showToast(msg);
        }, (msg, data) => {
            Util.showToast(msg);
        }, true)

        RNStorage.isLogin = false;
        RNStorage.accessToken = '';
        RNStorage.token = '';
        RNStorage.userInfo = {};
        setUserInfo(Util.nouser());
        setIsLogin(false);
    }

    const renderItem = ({ item, index }) => {
        return <CellItem data={item} nav={navigation} index={index} />
    };

    const renderFooter = () => {
        return (showLog&&<View>
            <Text>111</Text>
        </View>)
    }

    const renderHeader = () => {
        return (
            <View style={{ backgroundColor: GlobalStyle.setBg(RNStorage.isDark)}}>
                <View style={[styles.row1, { justifyContent: 'flex-end' }]}>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate("Message") }}>
                        <View style={{ width: 30, height: 30 }}>
                            <Image tintColor={'#999999'} style={styles.corner} source={require('../../assets/icon_mail2.png')}></Image>
                            {userInfo.newMsg ? (
                                <View style={styles.dot}></View>
                            ) : (
                                <></>
                            )}

                        </View>

                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.row}>
                    <View style={styles.avatar}>
                        <Image resizeMode='contain' style={{ height: 50, width: 50, borderRadius: 90 }} source={require('../../assets/app_icon.png')} ></Image>
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text style={styles.name}>{Util.getNickName(userInfo?.user?.nickname)}</Text>
                        <Text style={styles.name2}>账号:{Util.getNickName(userInfo?.user?.phone)}</Text>
                    </View>
                    {isLogin ? (

                        <TouchableOpacity onPress={logout}>
                            <View style={{ backgroundColor: '#FF6666', width: 100, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                                <Text style={{ color: '#FFFFFF' }}>退出</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (

                        <TouchableOpacity onPress={login}>
                            <View style={{ backgroundColor: '#FF6666', width: 100, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                                <Text style={{ color: '#FFFFFF' }}>注册 | 登录</Text>
                            </View>
                        </TouchableOpacity>
                    )}


                </View>
                <View style={styles.row2}>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyDiamond', { data: {} }); }}>
                        <View style={styles.btn}>
                            <Image style={styles.btnImg} source={require('../../assets/icon_diamond3.png')}></Image>
                            <View style={styles.btnTitle}>
                                <Text style={styles.bigTitle}>钻石余额</Text>
                                <Text style={styles.subTitle}>{userInfo?.user?.diamond}</Text>
                            </View>
                            <Image tintColor='#FF9933' style={styles.btnArrow} source={require('../../assets/icon_arrow.png')}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyVip', { data: {} }); }}>
                        <View style={styles.btn}>
                            <Image style={styles.btnImg} source={require('../../assets/icon_vip2.png')}></Image>
                            <View style={styles.btnTitle}>
                                <Text style={styles.bigTitle}>VIP有效期</Text>
                                <Text style={styles.subTitle}>{Util.getVip(userInfo?.user?.vipTime)}</Text>
                            </View>
                            <Image tintColor='#FF9933' style={styles.btnArrow} source={require('../../assets/icon_arrow.png')}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.col}>

                    <View style={styles.row}>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyDiamond', { data: {} }); }}>
                            <View style={styles.btn2}>
                                <Image style={styles.btn2Img} source={require('../../assets/icon_jewelry.png')}></Image>
                                <Text style={styles.btn2Title}>充值</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('Transfer', { data: {} }); }}>
                            <View style={styles.btn2}>
                                <Image style={styles.btn2Img} source={require('../../assets/icon_payment.png')}></Image>
                                <Text style={styles.btn2Title}>转账</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('Water', { data: {} }); }}>
                            <View style={styles.btn2}>
                                <Image style={styles.btn2Img} source={require('../../assets/icon_statistics.png')}></Image>
                                <Text style={styles.btn2Title}>流水</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('Chat', { data: {} }); }}>
                            <View style={styles.btn2}>
                                <Image style={styles.btn2Img} source={require('../../assets/icon_user.png')}></Image>
                                <Text style={styles.btn2Title}>客服</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </View>
                <View style={styles.col}>

                    <View style={styles.row}>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('History', { type: 'pay', title: '已购' }); }}>
                            <View style={styles.btn2}>
                                <Image tintColor={GlobalStyle.sysFont()} style={styles.btn3Img} source={require('../../assets/icon_cart.png')}></Image>
                                <Text style={styles.btn2Title}>已购</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('History', { type: 'history', title: '历史' }); }}>
                            <View style={styles.btn2}>
                                <Image tintColor={GlobalStyle.sysFont()} style={styles.btn3Img} source={require('../../assets/icon_history.png')}></Image>
                                <Text style={styles.btn2Title}>历史</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('Fav', { type: 'recom', title: '点赞' }); }}>
                            <View style={styles.btn2}>
                                <Image tintColor={GlobalStyle.sysFont()} style={styles.btn3Img} source={require('../../assets/icon_heart.png')}></Image>
                                <Text style={styles.btn2Title}>点赞</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('Fav', { type: 'fav', title: '收藏' }); }}>
                            <View style={styles.btn2}>
                                <Image tintColor={GlobalStyle.sysFont()} style={styles.btn3Img} source={require('../../assets/icon_star.png')}></Image>
                                <Text style={styles.btn2Title}>收藏</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </View>
            </View>
        );
    };

    return (
        <View style={styles.topBox}>
            <FlatList
                style={{ flex: 1 }}
                data={configData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    topBox: {
        flexDirection: 'column',
        backgroundColor: RNStorage.isDark ? '#000000' : '#f9f9f9',
        flex: 1,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFCC',
        width: width * 0.5 - 30,
        height: 50,
        justifyContent: 'space-between',
        borderRadius: 10
    },
    btnImg: {
        width: 26,
        height: 26,
        marginHorizontal: 15
    },
    btnTitle: {
        flex: 1
    },
    btnArrow: {
        width: 30,
        height: 30
    },
    bigTitle: {
        fontSize: 12,
        color: '#000000'
    },
    subTitle: {
        fontSize: 14,
        color: '#FF0000'
    },
    row: {
        margin: GlobalStyle.marginTop,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
    },
    row2: {
        margin: GlobalStyle.marginTop,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: RNStorage.isDark ? '#FFFFFF' : '#FFFFFF',
        padding: GlobalStyle.marginTop,
        borderRadius: 15
    },
    row1: {
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    col: {
        margin: GlobalStyle.marginTop,
        flexDirection: 'column',
        padding: GlobalStyle.marginTop,
        borderRadius: 15,
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
        borderColor: '#555555',
        borderWidth: 0.5,
    },
    name: {
        fontSize: 16,
        color: GlobalStyle.sysFont(),
        marginVertical: 2
    },
    name2: {
        fontSize: 14,
        color: '#555555',
        marginVertical: 2
    },
    avatar: {
        backgroundColor: '#CCCCCC', borderRadius: 90, height: 50, width: 50, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10
    },
    btn2: {
        width: 60,
        height: 60,
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    btn2Img: {
        width: 40,
        height: 40,
    },
    btn3Img: {
        width: 30,
        height: 30,
    },
    btn2Title: {
        fontSize: 14,
        color: GlobalStyle.sysFont(),
        marginTop: 8
    },
    tabTitle: {
        marginVertical: GlobalStyle.marginTop
    },
    tabTitleTxt: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black'
    },
    item: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    itemNum: {
        fontSize: 14,
        color: 'black'
    },
    itemLabel: {
        fontSize: 12,
        color: '#AAAAAA',
        marginLeft: 3
    },
    corner: {
        width: 26,
        height: 26,
        marginRight: 10
    },
    dot: {
        width: 12,
        height: 12,
        backgroundColor: '#FF6666',
        borderRadius: 90,
        position: 'absolute',
        right: 0,
        top: 0,
    }

})
export default Profile;
