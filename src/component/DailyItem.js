import React from 'react';
import moment from 'moment';
import { GlobalStyle } from '../common/GlobalStyle';
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View, Image, ImageBackground } from 'react-native';
const { width } = Dimensions.get('window');

const DailyItem = ({ data = {}, nav = {}, index }) => {
    const styles = index === 0 ? styles1 : styles2;
    return (
        <TouchableWithoutFeedback onPress={() => { nav.navigate('Player', { data: data }) }}>
            <View style={styles.listItem}>
                <View style={styles.box}>
                    <Image style={styles.img} source={require('../../assets/loading.png')}></Image>
                    <Text numberOfLines={1}>英冠大结局！莱斯特城成功夺冠，升班马神奇2连跳</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles1 = StyleSheet.create({
    listItem: {
        flexDirection: 'column',
        backgroundColor: GlobalStyle.white,
        paddingBottom: GlobalStyle.navMarginLeft,
        marginBottom: GlobalStyle.marginLeft,
        marginTop: 5,
    },
    box: {
        // Style for the first data item
    },
    img: {

    }
});

const styles2 = StyleSheet.create({
    listItem: {
        flexDirection: 'column',
        backgroundColor: GlobalStyle.white,
        borderRadius: 3,
        paddingBottom: GlobalStyle.navMarginLeft,
        marginBottom: GlobalStyle.marginLeft,
        marginTop: 5,
        width: width * 0.5,
    },
    box: {
        // Style for the rest of the data items
    },
    img: {
        width: width * 0.5,
        height: width * 0.5 * 0.618,
    }
});

export default React.memo(DailyItem);
