import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Button,
} from 'react-native';
import { useSelector } from 'react-redux';

import { bleManager, connectToDevice } from '../store/ble.reducer';
import { RootState } from '../store/store';

const Settings = () => {
    const [devices, setDevices] = useState([]);
    const bluetoothState = useSelector(
        (state: RootState) => state.ble.bluetoothState
    );
    const lastConnectedDevice = useSelector(
        (state: RootState) => state.ble.lastConnectedDevice
    );

    useEffect(() => {
        scanAndDisplayDevices();

        return () => {
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

    const handleRescan = () => {
        bleManager.stopDeviceScan();
        scanAndDisplayDevices();
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
