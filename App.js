import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { XStorage, XHttpConfig } from 'react-native-easy-app';
import Toast, { DURATION } from 'react-native-easy-toast'

import CodePush from "react-native-code-push";

import EventEmitter from 'eventemitter3';

import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Util from "./src/common/Util";
import HttpUtil, { BASE_URL } from "./src/common/HttpUtil";
import { RNStorage } from './src/common/RNStorage'

import Home from "./src/screen/Home";
import { GlobalStyle } from './src/common/GlobalStyle';
import { ThemeProvider, useTheme } from './src/common/ThemeContext'


global.eventEmitter = new EventEmitter();

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {

        const isLog = Platform.OS == "web" ? false : false;
        XHttpConfig().initLogOn(isLog).initBaseUrl(BASE_URL)
            .initHeaderSetFunc((headers, request) => {
                headers.device = 'app';
            }).initParseDataFunc((result, request, callback) => {
                callback(result)
            });
        console.log("xhttp initBaseUrl()");



        const initializeApp = async () => {
            await XStorage.initStorage(
                RNStorage,
                AsyncStorage,
                async () => {
                    console.log("App initStorage()");

                    // 设置 RNStorage 参数
                    if (Platform.OS === "ios" || Platform.OS === "android") {
                        // 读取剪贴板内容
                        const clipboardText = await Clipboard.getString();
                        console.log("clipboardText", clipboardText);
                        if (clipboardText.indexOf('SHARE_CODE=') === 0) { // SHARE_CODE=600000|13000000000
                            let shareCode = clipboardText.replace('SHARE_CODE=', '');
                            if (shareCode.indexOf("|") > 0) {
                                let arr = shareCode.split("|");
                                RNStorage.code = arr[0]; //代理邀请码
                                RNStorage.puid = arr[1]; //推荐人账号
                            } else {
                                RNStorage.code = shareCode;
                                RNStorage.puid = null;
                            }
                        }
                    }

                    // 设置其他 RNStorage 参数
                    RNStorage.baseUrl = BASE_URL;
                    RNStorage.isDark = isDarkMode;
                },
                (sdata) => {
                    console.log('持久化数据变更:');
                    sdata.forEach(([keyStr, value]) => {
                        let [, key] = keyStr.split('#');
                        console.log(key, ':', value);
                    });
                    eventEmitter.emit('RNStorageUpdate', sdata);
                }
            );
        };

        initializeApp();

        CodePush.sync({
            installMode: CodePush.InstallMode.IMMEDIATE,
            updateDialog: true
        });

        // this.getAds(); //闪屏图
        // BugUtil.up('launch|', RNStorage);
        setIsLoading(false);

    }, []);


    let toastRef = null;

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }



    return (
        <ThemeProvider value={isDarkMode}>
            <SafeAreaProvider>
                <>
                    <StatusBar
                        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                        backgroundColor={GlobalStyle.setBg(RNStorage.isDark)}
                    />
                    <NavigationContainer>
                        <Home />
                    </NavigationContainer>
                    <Toast ref={(ref) => { global.toastRef = ref }} position='center' textStyle={{ color: '#006633' }} style={{ backgroundColor: '#CCFF99' }} />
                </>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

export default App;
