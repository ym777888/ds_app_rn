import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import { RNStorage } from '../common/RNStorage';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";

const Login = () => {
    const navigation = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const back = () => {
        navigation.goBack();
    }

    const login = () => {
        if (isSubmitting) {
            return; // 防止重复提交
        }
        setIsSubmitting(true);

        if (phone == null || password == null) {
            return;
        }

        let req = {
            phone: phone,
            password: password,
            code: RNStorage.code ? RNStorage.code : ""
        }

        HttpUtil.postReq(Util.LOGIN, req, (msg, data) => {
            setIsSubmitting(false);
            RNStorage.token = data.token;
            RNStorage.isLogin = true;
            Util.showToast('登录成功!', 500, () => {
                back();
            });
        }, (msg, data) => {
            setIsSubmitting(false);
            Util.showToast(msg);
        }, true)
    }

    return (
        <View style={styles.row}>
            <TouchableWithoutFeedback onPress={()=>{navigation.goBack()}}>
                <View>
                    <Image source={require('../../assets/icon_back.png')} style={{ width: 34, height: 34 }} tintColor="#888888" />
                </View>
            </TouchableWithoutFeedback>

            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10, }}>
                <Image resizeMode='contain' source={require('../../assets/app_icon.png')} style={{ width: 54, height: 54, borderRadius: 90, borderWidth: 2, borderColor: 'white' }} />
                <View style={styles.title}>
                    <Text style={styles.small}>{RNStorage.info?.appName}</Text>
                    <Text style={styles.small2} numberOfLines={1}>永久网址:{RNStorage.info?.appSite}</Text>
                </View>
            </View>

            <View style={styles.search}>
                <Image source={require('../../assets/icon_phone.png')} style={{ width: 22, height: 22, borderRadius: 5 }} tintColor="#cccccc" />
                <TextInput style={styles.searchTxt} placeholder="输入手机号" numberOfLines={1} maxLength={20} value={phone} onChangeText={setPhone} />
            </View>
            <View style={styles.search}>
                <Image source={require('../../assets/icon_lock.png')} style={{ width: 22, height: 22, borderRadius: 5 }} tintColor="#cccccc" />
                <TextInput style={styles.searchTxt} placeholder="输入密码" secureTextEntry={true} numberOfLines={1} maxLength={20} value={password} onChangeText={setPassword} />
            </View>
            <TouchableWithoutFeedback onPress={login}>
                <View style={styles.btn}>
                    <Text style={styles.btnTxt}>注册 | 登录</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default Login;


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