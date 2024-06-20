import { Tabs } from 'expo-router';
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

import Images from '../../assets/index';
import Header from '../components/header';

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    elevatedIcon: {
        top: -20,
    },
    backgroundCircle: {
        backgroundColor: 'lightblue',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        width: 48,
        height: 48,
        borderRadius: 24,
    },
});

const tabBarIcon = (iconSource, focused) => (
    <View style={[styles.iconContainer, focused ? styles.elevatedIcon : null]}>
        <View style={[styles.backgroundCircle]}>
            <SvgXml xml={iconSource} width="70%" height="70%" />
        </View>
    </View>
);

const TabsLayout = () => (
    <Tabs
        screenOptions={{ tabBarActiveTintColor: 'blue' }}
        initialRouteName="DashBoardPage">
        <Tabs.Screen
            name="DashBoardPage"
            options={{
                tabBarShowLabel: false,
                headerShown: true,
                header: () => <Header />,
                tabBarIcon: ({ focused }) =>
                    tabBarIcon(Images.svgs.dashboard.source, focused),
            }}
        />
        <Tabs.Screen
            name="Messages"
            options={{
                tabBarShowLabel: false,
                headerShown: true,
                header: () => <Header />,
                tabBarIcon: ({ focused }) =>
                    tabBarIcon(Images.svgs.messages.source, focused),
            }}
        />
        <Tabs.Screen
            name="Courses"
            options={{
                tabBarShowLabel: false,
                headerShown: true,
                header: () => <Header />,
                tabBarIcon: ({ focused }) =>
                    tabBarIcon(Images.svgs.triangle.source, focused),
            }}
        />
        <Tabs.Screen
            name="ProfilePage"
            options={{
                tabBarShowLabel: false,
                headerShown: true,
                header: () => <Header />,
                tabBarIcon: ({ focused }) =>
                    tabBarIcon(Images.svgs.profile.source, focused),
            }}
        />
    </Tabs>
);

export default TabsLayout;
