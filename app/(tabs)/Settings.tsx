import { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Button,
} from 'react-native';

import { useBleManager } from '../../context/BluetoothProvider';

const Settings = () => {
    const bleManager = useBleManager();

    useEffect(() => {
        bleManager.scanDevices();

        return () => {
            bleManager.stopDeviceScan();
        };
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => bleManager.connectToDevice(item)}>
            <Text style={styles.deviceName}>
                {item.name ? item.name : 'Unnamed Device'}
            </Text>
            <Text style={styles.deviceId}>{item.id}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <Text>Nastaveni</Text>
            <Text>Bluetooth State: {bleManager.state}</Text>
            <Button title="Rescan" onPress={bleManager.scanDevices} />
            <FlatList
                data={bleManager.availableDevices}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.deviceList}
            />
            {bleManager.lastConnectedDevice && (
                <View style={styles.lastDeviceContainer}>
                    <Text style={styles.lastDeviceTitle}>
                        Last Connected Device:
                    </Text>
                    <Text style={styles.lastDeviceName}>
                        {bleManager.lastConnectedDevice.name}
                    </Text>
                    <Text style={styles.lastDeviceId}>
                        {bleManager.lastConnectedDevice.id}
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
