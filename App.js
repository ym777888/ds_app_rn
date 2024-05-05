import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { XStorage, XHttpConfig } from 'react-native-easy-app';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Util from "./src/common/Util";
import HttpUtil, { BASE_URL } from "./src/common/HttpUtil";
import { RNStorage } from './src/common/RNStorage'

import Home from "./src/screen/Home";
import { GlobalStyle } from './src/common/GlobalStyle';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? GlobalStyle.black : GlobalStyle.white,
    };

    useEffect(() => {

        const isLog = Platform.OS == "web" ? false : false;
        XHttpConfig().initLogOn(isLog).initBaseUrl(BASE_URL)
            .initHeaderSetFunc((headers, request) => {
                headers.device = 'app';
            }).initParseDataFunc((result, request, callback) => {
                callback(result)
            });
        console.log("xhttp initBaseUrl()");

        XStorage.initStorage(RNStorage, AsyncStorage, () => {

            console.log("App initStorage()")
            // Util.getUniqueId().then((uuid) => {
            //     RNStorage.uuid = uuid;
            // });

            if (Platform.OS == "ios" || Platform.OS == "android") {

                // Clipboard.getStringAsync().then((txt) => {
                //     if (txt.indexOf('SHARE_CODE=') == 0) {
                //         let shareCode = txt.replace('SHARE_CODE=', '');
                //         if (shareCode) {
                //             RNStorage.puid = shareCode
                //         }
                //     }
                // })
            }

            // RNStorage.appid = Application.applicationId;
            RNStorage.baseUrl = BASE_URL;

        }, (sdata) => {
            console.log('持久化数据变更:');
            sdata.map(([keyStr, value]) => {
                let [, key] = keyStr.split('#');
                console.log(key, '<=>', value);
            });
        })



        // this.getAds(); //闪屏图
        // BugUtil.up('launch|', RNStorage);
        setIsLoading(false);

    }, []);


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }



    return (
        <SafeAreaProvider>
            <>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={backgroundStyle.backgroundColor}
                />
                <NavigationContainer>
                    <Home />
                </NavigationContainer>
            </>
        </SafeAreaProvider>
    );
}

export default App;
