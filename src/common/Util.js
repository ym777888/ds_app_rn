import React, { useState } from 'react';
import { Platform, Alert, View, Modal, Text, ActivityIndicator } from 'react-native'
import { GlobalStyle } from './GlobalStyle';
import { RNStorage } from './RNStorage'
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';


export default class Util {

    //----------------------------HTTP REQUEST

    static SITE_INFO = 'dsapp/siteInfo'; //检查手机号是否可用
    static CLIP_TYPE = 'dsapp/getClipType'; //分类
    static CLIP_TYPE_DATA = 'dsapp/getClipTypeData'; //获取一部分分类及数据
    static CLIP_DATA = 'dsapp/clipData'; //片库
    static CLIP_KEY = 'dsapp/getRandByKey'; //关键字随机
    static LOGIN = 'dsapp/login'; //注册登录
    static USER_INFO = 'dsapp/userInfo'; //用户信息
    static CHECK_BUY = 'dsapp/checkBuy'; //是否购买
    static PRODUCT_LIST = 'dsapp/getProductList'; //商品列表
    static PAY_LIST = 'dsapp/getPayChannel'; //支付通道
    static PAY_ORDER_NO = 'dsapp/getOrderNo'; //下单
    static CHECK_ORDER_PAY = 'dsapp/checkOrder'; //订单支付状态
    static HISTORY_LIST = 'dsapp/getHistoryList'; //购买历史
    static ADD_FAV = 'dsapp/addFav'; //收藏
    static DEL_FAV = 'dsapp/delFav'; //取消收藏
    static FAV_LIST = 'dsapp/getFavList'; //收藏列表
    static ADD_RECOM = 'dsapp/addRecom'; //点赞
    static DEL_RECOM = 'dsapp/delRecom'; //点赞
    static RECOM_LIST = 'dsapp/getRecomList'; //点赞列表

    //----------------------------HTTP REQUEST

    static DEVICE_ID = "DEVICE_ID";
    static PAGE_SIZE = 20;
    static HEIGHT_RATIO = 0.53; //图片高度占宽度比例
    
    static iconList = {
        "coin": require('../../assets/icon_coin3.png'),
        "diamond": require('../../assets/icon_diamond3.png'),
        'vip': require('../../assets/icon_vip2.png'),
        'loading': require('../../assets/loading.png'),
    }

    static msg(txt) {
        if (Platform.OS === 'web') {
            alert(txt)
        } else {
            Alert.alert("", txt)
        }
    }

    static timer = null;
    static showModal(root, txt, onClose) {
        let mv = (
            <Modal onRequestClose={() => { }} transparent visible={true}>
                <View style={commonStyle.modalBox}>
                    <View style={commonStyle.modalStyle}>
                        <Text style={{ textAlign: 'center' }}>{txt}</Text>
                    </View>
                </View>
            </Modal>
        )

        root.setState({
            modalView: mv
        })
        this.timer = setTimeout(() => {
            root.setState({
                modalView: <View />
            }, () => {
                if (onClose != null) {
                    clearTimeout(this.timer);
                    this.timer = null;
                    onClose();
                }
            })

        }, 1000);
    }

    static showToast(root, txt, countdown) {
        if (countdown == null) {
            countdown = 1000;
        }
        let mv = (
            <Modal onRequestClose={() => { }} transparent visible={true}>
                <View style={commonStyle.modalBox}>
                    <View style={commonStyle.modalStyle2}>
                        <Text style={commonStyle.indicatorTxt}>{txt != null ? txt : ''}</Text>
                    </View>
                </View>
            </Modal>
        )

        root.setState({
            modalView: mv
        })
        this.timer = setTimeout(() => {
            if (root == null) {
                clearTimeout(this.timer);
                return;
            }
            root.setState({
                modalView: <View />
            })
        }, countdown);
    }

    static showIndicator(root, txt, countdown) {
        if (countdown == null) {
            countdown = 20000;
        }
        let mv = (
            <Modal onRequestClose={() => { }} transparent visible={true}>
                <View style={commonStyle.modalBox}>
                    <View style={commonStyle.modalStyle2}>
                        <ActivityIndicator size="small" color="white" />
                        <Text style={commonStyle.indicatorTxt}>{txt != null ? txt : ''}</Text>
                    </View>
                </View>
            </Modal>
        )

        root.setState({
            modalView: mv
        })
        this.timer = setTimeout(() => {
            if (root == null) {
                clearTimeout(this.timer);
                return;
            }
            root.setState({
                modalView: <View />
            })
        }, countdown);
    }

