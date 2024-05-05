import React, { useState, useEffect } from "react";
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function loadSiteInfo() {
    const [isGame, setIsGame] = useState(false);
    const [isVIP, setIsVIP] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        console.log("Home useEffect");
        HttpUtil.postFetch(
            BASE_URL + Util.SITE_INFO,
            {},
            (msg, data) => {
                setIsGame(data.isGame);
                setIsVIP(data.isVIP);
                setDataFetched(true);
            },
            (msg) => { },
            true
        );

    }, []);

    return { isGame, isVIP, dataFetched };
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
                component={Index}
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
                    tabBarLabel: '分类',
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
                name="Profile"
                component={Profile}
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
        </Stack.Navigator>

    );
}






export default MyStack;