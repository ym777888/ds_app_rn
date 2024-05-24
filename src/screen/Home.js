import React, { useState, useEffect } from "react";
import { Image, View, Text, StyleSheet, TextInput, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute, useNavigation } from '@react-navigation/native';

import { GlobalStyle } from "../common/GlobalStyle";
import { RNStorage } from "../common/RNStorage";
import HttpUtil, { BASE_URL } from "../common/HttpUtil";
import Util from "../common/Util";
import Settings from "./Settings";
import Index from "./Index";
import Clip from "./Clip";
import Game from "./Game";
import Book from "./Book";
import Profile from "./Profile";
import Splash from "./Splash";
import VIP from "./VIP";
import Novel from "./Novel";
import Category from "./Category";
import Player from "./Player";
import Marquee from "../component/Marquee";
import ClipList from "./ClipList";
import Login from "./Login";
import BuyDiamond from "./BuyDiamond";
import BuyVip from "./BuyVip";
import History from "./History";
import Water from "./Water";
import Transfer from "./Transfer";
import Fav from "./Fav";
import Chat from "./Chat";
import Search from "./Search";
import Password from "./Password";
import Address from "./Address";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

function loadSiteInfo() {
    const [isGame, setIsGame] = useState(false);
    const [isVIP, setIsVIP] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);


    useEffect(() => {
        HttpUtil.postFetch(
            BASE_URL + Util.SITE_INFO,
            {},
            (msg, data) => {
                setIsGame(data.isGame);
                setIsVIP(data.isVIP);
                setDataFetched(true);
                RNStorage.info = data;
            },
            (msg) => { },
            true
        );

    }, []);

    return { isGame, isVIP, dataFetched };
}


function MyTopTabs() {

    const navigation = useNavigation();

    const openChat = () => {
        navigation.navigate('Chat');
    };

    const gotoSearch = () => {
        navigation.navigate('Search');
    };

    return (
        <>
            <View style={styles.topBox}>
                <View style={styles.row}>
                    <View style={styles.logoBox}>
                        <View style={styles.logo}>
                            <Image style={{ width: 28, height: 28, borderRadius: 5 }} source={require('../../assets/app_icon.png')} ></Image>
                        </View>
                        <View style={styles.title}>
                            <Text style={styles.small}>{RNStorage.info?.appName}</Text>
                            <Text style={styles.small} numberOfLines={1}> {RNStorage.info?.appSite}</Text>
                        </View>
                    </View>
                    <View style={styles.search}>
                        <Image source={require('../../assets/icon_search.png')} style={{ width: 24, height: 24, borderRadius: 5 }} tintColor="#cccccc" />
                        <TextInput style={styles.searchTxt} placeholder="搜索国产、日韩..." numberOfLines={1} onFocus={gotoSearch} />
                    </View>
                    <View style={styles.chat}>
                        <View style={styles.quick}>
                            <Image style={styles.quickBg} source={require('../../assets/icon_mail.png')} tintColor="#aaaaaa"></Image>
                        </View>
                        <TouchableWithoutFeedback onPress={openChat}>
                            <View style={styles.quick}>

                                <ImageBackground style={styles.quickBg} source={require('../../assets/icon_pencil.png')} tintColor="#aaaaaa">
                                    <Text style={styles.quickTxt}>客服</Text>
                                </ImageBackground>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

                <View style={styles.marquee}>
                    <View style={{ width: 24, flexDirection: 'column', justifyContent: 'center' }}>
                        <Image source={require('../../assets/icon_speaker.png')} style={{ width: 18, height: 18, borderRadius: 0, }} tintColor="#FF9900" />
                    </View>

                    <View style={styles.marqueeItem}>
                        <Marquee items={RNStorage.info?.appMarquee} />
                    </View>
                </View>

            </View>
            <TopTab.Navigator
                initialRouteName="Recom"
                screenOptions={{
                    tabBarActiveTintColor: GlobalStyle.sysFont(),
                    tabBarLabelStyle: { fontSize: 16, },
                    tabBarStyle: { backgroundColor: GlobalStyle.sysBg(), elevation: 0, },
                    tabBarIndicatorStyle: { backgroundColor: 'red', },
                }}
            >
                <Tab.Screen name="Recom" component={Index} options={{ tabBarLabel: '推荐' }} />
                <Tab.Screen name="China" component={ClipList} options={{ tabBarLabel: '国产' }} initialParams={{ category: '国产' }} />
                <Tab.Screen name="Japan" component={ClipList} options={{ tabBarLabel: '日韩' }} initialParams={{ category: '日韩' }} />
                <Tab.Screen name="Europe" component={ClipList} options={{ tabBarLabel: '欧美' }} initialParams={{ category: '欧美' }} />
                <Tab.Screen name="Category" component={Category} options={{ tabBarLabel: '全部' }} />
            </TopTab.Navigator>
        </>
    );
}

