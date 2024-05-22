import React, { useState,useCallback  } from 'react';
import moment from 'moment';
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
                <Image style={styles.coin} source={require('../../assets/icon_diamond3.png')}></Image>
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

const DailyItem = ({ data = {}, nav = {}, index, btn1Callback, btn2Callback }) => {

    const handlePress = useCallback((itemData) => {
        nav.navigate('Player', { data: itemData });
    }, [nav]);

    if (!data || !data.data) {
        return null; // 处理 data 为空的情况
    }

    let arr = [];
    for (var i = 0; i < 5; i++) {
        const itemData = data.data[i];
        arr.push(
            <TouchableWithoutFeedback onPress={() => { handlePress(itemData) }} key={i}>
                <View style={[styles.listItem, i === 0 ? { width: width } : { width: width * 0.5 - 4 }]}>
                    <View style={styles.box}>
                        <FastImage
                            style={[
                                styles.img,
                                { height: width * (i === 0 ? 1 : 0.5) * Util.HEIGHT_RATIO } // 计算高度
                            ]}
                            source={Util.getThumb(data.data[i].thumb)}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <Text style={GlobalStyle.title2} numberOfLines={2}>{data.data[i].title}</Text>
                        {priceBadge(data.data[i].price)}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    return (
        <View style={{ marginTop: GlobalStyle.marginTop }}>
            <View style={styles.sectionHeader}>
                <View>
                    <Text style={GlobalStyle.title1}>{data.title}</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => { btn1Callback(data.title) }}>
                    <View>
                        <Text style={styles.more}>更多 &gt;</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>

            <View style={styles.main}>
                {arr}
            </View>

            <View style={styles.sectionFoot}>
                <TouchableWithoutFeedback onPress={() => { btn1Callback(data.title) }}>
                    <View style={styles.btn}>
                        <Image tintColor="#aaaaaa" source={require('../../assets/icon_more.png')} style={styles.icon}></Image>
                        <Text style={{ color: GlobalStyle.black }}>查看全部</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { btn2Callback(data.title) }}>
                    <View style={styles.btn}>
                        <Image tintColor="#aaaaaa" source={require('../../assets/icon_refresh.png')} style={styles.icon}></Image>
                        <Text style={{ color: GlobalStyle.black }}>换一批</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
        lineHeight: 17
    },
    free: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold'
    }
});

export default React.memo(DailyItem);
