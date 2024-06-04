import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import NavTitle from '../component/NavTitle';

const Address = () => {
    const navigation = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [name, setName] = useState(null);
    const [userInfo, setUserInfo] = useState({});

    const back = () => {
        navigation.goBack();
    }

    useEffect(() => {

        getAddress();

    }, []);

    const getAddress = () => {
        let req = {
        }

        HttpUtil.postReq(Util.USER_ADDRESS, req, (msg, data) => {
            if (data) {
                setAddress(data.address);
                setName(data.name);
                setPhone(data.phone);
            }

        }, (msg) => {
            Util.showToast(msg);
        }, true);
    }


    const save = () => {
        if (isSubmitting) {
            return; // 防止重复提交
        }

        if (address == null || phone == null || name == null) {
            return;
        }

        setIsSubmitting(true);

        let req = {
            phone: phone,
            address: address,
            name: name
        }

        HttpUtil.postReq(Util.UPDATE_ADDRESS, req, (msg, data) => {
            setIsSubmitting(false);
            Util.showToast(msg);
        }, (msg, code) => {
            setIsSubmitting(false);
            Util.showToast(msg);
        }, true)
    }

    return (
        <View style={styles.row}>
            <NavTitle nav={navigation} title={'收货地址'} />
            <View style={{ margin: 10, justifyContent: 'center', flexDirection: 'row' }}>
                <Text style={{ color: '#993333', fontSize: 12 }}>兑换奖品将发往此地址</Text>
            </View>
            <View style={styles.search}>
                <Text>
                    地址
                </Text>
                <TextInput style={styles.searchTxt} placeholder="输入快递地址" numberOfLines={1} maxLength={200} value={address} onChangeText={setAddress} />
            </View>
            <View style={styles.search}>
                <Text>
                    收件人
                </Text>
                <TextInput style={styles.searchTxt} placeholder="输入收件人" numberOfLines={1} maxLength={20} value={name} onChangeText={setName} />
            </View>
            <View style={styles.search}>
                <Text>
                    手机号
                </Text>
                <TextInput style={styles.searchTxt} placeholder="输入收件人手机号" numberOfLines={1} maxLength={20} value={phone} onChangeText={setPhone} />
            </View>

            <TouchableWithoutFeedback onPress={save}>
                <View style={styles.btn}>
                    <Text style={styles.btnTxt}>保存</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default Address;


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
        margin: GlobalStyle.marginTop,
        flexDirection: 'column',
        marginHorizontal: 10,
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