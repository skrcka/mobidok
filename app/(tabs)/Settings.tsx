import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    PermissionsAndroid,
    Platform,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
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
                console.log('Location permission granted');
            } else {
                console.log('Location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
};

const Settings = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            requestLocationPermission();
        }

        const subscription = bleManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                scanAndDisplayDevices();
            }
        }, true);

        return () => {
            subscription.remove();
            bleManager.stopDeviceScan();
            bleManager.destroy();
        };
    }, []);

    const scanAndDisplayDevices = () => {
        const discoveredDevices = new Map();

        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }

            if (device && !discoveredDevices.has(device.id)) {
                discoveredDevices.set(device.id, device);
                setDevices(Array.from(discoveredDevices.values()));
            }
        });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => connectToDevice(item)}>
            <Text style={styles.deviceName}>
                {item.name ? item.name : 'Unnamed Device'}
            </Text>
            <Text style={styles.deviceId}>{item.id}</Text>
        </TouchableOpacity>
    );

    const connectToDevice = (device) => {
        console.log('Connecting to device:', device.name);
        bleManager
            .connectToDevice(device.id)
            .then((device) => {
                console.log('Connected to device:', device.name);
                return device.discoverAllServicesAndCharacteristics();
            })
            .then((device) => {
                console.log('Discovered services and characteristics:', device);
                // You can now interact with the device
            })
            .catch((error) => {
                console.log('Connection error:', error);
                console.log('Connection error:', error.message);
            });
    };

    return (
        <View>
            <Text style={styles.deviceHeader}>
                Dostupná bluetooth zařízení:
            </Text>
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.deviceList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    deviceHeader: {
        paddingLeft: 20,
        paddingBottom: 10,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    deviceList: {
        padding: 20,
        width: '100%',
    },
    deviceItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deviceId: {
        fontSize: 12,
        color: '#666',
    },
});

export default Settings;
