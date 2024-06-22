import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    PermissionsAndroid,
    Platform,
    Alert,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Button,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

const requestPermissions = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);
            if (
                granted['android.permission.ACCESS_FINE_LOCATION'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_SCAN'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_CONNECT'] ===
                    PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.log('All permissions granted');
            } else {
                console.log('Some permissions denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
};

const Settings = () => {
    const [devices, setDevices] = useState([]);
    const [lastConnectedDevice, setLastConnectedDevice] = useState(null);
    const [bluetoothState, setBluetoothState] = useState(null);

    useEffect(() => {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            requestPermissions();
        }

        const subscription = bleManager.onStateChange((state) => {
            setBluetoothState(state);
            if (state === 'PoweredOn') {
                scanAndDisplayDevices();
                loadLastConnectedDevice();
            } else if (state === 'PoweredOff') {
                Alert.alert(
                    'Bluetooth is off',
                    'Please enable Bluetooth to scan for devices.'
                );
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
        setDevices([]); // Clear the current list of devices

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

    const loadLastConnectedDevice = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(
                '@lastConnectedDevice'
            );
            if (jsonValue != null) {
                const device = JSON.parse(jsonValue);
                setLastConnectedDevice(device);
                reconnectToDevice(device);
            }
        } catch (e) {
            console.log('Failed to load last connected device.', e);
        }
    };

    const saveLastConnectedDevice = async (device) => {
        try {
            const jsonValue = JSON.stringify(device);
            await AsyncStorage.setItem('@lastConnectedDevice', jsonValue);
        } catch (e) {
            console.log('Failed to save last connected device.', e);
        }
    };

    const handleRescan = () => {
        bleManager.stopDeviceScan(); // Stop current scan
        scanAndDisplayDevices(); // Start a new scan
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
        bleManager
            .connectToDevice(device.id)
            .then((connectedDevice) => {
                console.log('Connected to device:', connectedDevice.name);
                setLastConnectedDevice(connectedDevice); // Update last connected device
                saveLastConnectedDevice(connectedDevice); // Save last connected device
                return connectedDevice.discoverAllServicesAndCharacteristics();
            })
            .then((discoveredDevice) => {
                console.log(
                    'Discovered services and characteristics:',
                    discoveredDevice
                );
                // Perform pairing or other interactions here
                pairWithDevice(discoveredDevice);
            })
            .catch((error) => {
                console.log('Connection error:', error);
            });
    };

    const reconnectToDevice = (device) => {
        bleManager
            .connectToDevice(device.id)
            .then((connectedDevice) => {
                console.log('Reconnected to device:', connectedDevice.name);
                setLastConnectedDevice(connectedDevice); // Update last connected device
                return connectedDevice.discoverAllServicesAndCharacteristics();
            })
            .then((discoveredDevice) => {
                console.log(
                    'Discovered services and characteristics:',
                    discoveredDevice
                );
                // Perform pairing or other interactions here
                pairWithDevice(discoveredDevice);
            })
            .catch((error) => {
                console.log('Reconnection error:', error);
            });
    };

    const pairWithDevice = (device) => {
        // Assuming pairing involves writing to a specific characteristic
        const serviceUUID = 'your-service-uuid';
        const characteristicUUID = 'your-characteristic-uuid';
        const pairingValue = 'your-pairing-value'; // This could be a string, buffer, etc., depending on the device's requirements

        device
            .writeCharacteristicWithResponseForService(
                serviceUUID,
                characteristicUUID,
                pairingValue
            )
            .then((characteristic) => {
                console.log('Pairing successful', characteristic);
                // Handle successful pairing
            })
            .catch((error) => {
                console.log('Pairing error', error);
            });
    };

    return (
        <View
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>Nastaveni</Text>
            <Text>Bluetooth State: {bluetoothState}</Text>
            <Button title="Rescan" onPress={handleRescan} />
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.deviceList}
            />
            {lastConnectedDevice && (
                <View style={styles.lastDeviceContainer}>
                    <Text style={styles.lastDeviceTitle}>
                        Last Connected Device:
                    </Text>
                    <Text style={styles.lastDeviceName}>
                        {lastConnectedDevice.name}
                    </Text>
                    <Text style={styles.lastDeviceId}>
                        {lastConnectedDevice.id}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    deviceList: {
        padding: 20,
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
