import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text, StatusBar, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import NavTitle from '../component/NavTitle';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';

const Logcat = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [log,setLog] = useState(null);
    useEffect(() => {

    }, []);

    
    const getStorage = () => {
        return Object.entries(RNStorage).map(([key, value]) => (
            <View key={key} style={styles.item}>
                <Text style={styles.key}>{key}:</Text>
                <Text style={styles.value}>{JSON.stringify(value)}</Text>
            </View>
        ))
    }

    return (
        <View style={styles.row}>
            <NavTitle nav={navigation} title={'日志'} />
            <ScrollView>
                {getStorage()}
            </ScrollView>
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
        color: 'black'
    },
    key: {
        color: 'blue'
    },
    value: {
        color: 'black'
    },
    item: {
        marginTop: 5,
    }
});

export default Logcat;
