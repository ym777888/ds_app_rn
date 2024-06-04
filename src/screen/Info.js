import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import NavTitle from '../component/NavTitle';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';


const Info = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { data } = route.params;

    const txt = `<!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" name="viewport">
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Expires" content="0">
    </head>
    <body>`+ data.content +`</body></html>`;

    return (
        <View style={styles.row}>
            <NavTitle nav={navigation} title={data.name} />
            {txt ? (
                <WebView
                    originWhitelist={['*']}
                    source={{ html: txt }}
                    style={styles.webview}
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

export default Info;
