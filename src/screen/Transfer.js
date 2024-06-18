import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import NavTitle from '../component/NavTitle';

const Transfer = () => {
    const navigation = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amount, setAmount] = useState('0');
    const [phone, setPhone] = useState(0);
    const [userInfo, setUserInfo] = useState({});
    const [message, setMessage] = useState(null);

    const back = () => {
        navigation.goBack();
    }

    useEffect(() => {

        guestInfo();

    }, []);

    const guestInfo = () => {
        let req = {
        }

        HttpUtil.postReq(Util.USER_INFO, req, (msg, data) => {
            setUserInfo(data);
        });
    }


    const trans = () => {
        if (isSubmitting) {
            return; // 防止重复提交
        }

        if (phone == null) {
            return;
        }

        if (amount == null || amount <= 0) {
            return;
        }

        if (userInfo.user.diamond < 0 || userInfo.user.diamond < amount) {
            Util.showToast("余额不足");
            return;
        }


        setIsSubmitting(true);


        let req = {
            phone: phone,
            amount: amount,
            message: message
        }

        HttpUtil.postReq(Util.TRANS_DIAMOND, req, (msg, data) => {
            setIsSubmitting(false);
            guestInfo();
            Util.showToast(msg);
            setAmount('0');
            setMessage('');
            setPhone('');
        }, (msg, data) => {
            setIsSubmitting(false);
            Util.showToast(msg);
        }, true)
    }

    const showhand = () => {
        console.log('userInfo.user.diamond', userInfo);
        setAmount(userInfo ? String(userInfo.user.diamond) : '0');
    }

    return (
        <View style={[styles.row, { backgroundColor: GlobalStyle.setBg(RNStorage.isDark), }]}>
            <NavTitle nav={navigation} title={'转账'} />
            <View style={{ margin: 10, justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={{ color: '#993333', fontSize: 12 }}>将钻石转给其他用户</Text>
            </View>
            <View style={styles.search}>
                <Text>
                    收款账号
                </Text>
                <TextInput style={[styles.searchTxt, { color: GlobalStyle.sysFont(), }]} placeholder="输入对方手机号" numberOfLines={1} maxLength={20} value={phone} onChangeText={setPhone} />
            </View>
            <View style={styles.search}>
                <Text>转账金额</Text>
                <TextInput style={[styles.searchTxt, { color: GlobalStyle.sysFont(), }]} placeholder="输入转账金额" secureTextEntry={false} numberOfLines={1} maxLength={20} value={amount} onChangeText={setAmount} />
                <TouchableWithoutFeedback onPress={showhand}>
                    <View style={{ width: 80, height: 26, justifyContent: 'center', alignItems: 'center', backgroundColor: '#CC0033', borderRadius: 10 }}>
                        <Text style={{ color: 'white' }}>全部</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.search}>
                <Text>
                    备注留言
                </Text>
                <TextInput style={[styles.searchTxt, { color: GlobalStyle.sysFont(), }]} placeholder="输入备注" numberOfLines={1} maxLength={200} value={message} onChangeText={setMessage} />
            </View>
            <View style={styles.balance}>
                <Text>钻石余额: <Text style={{ color: '#993333' }}>{userInfo?.user?.diamond}</Text></Text>
            </View>
            <TouchableWithoutFeedback onPress={trans}>
                <View style={styles.btn}>
                    <Text style={styles.btnTxt}>转账</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default Transfer;


const styles = StyleSheet.create({
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 0,
        borderBottomWidth: 0.4,
        marginHorizontal: 10,
        height: 44,
        marginVertical: 5,
    },
    balance: {
        marginHorizontal: 10,
        height: 44,
        marginVertical: 5,
    },
    searchTxt: {
        flex: 1,
        height: 30,
        lineHeight: 30,
        marginLeft: 5,
        padding: 0,

    },
    row: {
        flexDirection: 'column',

        flex: 1,
    },
    btn: {

        marginHorizontal: 10,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#CC0033',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    btnTxt: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    small: {
        fontSize: 14, fontWeight: 'bold', color: '#000000', marginVertical: 5
    },
    small2: {
        fontSize: 12, color: '#555555'
    },
    title: {
        justifyContent: 'center', alignItems: 'center'
    },
});