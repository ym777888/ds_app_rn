import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import NavTitle from '../component/NavTitle';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';

const WebPage = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const webViewRef = useRef(null);

    const { url, isLandsacpe=false } = route.params;

    useEffect(() => {
        if (isLandsacpe) {
            enterFullScreen();
        }
        return () => {
            exitFullScreen();
        };
    }, []);

    enterFullScreen = () => {
        Orientation.lockToLandscape();
        StatusBar.setHidden(true);
    };

    exitFullScreen = () => {
        Orientation.lockToPortrait();
        StatusBar.setHidden(false);
    }

    const handleWebViewMessage = (event) => {
        const { data } = event.nativeEvent;

        if (data === 'closeWebView') {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.row}>
            {url ? (
                <WebView
                    ref={webViewRef}
                    source={{ uri: url }}
                    style={styles.webview}
                    onMessage={handleWebViewMessage}
                />
            ) : (
                <View style={styles.txt}>
                    <Text>暂未开放，稍后尝试</Text>
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        padding: 0,
        flexDirection: 'column',
        flex: 1,
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
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
    }
});

export default WebPage;
