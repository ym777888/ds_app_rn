import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { GlobalStyle } from '../common/GlobalStyle';

const NavTitle = ({ nav = {}, title = null, rightTxt = null, rightAction = null }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Perform some side effect here
        setData("Some data");
    }, []);

    return (

        <View style={styles.navBox}>
            <TouchableWithoutFeedback onPress={() => { nav.goBack() }}>
                <Image source={require('../../assets/icon_back.png')} style={styles.back} tintColor="#888888" />
            </TouchableWithoutFeedback>
            {title ? (<Text style={styles.navTitle}>{title}</Text>) : (<Text></Text>)}
            <TouchableWithoutFeedback onPress={() => { if (rightAction) { rightAction() } }}>
                <View style={styles.right}>
                    {rightTxt ? (<Text style={styles.rightBtn}>{rightTxt}</Text>) : (<Text></Text>)}
                </View>
            </TouchableWithoutFeedback>
        </View>

    );
};

const styles = StyleSheet.create({
    navTitle: {
        fontSize: 16,
        color: GlobalStyle.sysFont,
        fontWeight: 'bold',
    },
    back: {
        width: 34,
        height: 34,
    },
    navBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    right: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightBtn: {
        fontSize: 14,
        color: '#777777'
    }
});

export default NavTitle;
