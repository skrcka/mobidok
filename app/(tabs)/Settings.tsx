import React, { useEffect } from 'react';
import { View, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message:
                    'This app needs access to your location for BLE scanning.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
        } else {
            console.log('Location permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
};

const Settings = () => {
    useEffect(() => {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            requestLocationPermission();
        }

        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }

            if (device) {
                console.log(device.name);
            }
        });

        return () => {
            bleManager.stopDeviceScan();
        };
    }, []);

    return (
        <View
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>Nastaveni</Text>
        </View>
    );
};

export default Settings;