    static hideIndicator(root, callback) {
        this.clear();
        root.setState({
            modalView: <View />
        }, () => {
            if (callback) {
                callback()
            }
        })

    }

    static clear() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    static async getUniqueId() {

        var uuid = ""
        if (Platform.OS == "android") {
            uuid = Application.androidId;
        }
        if (Platform.OS == "ios") {
            uuid = await SecureStore.getItemAsync(this.DEVICE_ID);
            if (uuid == null) {
                uuid = uuidv4();
                await SecureStore.setItemAsync(this.DEVICE_ID, uuid);
            }
        }
        if (Platform.OS == "web") {
            uuid = await AsyncStorage.getItem(this.DEVICE_ID)
            if (uuid == null) {
                uuid = uuidv4();
                await AsyncStorage.setItem(this.DEVICE_ID, uuid);
            }
        }
        return uuid
    }

    static dateFmt(javaDate) {
        if (javaDate) {
            return javaDate.substr(0, 10).replace(/-/g, "/");
        } else {
            return "";
        }
    }

    //保存登陆信息
    //{"tenant":"aaaaa","uid":"43383431","avatar":"http://zhouw.oss-cn-shenzhen.aliyuncs.com/avatar.jpg","username":"游客_43383431","gender":1,"dailyFreeCount":1,"coin":0,"diamond":0,"token":"x071072avuknqnwcglrwwm1n8oko9g8n"}
    static updateUserInfo(data) {
        RNStorage.token = data.token;
        RNStorage.username = data.username;
        RNStorage.userId = data.uid;
        RNStorage.coin = data.coin;
        RNStorage.diamond = data.diamond;
        RNStorage.dailyFreeCount = data.dailyFreeCount;
        RNStorage.isLogin = true;
        RNStorage.uid = data.uid;
        RNStorage.avatar = data.avatar;
        RNStorage.vip = data.vip;
        RNStorage.favCount = data.fav;
        RNStorage.buyCount = data.buy;
        RNStorage.upCount = data.recom;

    }

    static logout() {
        RNStorage.token = undefined;
        RNStorage.isLogin = false;
        RNStorage.coin = 0;
        RNStorage.diamond = 0;
        RNStorage.username = '未登录';
        RNStorage.vip = 0;
        RNStorage.uid = undefined;
        RNStorage.favCount = 0;
        RNStorage.buyCount = 0;
        RNStorage.upCount = 0;
        RNStorage.avatar = '';
    }

    static getVip = (time) => {
        let cur = new Date().getTime()
        time = time || 0

        if (time > cur) {
            if ((time - cur) >= 315360000000) { //10年以上
                return '终身会员'
            } else {
                let str = moment(parseInt(time)).format('YYYY-MM-DD')
                return str + ''
            }

        } else {
            return '非会员'
        }
    }

    static isVip = (time) => {
        let cur = new Date().getTime()
        time = time || 0
        if (time > cur) {
            if ((time - cur) >= 315360000000) { //10年以上
                return 2
            } else {
                return 1
            }

        } else {
            return 0
        }
    }

    static getShareUrl = () => {
        let code = RNStorage.uid || 1
        let shareUrl = RNStorage.baseUrl.replace('/api/', '/s/') + 's/' + code;
        return shareUrl;
    }

    static getDownUrl = () => {
        let code = RNStorage.uid || 1
        let shareUrl = RNStorage.baseUrl.replace('/api/', '/d/') + 's/' + code;
        return shareUrl;
    }

    static hideTel = (tel) => {
        if (tel == '' || tel == null) {
            return tel
        }
        if (tel.length == 11) {
            return tel.substr(0, 3) + '****' + tel.substr(7, 11);
        }
        return tel;
    }

    static getThumb = (url) => {
        if (url == null || url.length == 0) {
            return Util.iconList['loading'];
        } else if (url.indexOf('http') == 0) {
            return { uri: url };
        }
    }

    static getVideo = (url) => {
        if (url == null || url.length == 0) {
            return '';
        } else if (url.indexOf('http') == 0) {
            return url;
        } else {
            return RNStorage.cdnUrl + url
        }
    }

    static isEmpty = (str) => {
        if (!str || str.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    static getNickName = (str) => {
        if(str==null||str==""||str=="null"){
            return "游客";
        }
        return str;
    }

    static showToast = (txt, duration = 500, callback) => {
        //style={{ backgroundColor: '#009966' }} textStyle={{ color: 'white' }}
        if (global.toastRef) {
            global.toastRef.show(txt, duration, callback);
        }
    };
}