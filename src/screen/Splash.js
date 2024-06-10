import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StatusBar, Image, StyleSheet, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import FastImage from 'react-native-fast-image';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import Util from '../common/Util';

const Splash = ({ navigation }) => {
    const [splash, setSplash] = useState(null);
    const [num, setNum] = useState(5);
    const [hasNavigated, setHasNavigated] = useState(false);

    let sum = 5;
    let timer = null;

    const skip = () => {
        if (!hasNavigated) {
            setHasNavigated(true);
            navigation.replace("BottomTabs");
        }
    }

    useEffect(() => {

        if (RNStorage.info?.splash?.pic) {
            StatusBar.setHidden(true);
            setSplash(RNStorage.info?.splash?.pic);
            timer = setInterval(() => {
                sum = sum - 1;
                setNum(sum);
                if (sum <= 0) {
                    sum = 0;
                    skip();
                }

            }, 1000);
        } else {
            skip();
        }


        return () => {
            StatusBar.setHidden(false);
            if (timer) {
                clearInterval(timer);
            }
        }
    }, [navigation, hasNavigated]); // useEffect 依赖项为空数组，表示只在组件挂载时执行一次

    return (

        <View style={{ flex: 1, width: '100%', backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
            {(splash && !hasNavigated) ? (
                <View style={styles.img}>
                    <TouchableWithoutFeedback onPress={skip}>
                        <View style={styles.skip}>
                            <Text style={{ color: 'white' }}>跳过 {num}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <FastImage
                        style={styles.img}
                        source={Util.getThumb(splash)}
                        resizeMode='cover'
                    />
                </View>

            ) : (
                <Text style={{ color: GlobalStyle.gray }}>正在进入</Text>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    img: {
        flex: 1,
        width: '100%'
    },

    skip: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#000000AA',
        zIndex: 10,
        width: 70,
        height: 26,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default Splash;
