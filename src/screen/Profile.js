import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { XStorage } from 'react-native-easy-app';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from '../common/HttpUtil';
import Util from "../common/Util";

const { width } = Dimensions.get('window');

const Profile = () => {
    const navigation = useNavigation();
    const [isLogin, setIsLogin] = useState(RNStorage.isLogin);
    const [userInfo, setUserInfo] = useState({});

    useFocusEffect(
        React.useCallback(() => {
            guestInfo();
        }, [])
    );

    useEffect(() => {
        // 订阅事件
        const subscription = eventEmitter.on('RNStorageUpdate', (sdata) => {
            console.log('接收到事件:', sdata);
            setIsLogin(RNStorage.isLogin);
        });

        // 返回一个清理函数，在组件卸载时移除监听器
        return () => {
            if (subscription && (typeof subscription.remove === "function")) {
                subscription.remove();
            }
        };

    }, []);


    const guestInfo = () => {
        let req = {
        }

        HttpUtil.postReq(Util.USER_INFO, req, (msg, data) => {
            setUserInfo(data);
            RNStorage.userInfo = data.user;
        });
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

    return (
        <View style={styles.topBox}>
            <View style={[styles.row1, { justifyContent: 'flex-end' }]}>
                <TouchableWithoutFeedback>
                    <Image style={styles.corner} source={require('../../assets/icon_setting2.png')}></Image>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <Image style={styles.corner} source={require('../../assets/icon_bell2.png')}></Image>
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.row}>
                <View style={styles.avatar}>
                    <Image resizeMode='contain' style={{ height: 50, width: 50, borderRadius: 90 }} source={require('../../assets/app_icon.png')} ></Image>
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                    <Text style={styles.name}>{Util.getNickName(userInfo.user?.nickname)}</Text>
                    <Text style={styles.name2}>账号:{Util.getNickName(userInfo.user?.phone)}</Text>
                </View>
                <TouchableOpacity onPress={login}>
                    <View style={{ backgroundColor: '#FF6666', width: 100, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                        {isLogin ? (<Text style={{ color: '#FFFFFF' }}>退出</Text>) : (<Text style={{ color: '#FFFFFF' }}>注册 | 登录</Text>)}
                    </View>
                </TouchableOpacity>
            </View>
            <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: 20 }]}>
                <View style={styles.item}>
                    <Text style={styles.itemNum}>{userInfo.user?.diamond}</Text>
                    <Text style={styles.itemLabel}>钻石</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemNum}>{userInfo.user?.coin}</Text>
                    <Text style={styles.itemLabel}>金币</Text>
                </View>

                <View style={styles.item}>
                    <Text style={styles.itemNum}>{userInfo.myFollow}</Text>
                    <Text style={styles.itemLabel}>关注</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemNum}>{userInfo.followMe}</Text>
                    <Text style={styles.itemLabel}>粉丝</Text>
                </View>
            </View>
            <View style={styles.row2}>
                <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyDiamond', { data: {} }); }}>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_diamond3.png')}></Image>
                        <View style={styles.btnTitle}>
                            <Text style={styles.bigTitle}>钻石余额</Text>
                            <Text style={styles.subTitle}>{userInfo.user?.diamond}</Text>
                        </View>
                        <Image tintColor='#FF9933' style={styles.btnArrow} source={require('../../assets/icon_arrow.png')}></Image>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyVip', { data: {} }); }}>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_vip2.png')}></Image>
                        <View style={styles.btnTitle}>
                            <Text style={styles.bigTitle}>VIP有效期</Text>
                            <Text style={styles.subTitle}>{Util.getVip(userInfo.user?.vipTime)}</Text>
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

                    <TouchableWithoutFeedback>
                        <View style={styles.btn2}>
                            <Image style={styles.btn2Img} source={require('../../assets/icon_user.png')}></Image>
                            <Text style={styles.btn2Title}>客服</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </View>
            <View style={styles.col}>

                <View style={styles.row}>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('History', { type: 'pay' }); }}>
                        <View style={styles.btn2}>
                            <Image style={styles.btn3Img} source={require('../../assets/icon_cart.png')}></Image>
                            <Text style={styles.btn2Title}>已购</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('History', { type: 'history' }); }}>
                        <View style={styles.btn2}>
                            <Image style={styles.btn3Img} source={require('../../assets/icon_history.png')}></Image>
                            <Text style={styles.btn2Title}>历史</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('Fav', { type: 'recom' }); }}>
                        <View style={styles.btn2}>
                            <Image style={styles.btn3Img} source={require('../../assets/icon_heart.png')}></Image>
                            <Text style={styles.btn2Title}>点赞</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('Fav', { type: 'fav' }); }}>
                        <View style={styles.btn2}>
                            <Image style={styles.btn3Img} source={require('../../assets/icon_star.png')}></Image>
                            <Text style={styles.btn2Title}>收藏</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </View>
            <View style={styles.col}>
                <View style={styles.line}>
                    <Text style={styles.lineTitle}>收货地址</Text>
                    <Image tintColor={'#CCCCCC'} style={styles.btn3Img} source={require('../../assets/icon_arrow.png')}></Image>
                </View>
                <View style={[styles.line, { borderBottomWidth: 0 }]}>
                    <Text style={styles.lineTitle}>收货地址</Text>
                    <Image tintColor={'#CCCCCC'} style={styles.btn3Img} source={require('../../assets/icon_arrow.png')}></Image>
                </View>
            </View>
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
        justifyContent: 'space-between'
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
        backgroundColor: RNStorage.isDark ? '#FFFFFF' : '#FFFFFF',
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
    line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#EEEEEE',
        borderBottomWidth: 0.4,
        height: 40,
        lineHeight: 40,
        marginLeft: 10,
        marginRight: 10
    },

    lineTitle: {
        fontSize: 14,
        color: '#000000',
    }
})
export default Profile;
