import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text, StatusBar, ImageBackground, Image, TouchableWithoutFeedback } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import NavTitle from '../component/NavTitle';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from '../common/HttpUtil';
import Util from "../common/Util";

const Share = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState({});
    const [qrData, setQrData] = useState("http");

    useEffect(() => {
        guestInfo();
    }, []); 

    const guestInfo = () => {
        let req = {
            code: RNStorage.code ? RNStorage.code : ""
        }

        HttpUtil.postReq(Util.USER_INFO, req, (msg, data) => {
            setUserInfo(data);
            RNStorage.userInfo = data.user;
            RNStorage.minPrice = data.minPrice;
            RNStorage.maxPrice = data.maxPrice;
            let downloadUrl = RNStorage.baseUrl + '/dsapp/download?code=' + (RNStorage.code?RNStorage.code:"600000") + '&phone=' + data.user.phone;
            setQrData(downloadUrl);
            console.log("downloadUrl",downloadUrl);
        }, (msg,data) => {
            setUserInfo(Util.nouser());
            RNStorage.userInfo = Util.nouser();
            RNStorage.isLogin = false;
            RNStorage.accessToken = '';
            RNStorage.token = '';
            Util.showToast(msg);
        }, true);
    }

    return (
        <ImageBackground style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} source={require('../../assets/bg.jpg')}>
            <View style={styles.arrow}>
                <TouchableWithoutFeedback onPress={() => { navigation.goBack() }}>
                    <Image source={require('../../assets/icon_back.png')} style={styles.back} tintColor="#FFFFFF" />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.row}>

                <ImageBackground style={{ justifyContent: 'center', alignItems: 'center', width: '100%', borderRadius: 15 }} source={require('../../assets/bg_black_alpha.png')}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#FF6600' }}>邀请好友注册，奖励你免费观看</Text>
                    <View style={styles.qrbox}>

                        <QRCode
                            value={qrData}
                            size={140}
                            color="black"
                            backgroundColor="white"
                            logo={require('../../assets/app_icon.png')} // 替换为你的 logo 路径
                            logoSize={30}
                        />
                        <View>
                            <Text style={styles.title}>分享给好友</Text>
                            <Text style={styles.title}>扫码安装APP</Text>

                        </View>

                    </View>
                </ImageBackground>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    arrow: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%'
    },
    back: {
        width: 34,
        height: 34,
    },
    row: {
        padding: 0,
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    qrbox: {

        flexDirection: 'row',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginVertical: 10,
        padding: 10
    },
    addressBar: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1,
        borderColor: '#e7e7e7',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    webview: {
        flex: 1,
    },
    txt: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 14, color: '#000000', margin: 10
    }
});

export default Share;
