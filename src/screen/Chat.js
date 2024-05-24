import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, StyleSheet,Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import NavTitle from '../component/NavTitle';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';

const Chat = () => {
    const navigation = useNavigation();
    const webViewRef = useRef(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if(RNStorage.info?.isChat){
            setUrl(RNStorage.info.chat);
        }
    }, []);

    return (
        <View style={styles.row}>
            <NavTitle nav={navigation} title={'客服'} />
            {url?(            
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={styles.webview}
            />
            ):(
                <View style={styles.txt}>
                    <Text>客服不在线，稍后尝试</Text>
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
        backgroundColor: GlobalStyle.sysBg(),
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

export default Chat;
