import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { GlobalStyle } from '../common/GlobalStyle';

const Splash = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("MyTabs");
        }, 500);

        return () => clearTimeout(timer); // 在组件卸载时清除定时器
    }, []); // useEffect 依赖项为空数组，表示只在组件挂载时执行一次

    return (
        <View style={{ flex: 1, backgroundColor: '#ff0000', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: GlobalStyle.red }}>Splash Screen</Text>
        </View>
    );
};

export default Splash;
