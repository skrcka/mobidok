import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import Images from '../../assets/index';
import Header from '../components/header';

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    highlightedIcon: {
        borderStyle: 'dashed',
        borderWidth: 2,
        borderRadius: 15,
        borderColor: '#007aff',
    },
    backgroundCircle: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        width: 40,
        height: 40,
        borderRadius: 24,
    },
});

const tabBarIcon = (iconSource, focused) => (
    <View
        style={[styles.iconContainer, focused ? styles.highlightedIcon : null]}>
        <View style={[styles.backgroundCircle]}>
            <SvgXml color="#007aff" xml={iconSource} width="70%" height="70%" />
        </View>
    </View>
);

const TabsLayout = () => {
    return (
        <Tabs initialRouteName="HomePage">
            <Tabs.Screen
                name="HomePage"
                options={{
                    tabBarShowLabel: false,
                    headerShown: true,
                    header: () => <Header />,
                    tabBarIcon: ({ focused }) =>
                        tabBarIcon(Images.svgs.home.source, focused),
                }}
            />
            <Tabs.Screen
                name="OfflineMode"
                options={{
                    tabBarShowLabel: false,
                    headerShown: true,
                    header: () => <Header />,
                    tabBarIcon: ({ focused }) =>
                        tabBarIcon(Images.svgs.document.source, focused),
                }}
            />
            <Tabs.Screen
                name="Settings"
                options={{
                    tabBarShowLabel: false,
                    headerShown: true,
                    header: () => <Header />,
                    tabBarIcon: ({ focused }) =>
                        tabBarIcon(Images.svgs.gear.source, focused),
                    unmountOnBlur: true,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
