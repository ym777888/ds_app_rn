import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Animated, Easing,Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Marquee = ({ items }) => {
    const scrollX = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        const loop = () => {
            Animated.timing(scrollX, {
                toValue: -1 * width, // 设置滚动的终点位置，从右侧到左侧
                duration: 15000, // 设置滚动的时间
                easing: Easing.linear, // 设置滚动的速度曲线
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    scrollX.setValue(width); // 重置滚动的起点位置，从右侧重新开始滚动
                    loop(); // 循环调用，实现连续滚动
                }
            });
        };

        loop(); // 开始滚动
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.scrollContainer,
                    {
                        transform: [
                            {
                                translateX: scrollX, // 根据 scrollX 值进行水平位移
                            },
                        ],
                    },
                ]}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={1000}
                    decelerationRate="fast"
                    contentContainerStyle={styles.scrollViewContent}
                >
                    {Array.isArray(items) ? (
                        // 如果 items 是数组，遍历并显示数组中的元素
                        items.map((item, index) => (
                            <Text key={index} style={styles.itemText}>{item}</Text>
                        ))
                    ) : (
                        // 如果 items 是字符串，直接显示
                        <Text style={styles.itemText}>{items}</Text>
                    )}
                </ScrollView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 24, // 设置容器的高度，用于显示文本
        overflow: 'hidden', // 隐藏超出容器的内容
    },
    scrollContainer: {
        flexDirection: 'row', // 设置为水平布局
        alignItems: 'center', // 垂直居中显示文本
    },
    scrollViewContent: {
        flexGrow: 1, // 设置内容视图的增长方式为填充剩余空间
    },
    itemText: {
        paddingHorizontal: 20, // 设置左右边距，增加间距感
        fontSize: 14, // 设置文本大小
        color: '#993333',
    },
});

export default Marquee;
