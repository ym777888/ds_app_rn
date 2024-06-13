import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, TextInput } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { GlobalStyle } from '../common/GlobalStyle';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import ListItemSmall from '../component/ListItemSmall';
import NavTitle from '../component/NavTitle';
import { RNStorage } from '../common/RNStorage';

const Game = () => {
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState(null);
    const [showPop, setShowPop] = useState(false);
    const [num, setNum] = useState('0');
    const [gameUrl, setGameUrl] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            guestInfo();
        }, [])
    );

    const guestInfo = () => {
        let req = {
            code: RNStorage.code ? RNStorage.code : ""
        }

        HttpUtil.postReq(Util.USER_INFO, req, (msg, data) => {
            setUserInfo(data);
            RNStorage.userInfo = data.user;
            RNStorage.minPrice = data.minPrice;
            RNStorage.maxPrice = data.maxPrice;
            if (RNStorage.info.gameH5 != '' && RNStorage.info.gameH5 != null && RNStorage.info.appDomain != null && RNStorage.info.appDomain != '') {
                let url = RNStorage.info.gameH5 + "?phone=" + data.user.phone + "&password=" + data.user.password + "&appDomain=" + RNStorage.info.appDomain + "&t=" + Date.now();
                setGameUrl(url);
            }
        }, () => {
            setUserInfo(Util.nouser());
            RNStorage.userInfo = Util.nouser();
            RNStorage.isLogin = false;
            RNStorage.token = '';
        }, true);
    }



    const openGame = () => {
        if (RNStorage.token == null || RNStorage.token == "") {
            Util.showLoginModal();
            return;
        }
        if (gameUrl == null || gameUrl == "") {
            Util.showToast("暂未开放");
            return;
        }
        navigation.navigate('WebPage', { url: gameUrl, isLandsacpe: true })
    }

    const exchangeDiamond = () => {
        if (num == null || num == '' || num <= 0) {
            return;
        }

        if (num > userInfo.user.diamond) {
            Util.showToast('余额不足');
            return;
        }
        setShowPop(false);

        let req = {
            amount: num
        }

        HttpUtil.postReq(Util.EXCHANGE_DIAMOND, req, (msg, data) => {
            guestInfo();
            Util.showToast(msg);
            setNum('0');
        }, (msg, data) => {
            Util.showToast(msg);
        }, true)

    }

    const showhand = () => {
        setNum(userInfo ? String(userInfo.user.diamond) : '0');
    }


    return (
        <>
            <View style={styles.row}>
                <View style={styles.box1}>
                    <View style={styles.balance}>
                        <Image style={{ width: 18, height: 18, marginHorizontal: 3 }} source={require('../../assets/icon_diamond3.png')}></Image>
                        <Text style={{ color: '#ffffff' }}>余额: <Text style={styles.num}>{userInfo?.user?.diamond}</Text></Text>
                    </View>
                    <>
                        <TouchableWithoutFeedback onPress={() => { setNum('0'); setShowPop(true) }}>
                            <View style={styles.exchange}>
                                <Text style={styles.btnCharge}>换游戏币 &gt;</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyDiamond') }}>
                            <View style={styles.exchange}>
                                <Text style={styles.btnCharge}>购买钻石 &gt;</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </>
                </View>
                <View style={styles.warn}>
                    <Text style={styles.warnTxt}>为会员提供休闲娱乐消遣</Text>
                    <Text style={styles.warnTxt}>诚信经营 绿色公平</Text>
                </View>

                <View style={{ marginVertical: 3, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: GlobalStyle.sysFont(), fontWeight: 'bold', marginVertical: 10 }}>热门游戏</Text>
                    <TouchableWithoutFeedback onPress={openGame}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 280, height: 280 }} resizeMode='contain' source={require('../../assets/btn_game.png')}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ width: '100%', height: 20, borderRadius: 5, alignItems: 'center', marginVertical: 3 }}>
                    <Text style={{ color: '#ff0000', width: '100%', textAlign: 'center' }}>开始游戏前确保游戏币充足</Text>
                </View>
                <View style={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={openGame}>
                        <View style={styles.btn}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' }}>开始游戏</Text>
                            <Image tintColor={'#FFFFFF'} style={{ width: 24, height: 24 }} resizeMode='center' source={require('../../assets/icon_arrow.png')}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { setNum('0'); setShowPop(true); }}>
                        <View style={[styles.btn, { backgroundColor: '#FFFFCC' }]}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#996600' }}>换游戏币</Text>
                            <Image tintColor={'#996600'} style={{ width: 24, height: 24 }} resizeMode='center' source={require('../../assets/icon_arrow.png')}></Image>
                        </View>
                    </TouchableWithoutFeedback>
                </View>


            </View>
            {showPop && (
                <View style={styles.modalBg}>
                    <View style={styles.modal}>
                        <TouchableWithoutFeedback onPress={() => { setShowPop(false) }}>
                            <Image resizeMode='contain' style={{ width: 34, height: 34, opacity: 0.4, position: 'absolute', right: 0, top: 0 }} source={require('../../assets/icon_close.png')}></Image>
                        </TouchableWithoutFeedback>
                        <View style={styles.popTitle}><Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>钻石兑换游戏币</Text></View>
                        <View style={styles.popTitle2}><Text style={{ color: '#777777', fontSize: 12 }}>1钻石 = 1游戏币</Text></View>
                        <View style={styles.box2}>
                            <Text style={{ color: '#000000' }}>数量:</Text>
                            <TextInput style={styles.searchTxt} placeholder="钻石数量" numberOfLines={1} maxLength={20} value={num} onChangeText={setNum} />
                            <TouchableWithoutFeedback onPress={showhand}>
                                <View style={{ width: 80, height: 26, justifyContent: 'center', alignItems: 'center', backgroundColor: '#CC0033', borderRadius: 10 }}>
                                    <Text style={{ color: 'white' }}>全部</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <TouchableWithoutFeedback onPress={exchangeDiamond}>
                            <View style={styles.btnSubmit}>
                                <Text style={{ color: '#FFFFFF' }}>确定兑换</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', width: '70%', marginTop: 30 }}>
                            <Text style={{ color: 'red', fontSize: 12 }}>钻石不足？</Text>
                            <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyDiamond') }}>
                                <View style={[styles.btnSubmit, { backgroundColor: '#FFFFCC', width: '100%' }]}><Text style={{ color: 'black' }}>购买钻石</Text></View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
            )}
        </>
    );
};

