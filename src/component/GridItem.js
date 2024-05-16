import React, { useState } from 'react';
import { GlobalStyle } from '../common/GlobalStyle';
import { Dimensions, Image, StyleSheet, Text, TouchableHighlight, TouchableWithoutFeedback, View, } from 'react-native';
import FastImage from 'react-native-fast-image'
import Util from '../common/Util';
import { RNStorage } from '../common/RNStorage';

const { width } = Dimensions.get('window');

const priceBadge = (price) => {
    if (price > 0) {
        return (
            <View style={styles.badge}>
                <Image style={styles.coin} source={require('../../assets/icon_coin3.png')}></Image>
                <Text style={styles.money}>{price}</Text>
            </View>
        )
    } else if (price == 0) {
        return (
            <View style={styles.badge2}>
                <Text style={styles.free}>免费</Text>
            </View>
        )
    }
    return <></>
}

const GridItem = ({ data = {}, nav = {}, index }) => {
    const isRight = ((index - 1) % 2 === 0);
    return (
        <View style={ styles.rowContainerOdd }>
            <TouchableWithoutFeedback onPress={() => { nav.navigate('Player', { data: data }) }} key={index}>
                <View style={[styles.listItem, { width: width * 0.5 - 4 }, isRight ? { marginLeft: 8 } : { marginLeft: 0 }]}>
                    <View style={styles.box}>
                        <FastImage
                            style={[
                                styles.img,
                                { height: width *  0.5 * Util.HEIGHT_RATIO } // 计算高度
                            ]}
                            source={Util.getThumb(data.thumb)}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <Text style={GlobalStyle.title2} numberOfLines={2}>{data.title}</Text>
                        {priceBadge(data.price)}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    containerOdd: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    containerEven: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 10,
    },
    main: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: RNStorage.isDark ? '#000' : '#FFF',
    },
    listItem: {
        flexDirection: 'column',
        backgroundColor: RNStorage.isDark ? '#000' : '#FFF',
        marginVertical: 8,
        width: width * 0.5,
    },
    box: {
        flex: 1,
    },
    img: {

    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center'
    },
    sectionFoot: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    more: {
        color: GlobalStyle.gray,
        paddingRight: 10,
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
        lineHeight: 16
    },
    free: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold'
    }
});

export default React.memo(GridItem);
