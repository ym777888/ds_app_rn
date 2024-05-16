import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { GlobalStyle } from '../common/GlobalStyle';

const { width } = Dimensions.get('window');

const Profile = () => {
    return (
        <View style={styles.topBox}>
            <View style={styles.row}>
                <View style={styles.avatar}>
                    <Image tintColor={'#EEEEEE'} resizeMode='contain' style={{ height: 50, width: 50, borderRadius: 90 }} source={require('../../assets/icon_profile.png')} ></Image>
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                    <Text style={styles.name}>游客</Text>
                    <Text style={styles.name}>账号</Text>
                </View>
                <View style={{ backgroundColor: '#EEEEEE', width: 100, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                    <Text style={{ color: '#000000' }}>注册 | 登录</Text>
                </View>
            </View>
            <View style={[styles.row,{justifyContent: 'center',marginVertical: 20}]}>
                <View style={styles.item}>
                    <Text style={styles.itemNum}>9999</Text>
                    <Text style={styles.itemLabel}>金币</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemNum}>9999</Text>
                    <Text style={styles.itemLabel}>消息</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemNum}>9999</Text>
                    <Text style={styles.itemLabel}>关注</Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.itemNum}>9999</Text>
                    <Text style={styles.itemLabel}>粉丝</Text>
                </View>
            </View>
            <View style={styles.row2}>
                <View style={styles.btn}>
                    <Image style={styles.btnImg} source={require('../../assets/icon_diamond3.png')}></Image>
                    <View style={styles.btnTitle}>
                        <Text style={styles.bigTitle}>钻石余额</Text>
                        <Text style={styles.subTitle}>9999</Text>
                    </View>
                    <Image tintColor='#FF9933' style={styles.btnArrow} source={require('../../assets/icon_arrow.png')}></Image>
                </View>
                <View style={styles.btn}>
                    <Image style={styles.btnImg} source={require('../../assets/icon_vip2.png')}></Image>
                    <View style={styles.btnTitle}>
                        <Text style={styles.bigTitle}>VIP有效期</Text>
                        <Text style={styles.subTitle}>9999</Text>
                    </View>
                    <Image tintColor='#FF9933' style={styles.btnArrow} source={require('../../assets/icon_arrow.png')}></Image>
                </View>
            </View>
            <View style={styles.col}>
                <View style={styles.tabTitle}><Text style={styles.tabTitleTxt}>账户中心</Text></View>
                <View style={styles.row}>
                    <TouchableWithoutFeedback>
                        <View style={styles.btn2}>
                            <Image style={styles.btn2Img} source={require('../../assets/icon_jewelry.png')}></Image>
                            <Text style={styles.btn2Title}>充值</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.btn2}>
                            <Image style={styles.btn2Img} source={require('../../assets/icon_payment.png')}></Image>
                            <Text style={styles.btn2Title}>转账</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.btn2}>
                            <Image style={styles.btn2Img} source={require('../../assets/icon_statistics.png')}></Image>
                            <Text style={styles.btn2Title}>流水</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback>
                        <View style={styles.btn2}>
                            <Image style={styles.btn2Img} source={require('../../assets/icon_user.png')}></Image>
                            <Text style={styles.btn2Title}>客服</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </View>
            <View style={styles.col}>
                <View style={styles.tabTitle}><Text style={styles.tabTitleTxt}>视频管理</Text></View>
                <View style={styles.row}>
                    <TouchableWithoutFeedback>
                        <View style={styles.btn2}>
                            <Image style={styles.btn3Img} source={require('../../assets/icon_cart.png')}></Image>
                            <Text style={styles.btn2Title}>已购</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.btn2}>
                            <Image style={styles.btn3Img} source={require('../../assets/icon_heart.png')}></Image>
                            <Text style={styles.btn2Title}>点赞</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.btn2}>
                            <Image style={styles.btn3Img} source={require('../../assets/icon_star.png')}></Image>
                            <Text style={styles.btn2Title}>收藏</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.btn2}>
                            <Image style={styles.btn3Img} source={require('../../assets/icon_history.png')}></Image>
                            <Text style={styles.btn2Title}>历史</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    topBox: {
        flexDirection: 'column',
        backgroundColor: GlobalStyle.sysBg(),
        flex: 1,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFCC',
        width: width * 0.5 - 30,
        height: 50,
        justifyContent: 'space-between',
        borderRadius: 10
    },
    btnImg: {
        width: 26,
        height: 26,
        marginHorizontal: 15
    },
    btnTitle: {
        flex: 1
    },
    btnArrow: {
        width: 30,
        height: 30
    },
    bigTitle: {
        fontSize: 12,
        color: '#000000'
    },
    subTitle: {
        fontSize: 14,
        color: '#000000'
    },
    row: {
        margin: GlobalStyle.marginTop,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    row2: {
        margin: GlobalStyle.marginTop,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#CCFFFF',
        padding: GlobalStyle.marginTop,
        borderRadius: 10
    },
    col: {
        margin: GlobalStyle.marginTop,
        flexDirection: 'column',
        padding: GlobalStyle.marginTop,
        borderRadius: 10,

    },
    name: {
        fontSize: 14,
        color: GlobalStyle.sysFont(),
        marginVertical: 2
    },
    avatar: {
        backgroundColor: '#CCCCCC', borderRadius: 90, height: 50, width: 50, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10
    },
    btn2: {
        width: 60,
        height: 60,
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    btn2Img: {
        width: 40,
        height: 40,
    },
    btn3Img: {
        width: 30,
        height: 30,
    },
    btn2Title: {
        fontSize: 14,
        color: GlobalStyle.sysFont(),
        marginTop: 8
    },
    tabTitle: {
        marginVertical: GlobalStyle.marginTop
    },
    tabTitleTxt: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black'
    },
    item: {
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 30
    },
    itemNum: {
        fontSize: 14,

        color: 'black'
    },
    itemLabel: {
        fontSize: 12,
        color: '#AAAAAA'
    }
})
export default Profile;
