import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import NavTitle from '../component/NavTitle';

const BindBank = () => {
    const navigation = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [bankName, setBankName] = useState(null);
    const [account, setAccount] = useState(null);
    const [cardNo, setCardNo] = useState(null);
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
                setBankName(data.bankName);
                setAccount(data.bankAccount);
                setCardNo(data.cardNo);
            }

            if (data.bankName != null && data.bankName != '' && data.bankAccount != null && data.bankAccount != '' && data.cardNo != null & data.cardNo != '') {
                setCanSave(false);
            }else{
                setCanSave(true);
            }

        });
    }


    const save = () => {
        if (isSubmitting) {
            return; // 防止重复提交
        }

        if (bankName == null || account == null || cardNo == null) {
            return;
        }

        setIsSubmitting(true);

        let req = {
            bankName: bankName,
            bankAccount: account,
            cardNo: cardNo
        }

        HttpUtil.postReq(Util.SAVE_BANK_CARD, req, (msg, data) => {
            setIsSubmitting(false);
            Util.showToast(msg);
            back();
        })
    }

    return (
        <View style={[styles.row, { backgroundColor: GlobalStyle.setBg(RNStorage.isDark), }]}>
            <NavTitle nav={navigation} title={'绑定银行卡'} />
            <View style={{ margin: 10, justifyContent: 'center', flexDirection: 'row' }}>

            </View>
            <View style={styles.search}>
                <Text>
                    开户行
                </Text>
                <TextInput style={styles.searchTxt} placeholder="输入开户行" numberOfLines={1} maxLength={30} value={bankName} onChangeText={setBankName} />
            </View>
            <View style={styles.search}>
                <Text>
                    户名
                </Text>
                <TextInput style={styles.searchTxt} placeholder="输入户名" numberOfLines={1} maxLength={20} value={account} onChangeText={setAccount} />
            </View>
            <View style={styles.search}>
                <Text>
                    银行卡号
                </Text>
                <TextInput style={styles.searchTxt} placeholder="输入银行卡号" numberOfLines={1} maxLength={30} value={cardNo} onChangeText={setCardNo} />
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

export default BindBank;


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