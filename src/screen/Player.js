import React, { createRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video-bilibili';
import { GlobalStyle } from '../common/GlobalStyle';
import GridItem from '../component/GridItem';
import { RNStorage } from '../common/RNStorage';


const testData = [
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳1', thumb: '', price: 19 },
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳2', thumb: '', price: 19 },
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳3', thumb: '', price: 0 },
    { title: '1英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳4', thumb: '', price: 19 },
    // Add more sections as needed
];

const Player = () => {
    const playerRef = createRef();
    const route = useRoute();
    const navigation = useNavigation();
    const { data } = route.params; // 获取传递的数据

    const renderItem = ({ item, index }) => {
        return <GridItem data={item} nav={navigation} index={index} />
    };

    const HeaderComponent = () => (
        <View>
            <View style={styles.row}>
                <View style={{ width: 5, height: 20, backgroundColor: '#CC0033' }}></View>
                <Text numberOfLines={2} style={styles.title}>{data.title}</Text>
            </View>
            <View style={styles.row2}>
                <TouchableWithoutFeedback>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_heart.png')}></Image>
                        <Text style={styles.btnTitle}>点赞</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_star.png')}></Image>
                        <Text style={styles.btnTitle}>收藏</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_share.png')}></Image>
                        <Text style={styles.btnTitle}>分享</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_write.png')}></Image>
                        <Text style={styles.btnTitle}>退款</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.btn}>
                        <Image style={styles.btnImg} source={require('../../assets/icon_service.png')}></Image>
                        <Text style={styles.btnTitle}>客服</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.row}>
                <TouchableWithoutFeedback>
                    <View style={styles.btn1}><Text style={styles.btn1Title}>注册 | 登录</Text></View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.btn1}><Text style={styles.btn1Title}>充值</Text></View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => { navigation.goBack() }}>
                    <View style={styles.btn1}><Text style={styles.btn1Title}>返回</Text></View>
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.row}>
                <View style={{ width: 5, height: 20, backgroundColor: '#CC0033' }}></View>
                <Text style={styles.title}>为你推荐</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.topBox}>
            <Video
                ref={playerRef}
                styles={{ container: [{ }] }}
                source={{ uri: data.url1 }}
                poster={data.thumb}
                title={data.title}
                navigation={navigation}
            />
            <View style={styles.row}>
                <View style={styles.badge}>
                    <Image style={styles.coin} source={require('../../assets/icon_coin3.png')}></Image>
                    <Text style={styles.money}>{data.price}</Text>
                </View>
                <View style={styles.url}>
                    <Text style={styles.small}>永久网址：</Text>
                    <Text style={styles.small} numberOfLines={1}> {RNStorage.info?.appSite}</Text>
                </View>
            </View>

            <FlatList
                style={{ backgroundColor: GlobalStyle.sysBg() }}
                data={testData}
                renderItem={renderItem}
                ListHeaderComponent={<HeaderComponent />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
            />
        </View>
    );
}


const styles = StyleSheet.create({
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
        justifyContent: 'center'
    },
    btn1: {
        backgroundColor: '#993333',
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    btn1Title: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    },
    btn: {
        width: 60,
        height: 60,
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    btnImg: {
        width: 30,
        height: 30,
    },
    btnTitle: {
        fontSize: 14,
        color: GlobalStyle.sysFont()
    },
    topBox: {
        flexDirection: 'column',
        backgroundColor: GlobalStyle.sysBg(),
        flex: 1,
    },
    coin: {
        width: 14,
        height: 14,
    },
    money: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 16
    },
    free: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    badge: {
        width: 40,
        height: 16,
        backgroundColor: '#993333',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    url: {
        flexDirection: 'row'
    },
    title: {
        overflow: 'hidden', color: '#000000', fontSize: 14, flex: 1, marginHorizontal: 10, lineHeight: 22
    },
    small: {
        fontSize: 14,
        color: GlobalStyle.sysFont(),
        fontWeight: 'bold'
    }
})

export default Player;
