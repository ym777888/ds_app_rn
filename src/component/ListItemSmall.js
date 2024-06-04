import React, { useCallback } from 'react';
import { GlobalStyle } from '../common/GlobalStyle';
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Util from '../common/Util';
import { RNStorage } from '../common/RNStorage';

const { width } = Dimensions.get('window');

const ListItemSmall = React.memo(({ data = {}, nav = {}, index }) => {
    const handlePress = useCallback(() => {
        nav.navigate('Player', {
            data: {
                thumb: data.clipThumb,
                title: data.clipTitle,
                uuid: data.clipKey,
                price: Util.getRandom(RNStorage.minPrice, RNStorage.maxPrice)
            }
        });
    }, [nav, data.clipThumb, data.clipTitle, data.clipKey, data.payDiamond]);

    if (!data || !data.clipThumb || !data.clipTitle || !data.createTime) {
        return null; // Handle case where data is invalid
    }

    return (
        <TouchableWithoutFeedback onPress={handlePress} key={index}>
            <View style={styles.listItem}>
                <View style={styles.box}>
                    <FastImage
                        style={styles.img}
                        source={Util.getThumb(data.clipThumb)}
                        resizeMode='stretch'
                    />
                    <View style={styles.right}>
                        <Text style={styles.title2} numberOfLines={2}>{data.clipTitle}</Text>
                        <Text style={styles.date} numberOfLines={2}>{data.createTime}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data && prevProps.index === nextProps.index;
});

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
        margin: 10,
        height: width * 0.3 * 0.6,
    },
    box: {
        flex: 1,
        flexDirection: 'row',
    },
    img: {
        width: width * 0.3,
        height: width * 0.3 * 0.6,
    },
    right: {
        padding: 8,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    title2: {
        fontSize: 14,
        color: '#000000',
        width: width * 0.6,
        lineHeight: 20,
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

export default ListItemSmall;
