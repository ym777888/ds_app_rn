import React from 'react';
import { Text, View, StyleSheet, RefreshControl, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import Util from "../common/Util";
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';

const { width } = Dimensions.get('window');

const priceBadge = (price) => {
    if (price > 0) {
        return (
            <View style={styles.badge}>
                <Image style={styles.coin} source={require('../../assets/icon_diamond3.png')} />
                <Text style={styles.money}>{price}</Text>
            </View>
        );
    } else if (price === 0) {
        return (
            <View style={styles.badge2}>
                <Text style={styles.free}>免费</Text>
            </View>
        );
    }
    return null;
};

const GridItem = ({ data = {}, nav = {}, index }) => {
    const isRight = (index % 2 !== 0);

    return (
        <TouchableWithoutFeedback onPress={() => { nav.navigate('Player', { data: data }) }} key={index}>
            <View style={[styles.listItem, { width: width * 0.5 - 4 }, isRight ? { marginLeft: 8 } : { marginLeft: 0 }]}>
                <View style={styles.box}>
                    <FastImage
                        style={[
                            styles.img,
                            { height: width * 0.5 * Util.HEIGHT_RATIO } // 计算高度
                        ]}
                        source={Util.getThumb(data.thumb)}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text style={{
                            fontSize: 14,
                            color: GlobalStyle.sysFont(),
                            lineHeight: 22,
                    }} numberOfLines={2}>{data.title}</Text>
                    {priceBadge(data.price)}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({

    listItem: {
        flexDirection: 'column',
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
        marginVertical: 8,
        width: width * 0.5,
    },
    box: {
        flex: 1,
    },
    img: {
        width: '100%',
    },

    icon: {
        width: 14,
        height: 14,
        marginHorizontal: 3
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEEEEE',
        height: 32,
        width: 160,
        justifyContent: 'center',
        marginHorizontal: 20,
        borderRadius: 10,
    },
    badge: {
        position: 'absolute',
        top: 1,
        right: 1,
        width: 40,
        height: 16,
        backgroundColor: '#00000099',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge2: {
        position: 'absolute',
        top: 1,
        right: 1,
        width: 40,
        height: 16,
        backgroundColor: '#CC0033',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    coin: {
        width: 14,
        height: 14,
    },
    money: {
        color: '#FF0033',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 17
    },
    free: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold'
    }
});

const areEqual = (prevProps, nextProps) => {
    return prevProps.data === nextProps.data && prevProps.index === nextProps.index;
};

export default React.memo(GridItem, areEqual);
