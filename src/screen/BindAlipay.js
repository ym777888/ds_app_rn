import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import NavTitle from '../component/NavTitle';

const BindAlipay = () => {
    const navigation = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [alipayAccount, setAlipayAccount] = useState(null);
    const [alipayName, setAlipayName] = useState(null);
    const [canSave, setCanSave] = useState(false);

    const back = () => {
        navigation.goBack();
    }

    useEffect(() => {

        getData();

    }, []);

    const getData = () => {
        let req = {
        }

        HttpUtil.postReq(Util.GET_BANK_CARD, req, (msg, data) => {
            if (data) {
                setAlipayAccount(data.alipayAccount);
                setAlipayName(data.alipayName);
            }

            if (data.alipayAccount != null && data.alipayAccount != '' && data.alipayName != null && data.alipayName != '') {
                setCanSave(false);
            }else{
                setCanSave(true);
            }

        }, (msg) => {
            Util.showToast(msg);
        }, true);
    }


    const save = () => {
        if (isSubmitting) {
            return; // 防止重复提交
        }

        if (alipayAccount == null || alipayName == null) {
            return;
        }

        setIsSubmitting(true);

        let req = {
            alipayAccount: alipayAccount,
            alipayName: alipayName
        }

        HttpUtil.postReq(Util.SAVE_BANK_CARD, req, (msg, data) => {
            setIsSubmitting(false);
            Util.showToast(msg);
            back();
        }, (msg, code) => {
            setIsSubmitting(false);
            Util.showToast(msg);
        }, true)
    }

    return (
        <View style={styles.row}>
            <NavTitle nav={navigation} title={'绑定支付宝'} />
            <View style={{ margin: 10, justifyContent: 'center', flexDirection: 'row' }}>

            </View>
            <View style={styles.search}>
                <Text>
                    支付宝账号
                </Text>
                <TextInput style={styles.searchTxt} placeholder="输入开户行" numberOfLines={1} maxLength={30} value={alipayAccount} onChangeText={setAlipayAccount} />
            </View>
            <View style={styles.search}>
                <Text>
                    姓名
                </Text>
                <TextInput style={styles.searchTxt} placeholder="输入户名" numberOfLines={1} maxLength={20} value={alipayName} onChangeText={setAlipayName} />
            </View>


            {canSave && (
                <TouchableWithoutFeedback onPress={save}>
                    <View style={styles.btn}>
                        <Text style={styles.btnTxt}>保存</Text>
                    </View>
                </TouchableWithoutFeedback>
            )}

        </View>
    );
};

export default BindAlipay;


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
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
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