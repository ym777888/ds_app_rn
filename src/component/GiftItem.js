import React, { useCallback } from 'react';
import { GlobalStyle } from '../common/GlobalStyle';
import { Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Util from '../common/Util';
import { RNStorage } from '../common/RNStorage';

const { width } = Dimensions.get('window');

const GiftItem = React.memo(({ data = {}, nav = {}, index, cb = null }) => {
    const handlePress1 = useCallback((data) => {
        nav.navigate('Info', {
            data: data
        });
    }, [nav, data.name]);

    const handlePress2 = useCallback((data) => {
        if (cb != null) {
            cb(data);
        }
    }, [nav, data.name]);

    if (!data || !data.name) {
        return null; // Handle case where data is invalid
    }

    return (

        <View style={[styles.listItem, { marginLeft: index % 2 == 0 ? 0 : 5 }]} key={index}>

                <TouchableWithoutFeedback onPress={() => { handlePress1(data) }} >
                    <FastImage
                        style={styles.img}
                        source={Util.getThumb(data.icon)}
                        resizeMode='stretch'
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { handlePress1(data) }} >
                    <View style={styles.right}>
                        <Text style={styles.title2} numberOfLines={1}>{data.name}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { handlePress1(data) }} >
                    <View style={styles.right}>
                        <Text style={styles.title3} numberOfLines={2}>{data.name}</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => { handlePress2(data) }}>
                    <View style={styles.btnGift}>
                        <Image style={{ width: 18, height: 18, marginHorizontal: 3 }} source={require('../../assets/icon_diamond3.png')}></Image>
                        <Text style={{ color: 'red' }}>{data.costDiamond}<Text style={{ color: '#003399' }}> 兑换</Text></Text>
                    </View>
                </TouchableWithoutFeedback>

        </View>

    );
}, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data && prevProps.index === nextProps.index;
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
        marginVertical: 10,
        height: 260,
        width: width * 0.5 - 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: '#dddddd',
        borderWidth: 1,
        borderRadius: 10,
        padding: 4,
    },
    img: {
        width: width * 0.5 - 20,
        height: (width * 0.5 - 20) / 1.8,
        borderRadius: 5,
    },
    right: {
        padding: 3,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    btnGift: {
        flexDirection: 'row',
        backgroundColor: '#FFFFCC',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginVertical: 5,
        borderColor: '#FF9900',
        borderWidth: 1,
    },
    title2: {
        fontSize: 14,
        color: '#000000',
        width: '100%',
        lineHeight: 20,
        textAlign: 'center'
    },
    title3: {
        fontSize: 12,
        color: '#666666',
        width: '100%',
        lineHeight: 20,
        textAlign: 'center'
    },
    date: {
        color: '#999999',
        fontSize: 12,
    },
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

export default GiftItem;
