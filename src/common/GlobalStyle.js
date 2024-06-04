/** 公共样式表 **/
import React from 'react';
import { Platform, StatusBar, View, Text } from 'react-native'
import { RNStorage } from './RNStorage';
import { useTheme } from "../common/ThemeContext";


export const GlobalStyle = {
  nodataView: () => {
    return (<View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'gray' }}>暂无数据</Text></View>)
  },
  sysFont: () => {
    return RNStorage.isDark ? '#FFF' : '#000';
  },
  setBg: (isDark) => {
    return isDark ? '#000' : '#FFF';
  },
  setFont: (isDark) => {
    return isDark ? '#FFF' : '#000';
  },

  /** color **/
  // 常用颜色
  red: '#FF0000',
  orange: '#FFA500',
  lightOrange: '#ffdda0',
  yellow: '#FFFF00',
  green: '#00FF00',
  cyan: '#00FFFF',
  blue: '#0000FF',
  purple: '#800080',
  black: '#000',
  white: '#FFF',
  gray: '#808080',
  drakGray: '#A9A9A9',
  lightGray: '#D3D3D3',
  tomato: '#FF6347',
  PeachPuff: '#FFDAB9',
  clear: 'transparent',
  captcha: '#009966',

  /** 主题色 **/
  themeColor: '#e74c3c',
  // 默认灰色字体颜色
  textGrayColor: '#989898',
  // 默认黑色字体颜色
  textBlockColor: '#262626',
  // 默认背景颜色
  bgColor: '#fafafa',
  //亮背景
  lightBgColor: '#203146',
  // 默认分割线颜色
  lineColor: '#2f4765',
  // 默认placeholder颜色
  placeholderColor: '#eee',
  // borderColor
  borderColor: '#2f4765',
  listBorderColor: '#f2f2f2',
  // 导航title 颜色
  navTitleColor: '#FFFFFF',
  // 导航左item title color
  navLeftTitleColor: '#FFFFFF',
  // 导航右item title color
  navRightTitleColor: '#FFFFFF',
  navThemeColor: '#acacac',
  navActiveColor: '#feee67',
  iconGray: '#989898',
  iconBlack: '#262626',
  barBgColor: '#dedede',

  /** space **/
  // 上边距
  marginTop: 10,
  // 左边距
  marginLeft: 10,
  // 下边距
  marginBotton: 10,
  // 右边距
  marginRight: 10,
  // 内边距
  padding: 10,
  // 导航的leftItem的左间距
  navMarginLeft: 15,
  // 导航的rightItem的右间距
  navMarginRight: 15,

  /** width **/
  // 导航栏左右按钮image宽度
  navImageWidth: 25,
  // 边框线宽度
  borderWidth: 1,
  // 分割线高度
  lineWidth: 0.8,

  /** height **/
  // 导航栏的高度
  navHeight: Platform.OS === 'ios' ? 64 : 56,
  // 导航栏顶部的状态栏高度
  navStatusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  // 导航栏除掉状态栏的高度
  navContentHeight: Platform.OS === 'ios' ? 44 : 56,
  // tabBar的高度
  tabBar: 60,
  // 底部按钮高度
  bottonBtnHeight: 44,
  // 通用列表cell高度
  cellHeight: 44,
  // 导航栏左右按钮image高度
  navImageHeight: 25,
  listImageHeight: 20,

  /** font **/
  // 默认文字字体
  textFont: 14,

  title1: 20,
  // 默认按钮文字字体
  btnFont: 15,
  // 导航title字体
  navTitleFont: 17,
  // tabBar文字字体
  barBarTitleFont: 12,
  // 占位符的默认字体大小
  placeholderFont: 13,
  // 导航左按钮的字体
  navRightTitleFont: 15,
  // 导航右按钮字体
  navLeftTitleFont: 15,

  /** opacity **/
  // mask
  modalOpacity: 0.3,
  // touchableOpacity
  taOpacity: 0.1,

  /** 定位 **/
  absolute: 'absolute',

  /** flex **/
  around: 'space-around',
  between: 'space-between',
  center: 'center',
  row: 'row',

  /** list **/
  //列表item背景
  listBg: '#203146',
  priceRed: '#f15131',
  priceGreen: '#1fbf75',

  btnStyle: {
    backgroundColor: '#fcda5f',
    borderRadius: 30,
    textAlign: 'center',
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20
  },

  nodataBox: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  nodata: {
    color: '#66709b',
    alignSelf: 'center'
  },

  mainBox: {
    margin: 10,
    flexDirection: 'column',
    flex: 1,
  },
  mainBox2: {
    flexDirection: 'column',
    flex: 1,
  },
  rowBox: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  loadMore: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreTxt: {
    color: '#808080',
    justifyContent: 'center',
    textAlign: 'center'
  },
  modalBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalStyle: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalStyle2: {
    margin: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
    flexDirection: 'column',
  },
  indicatorTxt: {
    color: 'white',

  },
  nodata: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    flex: 1,
    backgroundColor: 'black'
  },
  androidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  androidSafeArea2: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  androidSafeArea3: {
    paddingTop: 0,
  },
  title1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: RNStorage.isDark ? '#FFFFFF' : '#000000',
    lineHeight: 24,
  },
  title2: {
    fontSize: 14,
    color: RNStorage.isDark ? '#FFFFFF' : '#000000',
    lineHeight: 22,
  }

}