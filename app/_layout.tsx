import 'react-native-reanimated';
import { Stack } from 'expo-router/stack';
import React, { useEffect, useMemo } from 'react';
import {
    StyleSheet,
    Animated,
    Easing,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';

import Sidebar from './components/SideBar';
import { closeSidebar } from './store/sidebar.reducer';
import store from './store/store';
import { AuthProvider } from '../context/AuthProvider';

const App = () => {
    const dispatch = useDispatch();
    const isSidebarOpen = useSelector(
        (state: any) => state.sidebar.isSidebarOpen
    );
    const sidebarTranslation = useMemo(
        () => new Animated.Value(isSidebarOpen ? 0 : -250),
        [isSidebarOpen]
    );

    const handleCloseSidebar = () => {
        dispatch(closeSidebar());
    };

    useEffect(() => {
        Animated.timing(sidebarTranslation, {
            toValue: isSidebarOpen ? 0 : -250,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, [isSidebarOpen, sidebarTranslation]);
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
            {isSidebarOpen && (
                <TouchableWithoutFeedback onPress={handleCloseSidebar}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            {isSidebarOpen && (
                <Animated.View style={[styles.animatedSidebar]}>
                    <Sidebar />
                </Animated.View>
            )}
        </>
    );
};

const AppLayout = () => {
    return (
        <Provider store={store}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Provider>
    );
};

const styles = StyleSheet.create({
    animatedSidebar: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: '80%',
        backgroundColor: 'white',
        zIndex: 1000, // Ensure it's on top
        padding: 10,
    },
    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent
        zIndex: 500, // Behind sidebar, but above main content
    },
});

export default AppLayout;
