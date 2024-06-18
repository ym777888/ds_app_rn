import React, { useCallback } from 'react';
import { GlobalStyle } from '../common/GlobalStyle';
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { RNStorage } from '../common/RNStorage';

const { width } = Dimensions.get('window');

const fmtStatus = (code) => {
    if (code == 0) {
        return '待发货'
    } else if (code == 1) {
        return '已发货'
    }
}

const DeliveryItem = React.memo(({ data = {}, nav = {}, index }) => {

    if (!data || !data.name) {
        return null; // Handle case where data or data.remark is invalid
    }

    return (
        <View style={styles.listItem}>
            <View style={styles.box}>
                <View style={styles.line}>
                    <Text style={[styles.title, { color: GlobalStyle.setFont(RNStorage.isDark) }]}>{data.giftName}</Text>
                    <Text style={styles.txt} numberOfLines={2}>{data.createTime}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={[styles.title2, { color: GlobalStyle.setFont(RNStorage.isDark) }]}>收件人</Text>
                    <Text style={styles.txt}>{data.name}{data.phone}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={[styles.title2, { color: GlobalStyle.setFont(RNStorage.isDark) }]}>状态</Text>
                    <Text style={data.status==0?styles.txt2:styles.txt1}>{fmtStatus(data.status)}</Text>
                </View>
                <View style={styles.line}>
                    <Text style={[styles.title2, { color: GlobalStyle.setFont(RNStorage.isDark) }]}>备注</Text>
                    <Text style={styles.txt}>{data.remark}</Text>
                </View>
            </View>
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
    },
    listItem: {
        flexDirection: 'column',
        margin: 10,
        borderRadius: 5,
        borderColor: '#888888',
        borderWidth: 0.5,
        flex: 1,
    },
    box: {
        flex: 1,
        flexDirection: 'column',
        padding: 7,
    },
    line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    right: {
        padding: 8,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 14,
        color: '#000000',
        fontWeight: 'bold',
    },
    title2: {
        fontSize: 14,
        color: '#000000',
    },
    txt: {
        fontSize: 14,
        color: '#888888',
    },
    txt1: {
        fontSize: 14,
        color: '#336633',
    },
    txt2: {
        fontSize: 14,
        color: '#993333',
    },
    txt3: {
        fontSize: 14,
        color: '#003399',
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

export default DeliveryItem;
