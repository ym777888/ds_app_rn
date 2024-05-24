import React, { useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const Browser = () => {
    const navigation = useNavigation();
    const webViewRef = useRef(null);
    const [url, setUrl] = useState('https://www.example.com');
    const [inputUrl, setInputUrl] = useState(url);

    const handleLoadUrl = () => {
        setUrl(inputUrl);
    };

    return (
        <View style={styles.container}>
            <View style={styles.addressBar}>
                <TextInput
                    style={styles.input}
                    value={inputUrl}
                    onChangeText={setInputUrl}
                    onSubmitEditing={handleLoadUrl}
                />
                <Button title="Go" onPress={handleLoadUrl} />
            </View>
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                style={styles.webview}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
});

export default Browser;
