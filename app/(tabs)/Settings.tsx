import * as Application from 'expo-application';
import { View, Text, StyleSheet } from 'react-native';

import BluetoothSettings from '../components/bluetoothSetting';

const Settings = () => {
    return (
        <>
            <View style={styles.settingsContainer}>
                <BluetoothSettings />
            </View>
            <View style={styles.copyrightContainer}>
                <Text style={styles.copyrightText}>
                    v{Application.nativeApplicationVersion} (
                    {Application.nativeBuildVersion}) - Copyright @ BMI SYSTEM
                    s.r.o. 2023
                </Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
    },
    copyrightContainer: {
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
    },
    copyrightText: {
        fontSize: 11,
    },
    lastDeviceContainer: {
        marginTop: 20,
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    lastDeviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lastDeviceName: {
        fontSize: 16,
    },
    lastDeviceId: {
        fontSize: 12,
        color: '#666',
    },
});

export default Settings;
