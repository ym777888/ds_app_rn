import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import Util from '../common/Util';

const Splash = ({ navigation }) => {
    const [splash, setSplash] = useState(null);
    
    useEffect(() => {

        StatusBar.setHidden(true);

        const timer = setTimeout(() => {
            StatusBar.setHidden(false);
            navigation.replace("MyTabs");
        }, 5000);

        setSplash(RNStorage.info?.splash?.pic);

        return () => clearTimeout(timer); // 在组件卸载时清除定时器
    }, []); // useEffect 依赖项为空数组，表示只在组件挂载时执行一次

    return (
        <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
            {splash ? (
                <FastImage
                    style={styles.img}
                    source={Util.getThumb(splash)}
                    resizeMode='cover'
                />
            ) : (
                <Text style={{ color: GlobalStyle.red }}>正在加载</Text>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    img: {
        flex: 1,
        width: '100%'
    },

});

export default Splash;