//用户路由
function ProfileStack() {

    return (

        <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: 'white',
                headerStyle: { backgroundColor: 'white' },
                headerShown: false, // 隐藏顶部标题
            }}
        >
            <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                    title: 'Profile',
                }}
            />

            <Stack.Screen
                name="History"
                component={History}
                options={{
                    title: 'History',
                }}
            />

            <Stack.Screen
                name="Water"
                component={Water}
                options={{
                    title: 'Water',
                }}
            />

            <Stack.Screen
                name="Transfer"
                component={Transfer}
                options={{
                    title: 'Transfer',
                }}
            />

            <Stack.Screen
                name="Fav"
                component={Fav}
                options={{
                    title: 'Fav',
                }}
            />

            <Stack.Screen
                name="Password"
                component={Password}
                options={{
                    title: 'Password',
                }}
            />


            <Stack.Screen
                name="Address"
                component={Address}
                options={{
                    title: 'Address',
                }}
            />

        </Stack.Navigator>

    );
}

//底部tab
function MyTabs() {

    const { isGame, isVIP, dataFetched } = loadSiteInfo();
    return (
        <Tab.Navigator
            initialRouteName="Index"
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                headerShown: false, // 隐藏顶部标题
                tabBarLabelStyle: { fontSize: 14, height: 22 }, // 调整字体大小
                tabBarStyle: { height: 50 }
            }}
        >
            <Tab.Screen
                name="Index"
                component={MyTopTabs}
                options={{
                    tabBarLabel: '首页',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('../../assets/icon_home.png')} // 替换为您的图片路径
                            style={{ tintColor: color, width: size, height: size }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Category"
                component={Category}
                options={{
                    tabBarLabel: '选片',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('../../assets/icon_novel.png')} // 替换为您的图片路径
                            style={{ tintColor: color, width: size, height: size }}
                        />
                    )
                }}
            />
            {isVIP && (
                <Tab.Screen
                    name="VIP"
                    component={VIP}
                    options={{
                        tabBarLabel: 'VIP',
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={require('../../assets/icon_vip.png')} // 替换为您的图片路径
                                style={{ tintColor: color, width: size, height: size }}
                            />
                        ),
                    }}
                />
            )}
            {isGame && (
                <Tab.Screen
                    name="Game"
                    component={Game}
                    options={{
                        tabBarLabel: '游戏',
                        tabBarIcon: ({ color, size }) => (
                            <Image
                                source={require('../../assets/icon_game.png')} // 替换为您的图片路径
                                style={{ tintColor: color, width: size, height: size }}
                            />
                        ),
                    }}
                />
            )}

            <Tab.Screen
                name="ProfileStack"
                component={ProfileStack}
                options={{
                    tabBarLabel: '我的',
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('../../assets/icon_profile.png')} // 替换为您的图片路径
                            style={{ tintColor: color, width: size, height: size }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

//全局路由
function MyStack() {

    return (

        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: 'white',
                headerStyle: { backgroundColor: 'tomato' },
                headerShown: false, // 隐藏顶部标题
            }}
        >
            <Stack.Screen
                name="Splash"
                component={Splash}
                options={{
                    title: 'Splash',
                }}
            />
            <Stack.Screen
                name="MyTabs"
                component={MyTabs}
                options={{
                    gestureEnabled: false,
                }}
            />
            <Stack.Screen
                name="Player"
                component={Player}
                options={{
                    title: 'Player',
                }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    title: 'Login',
                }}
            />
            <Stack.Screen
                name="BuyDiamond"
                component={BuyDiamond}
                options={{
                    title: 'BuyDiamond',
                }}
            />
            <Stack.Screen
                name="BuyVip"
                component={BuyVip}
                options={{
                    title: 'BuyVip',
                }}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={{
                    title: 'Chat',
                }}
            />
            <Stack.Screen
                name="Search"
                component={Search}
                options={{
                    title: 'Search',
                }}
            />
        </Stack.Navigator>

    );
}




const styles = StyleSheet.create({
    topBox: {
        flexDirection: 'column',
        backgroundColor: GlobalStyle.sysBg(),
    },
    logoBox: {
        flexDirection: 'row',
        width: 100,
        overflow: 'hidden'
    },
    logo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    row: {
        flexDirection: 'row'
    },
    search: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        marginHorizontal: 10,
    },
    searchTxt: {
        flex: 1,
        height: 30,
        lineHeight: 30,

        marginLeft: 5,
        padding: 0,

    },
    chat: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    small: {
        fontSize: 12, fontWeight: 'bold', color: '#000000'
    },
    title: {

    },
    quick: {
        marginHorizontal: 5,
        flexDirection: 'row',

    },
    quickBg: {
        width: 30,
        height: 30,
        justifyContent: 'flex-end'
    },
    quickTxt: {
        backgroundColor: '#FF000088',
        color: '#ffffff',
        textAlign: 'center',
        borderRadius: 5,
        fontSize: 12,
    },
    marquee: {
        flexDirection: 'row',
        marginHorizontal: 5,
        marginTop: 10,
    },
    marqueeItem: {
        flex: 1,
        height: 22,
    }
});



export default MyStack;