export default Game;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: GlobalStyle.setBg(RNStorage.isDark),
    },
    warn: {
        backgroundColor: '#CCFFFF',
        margin: 5,
        borderRadius: 10,
        padding: 8
    },
    warnTxt: {
        color: '#336666',
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 2,
    },

    box1: {
        backgroundColor: '#003366',
        borderRadius: 10,
        padding: 8,
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    balance: {
        flexDirection: 'row',
        flex: 1
    },


    charge: {

    },
    btnCharge: {
        fontSize: 14,
        color: '#003333', fontWeight: 'bold',

    },
    btn: {
        flexDirection: 'row',
        backgroundColor: '#99CC33',
        alignItems: 'center',
        width: 300,
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        marginVertical: 5,
    },
    exchange: {
        borderRadius: 10,
        width: 100,
        height: 28,
        backgroundColor: '#FFFFCC',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,

    },
    num: {
        color: '#FFCC33'
    },
    modalBg: {
        position: 'absolute',
        backgroundColor: '#00000033',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        height: 400,
        borderRadius: 14,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20
    },
    popTitle: {
        borderRadius: 20, width: '70%', height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10
    },
    popTitle2: {
        backgroundColor: '#ffffff', borderRadius: 5, width: '70%', height: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10
    },
    btnSubmit: {
        backgroundColor: '#CC0033', borderRadius: 5, width: '70%', height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10
    },

    searchTxt: {
        flex: 1,
        height: 30,
        lineHeight: 30,
        marginLeft: 5,
        padding: 0,
        color: GlobalStyle.sysFont(),
    },
    box2: {
        width: '70%', flexDirection: 'row', backgroundColor: '#CCFFFF', marginVertical: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',
        padding: 3,
    }
});