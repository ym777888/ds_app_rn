import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, RefreshControl, FlatList, TextInput } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { ThemeProvider, useTheme } from '../common/ThemeContext'
import { GlobalStyle } from '../common/GlobalStyle';
import HttpUtil from "../common/HttpUtil";
import Util from "../common/Util";
import GiftItem from '../component/GiftItem';
import NavTitle from '../component/NavTitle';
import { RNStorage } from '../common/RNStorage';



const Gift = () => {
    const navigation = useNavigation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [dataList, setDataList] = useState([]); // 初始数据
    const route = useRoute(); // 使用 useRoute 钩子获取路由参数
    const currentPageRef = useRef(1);
    const [showPop, setShowPop] = useState(false);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [name, setName] = useState(null);
    const [gift, setGift] = useState(null);


    useEffect(() => {
        queryDataList();
    }, []);

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

        }, (msg) => {
            setUserInfo(Util.nouser());
            RNStorage.userInfo = Util.nouser();
            RNStorage.isLogin = false;
            RNStorage.token = '';
            Util.showToast(msg);
        }, true);
    }

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



    const buyGift = (data) => {
        getAddress();
        setGift(data);
        setShowPop(true);
    }

    const renderItem = ({ item, index }) => {
        return <GiftItem data={item} nav={navigation} index={index} cb={buyGift} />
    };

    const renderHeader = () => {
        return (
            <></>

        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        currentPageRef.current = 1; // 加载下一页数据
        setDataList([]);
        queryDataList();
        setTimeout(() => {
            setRefreshing(false);
        }, 10000);
    };



    const queryDataList = () => {
        let req = {
            p: currentPageRef.current,
            pageSize: 10
        };

        HttpUtil.postReq(Util.GIFT_LIST, req, (msg, newData) => {
            setDataList(newData);
            setRefreshing(false);

        })
    }


    const save = () => {
        if (isSubmitting) {
            return; // 防止重复提交
        }

        if (phone == null) {
            return;
        }

        if (userInfo.user.diamond < gift.costDiamond) {
            Util.showToast("余额不足");
            return;
        }

        setIsSubmitting(true);

        let req = {
            phone: phone,
            address: address,
            name: name,
            giftId: gift.giftId
        }

        HttpUtil.postReq(Util.BUY_GIFT, req, (msg, data) => {
            setIsSubmitting(false);
            Util.showToast(msg);
            setShowPop(false);
            guestInfo();
        }, (msg, code) => {
            setIsSubmitting(false);
            Util.showToast(msg);
        }, true)
    }

    return (
        <View style={[styles.row, { backgroundColor: GlobalStyle.setBg(RNStorage.isDark), }]}>
            <View style={styles.box1}>
                <View style={styles.balance}>
                    <Image style={{ width: 18, height: 18, marginHorizontal: 3 }} source={require('../../assets/icon_diamond3.png')}></Image>
                    <Text style={{ color: '#ffffff' }}>余额: <Text style={styles.num}>{userInfo?.user?.diamond}</Text></Text>
                </View>
                <TouchableWithoutFeedback onPress={() => { navigation.navigate('BuyDiamond') }}>
                    <View style={styles.exchange}>
                        <Text style={styles.btnCharge}>购买钻石 &gt;</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <FlatList
                style={{ backgroundColor: GlobalStyle.setBg(RNStorage.isDark), }}
                data={dataList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                numColumns={2}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContainer}
            />
            {showPop && (
                <View style={styles.modalBg}>
                    <View style={styles.modal}>
                        <TouchableWithoutFeedback onPress={() => { setShowPop(false) }}>
                            <Image resizeMode='contain' style={{ width: 34, height: 34, opacity: 0.4, position: 'absolute', right: 0, top: 0 }} source={require('../../assets/icon_close.png')}></Image>
                        </TouchableWithoutFeedback>
                        <View style={styles.popTitle}><Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}>收件信息</Text></View>

                        <View style={{ margin: 10, justifyContent: 'center', flexDirection: 'row' }}>
                            <Text style={{ color: '#993333', fontSize: 12 }}><Text style={{ fontWeight: 'bold' }}>{gift.name}</Text>将发至此人</Text>
                        </View>
                        <View style={styles.search}>
                            <Text style={styles.label}>
                                地址
                            </Text>
                            <TextInput style={styles.searchTxt} placeholder="输入快递地址" numberOfLines={1} maxLength={200} value={address} onChangeText={setAddress} />
                        </View>
                        <View style={styles.search}>
                            <Text style={styles.label}>
                                收件人
                            </Text>
                            <TextInput style={styles.searchTxt} placeholder="输入收件人" numberOfLines={1} maxLength={20} value={name} onChangeText={setName} />
                        </View>
                        <View style={styles.search}>
                            <Text style={styles.label}>
                                电话
                            </Text>
                            <TextInput style={styles.searchTxt} placeholder="输入收件人手机号" numberOfLines={1} maxLength={20} value={phone} onChangeText={setPhone} />
                        </View>

                        <TouchableWithoutFeedback onPress={save}>
                            <View style={styles.btn}>
                                <Text style={styles.btnTxt}>保存</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            )}
        </View>
    );
};

export default Gift;

const styles = StyleSheet.create({
    row: {
        paddingTop: 0,
        flexDirection: 'column',
        flex: 1,

    },

    listContainer: {
        alignItems: 'center',
        flexDirection: 'column'
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
        flexDirection: 'row'
    },

    num: {
        color: '#FFCC33'
    },

    exchange: {
        borderRadius: 10,
        width: 100,
        height: 28,
        backgroundColor: '#FFFFCC',
        alignItems: 'center',
        justifyContent: 'center',

    },

    btnCharge: {
        fontSize: 14,
        color: '#003333', fontWeight: 'bold'
    },

    modalBg: {
        position: 'absolute',
        backgroundColor: '#00000033',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: '#FFFFFF',
        width: '80%',
        height: 330,
        borderRadius: 14,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 10,
        marginTop: 100,
    },

    popTitle: {
        backgroundColor: '#FF9933', borderRadius: 20, width: '70%', height: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10
    },
    tip: {
        color: '#FF6666',
        fontSize: 14
    },
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
        color: 'black'
    },

    btn: {

        marginHorizontal: 10,
        height: 26,
        borderRadius: 10,
        backgroundColor: '#CC0033',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        width: 100,
    },
    btnTxt: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    label: {
        color: 'black'
    }
});