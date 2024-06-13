import React, { useState } from 'react';
import { Platform, Alert, View, Modal, Text, ActivityIndicator } from 'react-native'
import { GlobalStyle } from './GlobalStyle';
import { RNStorage } from './RNStorage'
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { ModalManager } from './ModalManager';
import { navigate } from './NavigationService';

// 映射表，用于加密和解密
const mapping = {
    '0': '5',
    '1': '3',
    '2': '8',
    '3': '7',
    '4': '2',
    '5': '9',
    '6': '1',
    '7': '6',
    '8': '0',
    '9': '4'
};

export default class Util {

    //----------------------------HTTP REQUEST

    static SITE_INFO = '/dsapp/siteInfo'; //检查手机号是否可用
    static CLIP_TYPE = '/dsapp/getClipType'; //分类
    static CLIP_TYPE_DATA = '/dsapp/getClipTypeData'; //获取一部分分类及数据
    static CLIP_DATA = '/dsapp/clipData'; //片库
    static CLIP_KEY = '/dsapp/getRandByKey'; //关键字随机
    static CLIP_MAX_PAGE = '/dsapp/getClipPageMax'; //最大页数
    static LOGIN = '/dsapp/login'; //注册登录
    static LOGOUT = '/dsapp/logout'; //退出
    static USER_INFO = '/dsapp/userInfo'; //用户信息
    static USER_PASSWORD = '/dsapp/updatePassword'; //修改密码
    static USER_ADDRESS = '/dsapp/getAddress'; //用户地址
    static UPDATE_ADDRESS = '/dsapp/updateAddress'; //修改用户地址
    static CHECK_BUY = '/dsapp/checkBuy'; //是否购买
    static PRODUCT_LIST = '/dsapp/getProductList'; //商品列表
    static PAY_LIST = '/dsapp/getPayChannel'; //支付通道
    static PAY_ORDER_NO = '/dsapp/getOrderNo'; //下单
    static CHECK_ORDER_PAY = '/dsapp/checkOrder'; //订单支付状态
    static HISTORY_LIST = '/dsapp/getHistoryList'; //购买历史
    static ADD_FAV = '/dsapp/addFav'; //收藏
    static DEL_FAV = '/dsapp/delFav'; //取消收藏
    static CLEAR_FAV = '/dsapp/clearFav'; //清除收藏
    static FAV_LIST = '/dsapp/getFavList'; //收藏列表
    static ADD_RECOM = '/dsapp/addRecom'; //点赞
    static DEL_RECOM = '/dsapp/delRecom'; //点赞
    static CLEAR_RECOM = '/dsapp/clearRecom'; //清除点赞
    static RECOM_LIST = '/dsapp/getRecomList'; //点赞列表
    static CHECK_FAV_RECOM = '/dsapp/checkFavRecom'; //检测点赞收藏
    static MORE_LIST = '/dsapp/getMoreList'; //推荐播放
    static TRANS_DIAMOND = '/dsapp/transDiamond'; //转账钻石
    static EXCHANGE_DIAMOND = '/dsapp/exchangeDiamond'; //APP兑换游戏币
    static WATER_LIST = '/dsapp/getWaterList'; //钻石流水
    static MESSAGE_LIST = '/dsapp/getMessageList'; //消息列表
    static CLEAR_MESSAGE = '/dsapp/clearMessage'; //清除消息列表
    static READ_ALL_MESSAGE = '/dsapp/readAllMessage'; //全部已读
    static GIFT_LIST = '/dsapp/getGiftList'; //商品列表
    static BUY_GIFT = '/dsapp/buyGift'; //兑换商品
    static DELIVERY_LIST = '/dsapp/getDeliveryList'; //兑换列表
    static GET_ADV = '/dsapp/getAdv'; //广告
    static GET_BANK_CARD = '/dsapp/getBankCard'; //银行卡
    static SAVE_BANK_CARD = '/dsapp/saveBankCard'; //保存银行卡
    static DAILY_FREE = '/dsapp/getDailyFree'; //今日免费
    static DAILY_COIN = '/dsapp/getDailyCoin'; //每日赠送金币


    //----------------------------HTTP REQUEST

    static DEVICE_ID = "DEVICE_ID";
    static PAGE_SIZE = 10;
    static HEIGHT_RATIO = 0.53; //图片高度占宽度比例
    static DEF_CODE = 600000; //默认代理

    static iconList = {
        "coin": require('../../assets/icon_coin3.png'),
        "diamond": require('../../assets/icon_diamond3.png'),
        'vip': require('../../assets/icon_vip2.png'),
        'loading': require('../../assets/loading.png'),
    }

    static alert(txt) {
        if (Platform.OS === 'web') {
            alert(txt)
        } else {
            Alert.alert("", txt)
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
        console.log("getVip", time);
        console.log("cur", cur);
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
        if (url == null || url == "" || url.length == 0) {
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
        if (str == null || str == "" || str == "null") {
            return "游客";
        }
        return str;
    }

    static showToast = (txt, duration = 800, callback) => {
        //style={{ backgroundColor: '#009966' }} textStyle={{ color: 'white' }}
        if (global.toastRef) {
            global.toastRef.show(txt, duration, callback);
        }
    };

    static getRandom = (min, max) => {
        // 确保 min 和 max 是整数
        min = Math.ceil(min);
        max = Math.floor(max);
        // 生成一个介于 min 和 max 之间的随机整数（包括 min 和 max）
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static nouser = () => {
        return {
            user: {
                diamond: 0,
                coin: 0,
                phone: '游客',
                nickname: '游客'
            },
            newMsg: false
        }
    }

    static showLoginModal = () => {
        ModalManager.showModal(
            '当前操作需要登录账号',
            '确定',
            () => { navigate("Login") },
            '关闭',
            null
        )
    }



    // 加密手机号
    static encryptPhoneNumber = (phoneNumber) => {
        let encryptedNumber = '';
        for (let digit of phoneNumber) {
            encryptedNumber += mapping[digit];
        }
        return encryptedNumber;
    }

    // 解密手机号
    static decryptPhoneNumber = (encryptedNumber) => {
        let decryptedNumber = '';
        for (let digit of encryptedNumber) {
            // 反向映射回原始数字
            for (let key in mapping) {
                if (mapping[key] === digit) {
                    decryptedNumber += key;
                    break;
                }
            }
        }
        return decryptedNumber;
    }

}