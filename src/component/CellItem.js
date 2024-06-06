import React, { useCallback } from 'react';
import { GlobalStyle } from '../common/GlobalStyle';
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import Util from '../common/Util';
import { RNStorage } from '../common/RNStorage';

const { width } = Dimensions.get('window');

const CellItem = React.memo(({ data = {}, nav = {}, index }) => {
    let num = 1;
    const handlePress = useCallback(() => {
        if (data.name.indexOf('版本') > 0) {
            num = num + 1;
            if (num > 10) {
                num = 1;
                nav.navigate("Logcat");
            }
            return;
        }
        if (data.tip) {
            Util.showToast(data.tip, 1000)
        } else if (data.nav) {
            nav.navigate(data.nav);
        }
    }, [data]);

    if (!data) {
        return null; // Handle case where data is invalid
    }

    return (
        <TouchableWithoutFeedback onPress={handlePress} key={index}>
            <View style={[styles.line]}>
                <Text style={styles.lineTitle}>{data.name}</Text>
                <View style={styles.right}>
                    <Text>{data.value}</Text>
                    <Image tintColor={'#CCCCCC'} style={styles.btn3Img} source={require('../../assets/icon_arrow.png')}></Image>
                </View>

            </View>
        </TouchableWithoutFeedback>
    );
}, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data && prevProps.index === nextProps.index;
});

const styles = StyleSheet.create({
    line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#aaaaaa',
        borderWidth: 0.3,
        height: 40,
        lineHeight: 40,
        marginHorizontal: 15,
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
        borderRadius: 1
    },

    lineTitle: {
        fontSize: 14,
        color: GlobalStyle.sysFont(),
        marginLeft: 10,
    },
    btn3Img: {
        width: 30,
        height: 30,
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default CellItem;
