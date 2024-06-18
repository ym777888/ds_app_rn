import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import NavTitle from '../component/NavTitle';

const Password = () => {
    const navigation = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [password1, setPassword1] = useState(null);
    const [password2, setPassword2] = useState(null);

    const back = () => {
        navigation.goBack();
    }

    const save = () => {
        if (isSubmitting) {
            return; // 防止重复提交
        }

        if (password1 == null || password2 == null) {
            return;
        }

        if (password2.length < 6 || password2.length > 20) {
            Util.showToast('请输入6-20位密码');
            return;
        }

        if (password2 === '123456' || password2 === '12345678' || password2 === '111111' || password2 === '123123') {
            Util.showToast('请勿使用简单密码!');
            return;
        }

        setIsSubmitting(true);

        let req = {
            password1: password1,
            password2: password2,
        }

        HttpUtil.postReq(Util.USER_PASSWORD, req, (msg, data) => {
            setIsSubmitting(false);
            Util.showToast('保存成功');
            back();
        },(msg)=>{
            setIsSubmitting(false);
        });



    }

    return (
        <View style={[styles.row, { backgroundColor: GlobalStyle.setBg(RNStorage.isDark), }]}>
            <NavTitle nav={navigation} title={'修改密码'} />
            <View style={styles.search}>
                <Text>
                    旧密码
                </Text>
                <TextInput style={styles.searchTxt} placeholder="输入旧密码" numberOfLines={1} maxLength={20} value={password1} onChangeText={setPassword1} />
            </View>
            <View style={styles.search}>
                <Text>新密码</Text>
                <TextInput style={styles.searchTxt} placeholder="输入新密码" secureTextEntry={false} numberOfLines={1} maxLength={20} value={password2} onChangeText={setPassword2} />

            </View>
            <TouchableWithoutFeedback onPress={save}>
                <View style={styles.btn}>
                    <Text style={styles.btnTxt}>保存</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default Password;


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