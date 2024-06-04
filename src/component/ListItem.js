import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { GlobalStyle } from '../common/GlobalStyle';
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

const ListItem = React.memo(({ data = {}, nav = {}, index }) => {
    const isOddRow = index % 6 === 0;
    const isRight = !isOddRow && ((index - 1) % 2 === 0);

    const handlePress = () => {
        nav.navigate('Player', { data });
    };

    return (
        <View style={isOddRow ? styles.rowContainerOdd : styles.rowContainerEven}>
            <TouchableWithoutFeedback onPress={handlePress} key={index}>
                <View style={[
                    styles.listItem,
                    isOddRow ? { width: width } : { width: width * 0.5 - 4 },
                    isRight ? { marginLeft: 8 } : { marginLeft: 0 }
                ]}>
                    <View style={styles.box}>
                        <FastImage
                            style={[
                                styles.img,
                                { height: width * (isOddRow ? 1 : 0.5) * Util.HEIGHT_RATIO }
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
        </View>
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
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
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

export default ListItem;
