import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Platform, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { XStorage, XHttpConfig } from 'react-native-easy-app';
import Toast, { DURATION } from 'react-native-easy-toast';
import NavigationBar from 'react-native-system-navigation-bar';

import Util from "./src/common/Util";
import Config from 'react-native-config';

import CodePush from "react-native-code-push";

import EventEmitter from 'eventemitter3';

import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RNStorage } from './src/common/RNStorage';

import Home from "./src/screen/Home";
import { GlobalStyle } from './src/common/GlobalStyle';
import { ThemeProvider, useTheme } from './src/common/ThemeContext';

import { ModalProvider, ModalManager } from "./src/common/ModalManager";
import ModalDialog from "./src/common/ModalDialog";
import { encode, decode } from 'base64-utf8';


global.eventEmitter = new EventEmitter();
//.env 里面设置
global.siteName = Config.SITE_NAME;
global.siteUrl = Config.SITE_URL;


const DEV_URL = "http://192.168.100.24/api";


function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [msg, setMsg] = useState("正在连接"); //错误消息
    const isDarkMode = useColorScheme() === 'dark';
    const [fail, setFail] = useState(false); //链接失败
    const [show, setShow] = useState(false); //显示日志
    const logtxt = useRef([]);
    const errCount = useRef(0);

    NavigationBar.navigationHide();

    const retry = async () => {
        let isServerApiAvailable = false;
        logtxt.current.push('retry:');

        setMsg('正在连接...');
        try {
            // 发起简单的网络请求检测服务器 API 是否正常
            let url = RNStorage.baseUrl + Util.SITE_INFO + "?t=" + Date.now() + "&code=" + (RNStorage.code ? RNStorage.code : Util.DEF_CODE);
            console.log("req:", url);
            logtxt.current.push("req:" + url);
            const response = await fetch(url);
            console.log("Response:", response);
            RNStorage.logcat.push(url);
            RNStorage.logcat.push(response);

            if (!response.ok) {
                setMsg("服务器连接失败");
                setFail(true);
                isServerApiAvailable = false;
            }

            const resp = await response.json();
            console.log("json:", resp);
            logtxt.current.push(resp);
            if (resp.code == 500) {
                setMsg(resp.msg);
                setFail(true);
                isServerApiAvailable = false;
            } else {
                RNStorage.info = resp.data;
                isServerApiAvailable = true;
            }

        } catch (error) {
            console.log("error:", error.message);
            logtxt.current.push(error.message);
            setMsg("网络连接失败，请稍后重试");
            setFail(true);
            isServerApiAvailable = false;
        }

        logtxt.current.push('isServerApiAvailable:');
        logtxt.current.push(isServerApiAvailable);

        console.log("isServerApiAvailable", isServerApiAvailable);

        if (!isServerApiAvailable) {
            // 如果服务器 API 不可用，则保持在加载页面
            let s = 'Server API is not available';
            console.log(s);
            logtxt.current.push(s);
            
            errCount.current = errCount.current + 1;
            console.log("errCount:",errCount.current);
            if (errCount.current > 3) {
                errCount.current = 0;
                tryLand();
            }
        } else {

            initHttp(RNStorage.baseUrl);
            // 如果服务器 API 可用，则继续进行后续初始化工作
            // CodePush 同步等操作
            CodePush.sync(codePushOptions);

            console.log(global.siteName);
            console.log(global.siteUrl);

            setIsLoading(false);
        }

    }

    //尝试使用落地登录
    const tryLand = async () => {
        console.log("tryLand");
        if (RNStorage.info == null || RNStorage.info.dsLand == null || RNStorage.info.dsLand == '') {
            console.log('tryLand: no land');
            logtxt.current.push('tryLand: no land');
            return;
        }
        let isServerApiAvailable = false;
        logtxt.current.push('tryLand:');

        setMsg('正在连接...');
        try {
            // 发起简单的网络请求检测服务器 API 是否正常
            let url = RNStorage.info.dsLand + Util.SITE_INFO + "?t=" + Date.now() + "&code=" + (RNStorage.code ? RNStorage.code : Util.DEF_CODE);
            console.log("req:", url);
            logtxt.current.push("req:" + url);
            const response = await fetch(url);
            console.log("Response:", response);
            RNStorage.logcat.push(url);
            RNStorage.logcat.push(response);

            if (!response.ok) {
                setMsg("服务器连接失败");
                setFail(true);
                isServerApiAvailable = false;
            }

            const resp = await response.json();
            console.log("json:", resp);
            logtxt.current.push(resp);
            if (resp.code == 500) {
                setMsg(resp.msg);
                setFail(true);
                isServerApiAvailable = false;
            } else {
                RNStorage.info = resp.data;
                isServerApiAvailable = true;
            }

        } catch (error) {
            console.log("error:", error.message);
            logtxt.current.push(error.message);
            setMsg("网络连接失败，请稍后重试");
            setFail(true);
            isServerApiAvailable = false;
        }

        logtxt.current.push('isServerApiAvailable:');
        logtxt.current.push(isServerApiAvailable);

        console.log("isServerApiAvailable", isServerApiAvailable);

        if (!isServerApiAvailable) {
            // 如果服务器 API 不可用，则保持在加载页面
            let s = 'Server API is not available';
            console.log(s);
            logtxt.current.push(s);
        } else {
            initHttp(RNStorage.info.dsLand);
            // 如果服务器 API 可用，则继续进行后续初始化工作
            // CodePush 同步等操作
            CodePush.sync(codePushOptions);

            console.log(global.siteName);
            console.log(global.siteUrl);

            setIsLoading(false);
        }

    }

    let num = 1;
    const showLog = () => {
        num = num + 1;
        if (num >= 10) {
            num = 1;
            setShow(true);
        }

    }

    //string.xm有个备用设置
    const codePushOptions = {
        deploymentKey: Config.CODEPUSH_DEPLOYMENT_KEY,
        serverUrl: Config.CODEPUSH_SERVER_URL,
        installMode: CodePush.InstallMode.IMMEDIATE,
        updateDialog: {
            appendReleaseDescription: true,  // 是否追加发布描述
            title: '更新提示',  // 对话框标题
            optionalUpdateMessage: '有新的更新可用，是否立即安装？',  // 可选更新消息
            mandatoryUpdateMessage: '有新的更新可用，是否立即安装？',  // 强制更新消息
            optionalIgnoreButtonLabel: '忽略',  // 可选更新对话框中“忽略”按钮的标签
            optionalInstallButtonLabel: '安装',  // 可选更新对话框中“安装”按钮的标签
            mandatoryContinueButtonLabel: '继续',  // 强制更新对话框中“继续”按钮的标签
        }
    };

    const initHttp = (apiUrl) => {
        XHttpConfig().initLogOn(Platform.OS === "web" ? false : false).initBaseUrl(apiUrl)
            .initHeaderSetFunc((headers, request) => {
                headers.device = 'app';
            }).initParseDataFunc((result, request, callback) => {
                callback(result);
            });
        logtxt.current.push('xhttp initBaseUrl()');
        console.log("xhttp initBaseUrl()");
    }

    useEffect(() => {

        const initializeApp = async () => {
            logtxt.current.push(global.siteName);
            logtxt.current.push(global.siteUrl);
            logtxt.current.push("DEV:" + __DEV__);
            logtxt.current.push('initializeApp start');
            logtxt.current.push('initStorage start');
            logtxt.current.push(Config);
            await XStorage.initStorageSync(RNStorage, AsyncStorage, (sdata) => {
                console.log('RNStorage数据变更:');
                sdata.forEach(([keyStr, value]) => {
                    let [, key] = keyStr.split('#');
                    console.log(key, ':', value);
                });
                eventEmitter.emit('RNStorageUpdate', sdata);
            });
            logtxt.current.push('initStorage end');
            console.log("App initStorage()");

            const API_URL = __DEV__ ? DEV_URL : global.siteUrl;

            if (RNStorage.baseUrl == null || RNStorage.baseUrl == '') {
                RNStorage.baseUrl = API_URL;
            }


            RNStorage.isDark = isDarkMode;
            RNStorage.logcat = [];


            // 设置 RNStorage 参数
            if (Platform.OS === "ios" || Platform.OS === "android") {
                // 读取剪贴板内容
                const clipboardText = await Clipboard.getString();
                logtxt.current.push('clipboardText:');
                logtxt.current.push(clipboardText);

                console.log("clipboardText: ", clipboardText);
                if (clipboardText.indexOf('SHARE_CODE') === 0) { // SHARE_CODE + base64(appDomain|600000|13000000000)
                    let shareCode = clipboardText.replace('SHARE_CODE', '');
                    shareCode = decode(shareCode);
                    if (shareCode.indexOf("|") > 0) {
                        let arr = shareCode.split("|");

                        if (arr[0] != null && arr[0] != '') {
                            if (RNStorage.site == null || RNStorage.site == '') {
                                RNStorage.site = arr[0]; //站点
                                RNStorage.baseUrl = RNStorage.site;
                                console.log("SHARE_CODE 更新了 RNStorage.baseUrl", RNStorage.baseUrl);
                            }
                        }

                        if (arr[1] != null && arr[1] != '') {
                            if (RNStorage.code == null || RNStorage.code == '') {
                                RNStorage.code = arr[1]; //代理邀请码
                            }
                        }

                        if (arr[2] != null && arr[2] != '') {
                            if (RNStorage.puid == null || RNStorage.puid == '') {
                                RNStorage.puid = Util.decryptPhoneNumber(arr[2]); //推荐人账号
                            }
                        }


                    }


                }
            }

            retry();

        };

        initializeApp();


    }, []);

    if (isLoading) {
        return (
            <>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                    <TouchableWithoutFeedback onPress={() => {
                        showLog();
                    }}>
                        <Text style={{ color: 'white' }}>{msg}...</Text>
                    </TouchableWithoutFeedback>
                    {fail && (
                        <TouchableHighlight onPress={() => { retry() }}>
                            <View style={{ width: 80, height: 24, backgroundColor: 'blue', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ color: 'white' }}>重试</Text>
                            </View>
                        </TouchableHighlight>
                    )}

                    {show && (
                        <ScrollView>
                            {
                                Object.entries(logtxt.current).map(([key, value]) => (
                                    <View key={key} style={styles.item}>
                                        <Text style={styles.key}>{key}:</Text>
                                        <Text style={styles.value}>{JSON.stringify(value)}</Text>
                                    </View>
                                ))
                            }
                            {

                                Object.entries(RNStorage).map(([key, value]) => (
                                    <View key={key} style={styles.item}>
                                        <Text style={styles.key}>{key}:</Text>
                                        <Text style={styles.value}>{JSON.stringify(value)}</Text>
                                    </View>
                                ))
                            }
                        </ScrollView>
                    )}

                </View>
                <Toast ref={(ref) => { global.toastRef = ref }} position='center' textStyle={{ color: '#003300' }} style={{ backgroundColor: '#CCFF99' }} />
            </>

        );
    }



    return (
        <ThemeProvider value={isDarkMode}>

            <SafeAreaProvider>
                <ModalProvider>
                    <>

                        <StatusBar
                            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                            backgroundColor={GlobalStyle.setBg(RNStorage.isDark)}
                        />

                        <Home />

                        <Toast ref={(ref) => { global.toastRef = ref }} position='center' textStyle={{ color: '#006633' }} style={{ backgroundColor: '#CCFF99' }} />
                        <ModalDialog />
                    </>
                </ModalProvider>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    key: {
        color: 'blue'
    },
    value: {
        color: 'white'
    },
    item: {
        marginTop: 5,
        width: '100%',
        justifyContent: 'flex-start'
    }
});

export default App;
