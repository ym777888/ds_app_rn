import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, Platform, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { XStorage, XHttpConfig } from 'react-native-easy-app';
import Toast, { DURATION } from 'react-native-easy-toast';

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
        } else {
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
        updateDialog: true
    };

    useEffect(() => {

        const initializeApp = async () => {
            logtxt.current.push(global.siteName);
            logtxt.current.push(global.siteUrl);
            logtxt.current.push("DEV:" + __DEV__);
            logtxt.current.push('initializeApp start');
            let isServerApiAvailable = false;
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

            const API_URL = __DEV__ ? global.siteUrl : global.siteUrl;

            RNStorage.baseUrl = API_URL;
            RNStorage.isDark = isDarkMode;
            RNStorage.logcat = [];

            XHttpConfig().initLogOn(Platform.OS === "web" ? false : false).initBaseUrl(API_URL)
                .initHeaderSetFunc((headers, request) => {
                    headers.device = 'app';
                }).initParseDataFunc((result, request, callback) => {
                    callback(result);
                });
            logtxt.current.push('xhttp initBaseUrl()');
            console.log("xhttp initBaseUrl()");

            // 设置 RNStorage 参数
            if (Platform.OS === "ios" || Platform.OS === "android") {
                logtxt.current.push('clipboardText:');
                logtxt.current.push(clipboardText);
                // 读取剪贴板内容
                const clipboardText = await Clipboard.getString();
                console.log("clipboardText: ", clipboardText);
                if (clipboardText.indexOf('SHARE_CODE=') === 0) { // SHARE_CODE=600000|13000000000
                    let shareCode = clipboardText.replace('SHARE_CODE=', '');
                    if (shareCode.indexOf("|") > 0) {
                        let arr = shareCode.split("|");
                        if (RNStorage.code == null) {
                            RNStorage.code = arr[0]; //代理邀请码
                        }

                        if (RNStorage.puid) {
                            RNStorage.puid = arr[1]; //推荐人账号
                        }

                    } else {
                        RNStorage.code = shareCode;
                        RNStorage.puid = null;
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
