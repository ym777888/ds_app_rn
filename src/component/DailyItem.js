import React, { useCallback } from 'react';
import moment from 'moment';
import { GlobalStyle } from '../common/GlobalStyle';
import { Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Util from '../common/Util';
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

const DailyItem = React.memo(({ data = {}, nav = {}, index, btn1Callback, btn2Callback }) => {
    const handlePress = useCallback((itemData) => {
        nav.navigate('Player', { data: itemData });
    }, [nav]);

    if (!data || !data.data) {
        return null; // Handle case where data is invalid
    }

    const items = data.data.slice(0, 5).map((itemData, i) => (
        <TouchableWithoutFeedback onPress={() => { handlePress(itemData); }} key={i}>
            <View style={[
                styles.listItem,
                i === 0 ? { width: width } : { width: width * 0.5 - 4 }
            ]}>
                <View style={styles.box}>
                    <FastImage
                        style={[
                            styles.img,
                            { height: width * (i === 0 ? 1 : 0.5) * Util.HEIGHT_RATIO }
                        ]}
                        source={Util.getThumb(itemData.thumb)}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text style={GlobalStyle.title2} numberOfLines={2}>{itemData.title}</Text>
                    {priceBadge(itemData.price)}
                </View>
            </View>
        </TouchableWithoutFeedback>
    ));

    return (
        <View style={{ marginTop: GlobalStyle.marginTop }}>
            <View style={styles.sectionHeader}>
                <Text style={GlobalStyle.title1}>{data.title}</Text>
                <TouchableWithoutFeedback onPress={() => { btn1Callback(data.title); }}>
                    <Text style={styles.more}>更多 &gt;</Text>
                </TouchableWithoutFeedback>
            </View>

            <View style={styles.main}>
                {items}
            </View>

            <View style={styles.sectionFoot}>
                <TouchableWithoutFeedback onPress={() => { btn1Callback(data.title); }}>
                    <View style={styles.btn}>
                        <Image tintColor="#aaaaaa" source={require('../../assets/icon_more.png')} style={styles.icon} />
                        <Text style={{ color: GlobalStyle.black }}>查看全部</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { btn2Callback(data.title); }}>
                    <View style={styles.btn}>
                        <Image tintColor="#aaaaaa" source={require('../../assets/icon_refresh.png')} style={styles.icon} />
                        <Text style={{ color: GlobalStyle.black }}>换一批</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}, (prevProps, nextProps) => {
    return false;
});

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
    img: {},
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
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
        marginHorizontal: 3,
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
        justifyContent: 'center',
    },
    coin: {
        width: 14,
        height: 14,
    },
    money: {
        color: '#FF0033',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 17,
    },
    free: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default DailyItem;
