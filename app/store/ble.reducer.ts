import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device, State, Subscription } from 'react-native-ble-plx';

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

const saveLastConnectedDevice = async (device) => {
    try {
        const jsonValue = JSON.stringify(device);
        await AsyncStorage.setItem('@lastConnectedDevice', jsonValue);
    } catch (e) {
        console.log('Failed to save last connected device.', e);
    }
};

const initialState = {
    bluetoothState: State.Unknown as State,
    lastConnectedDevice: null as Device | null,
};

const bleSlice = createSlice({
    name: 'ble',
    initialState,
    reducers: {
        stateChange: (state, action) => {
            state.bluetoothState = action.payload;
        },
        setLastConnectedDevice: (state, action) => {
            state.lastConnectedDevice = action.payload;
            saveLastConnectedDevice(action.payload);
        },
    },
});

let subscription: Subscription | null = null;

const monitorSubscription = () => {
    subscription = bleManager.onStateChange((state) => {
        console.log('Bluetooth state changed:', state);
        bleSlice.actions.stateChange(state);
    }, true);
};

const stopMonitoring = () => {
    if (subscription) {
        subscription.remove();
    }
};

const connectToDevice = (device) => {
    bleManager
        .connectToDevice(device.id)
        .then((connectedDevice) => {
            console.log('Connected to device:', connectedDevice.name);
            bleSlice.actions.setLastConnectedDevice(connectedDevice); // Update last connected device
            saveLastConnectedDevice(connectedDevice); // Save last connected device
            return connectedDevice.discoverAllServicesAndCharacteristics();
        })
        .then((discoveredDevice) => {
            console.log(
                'Discovered services and characteristics:',
                discoveredDevice
            );
            // Perform pairing or other interactions here
            // pairWithDevice(discoveredDevice);
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
            bleSlice.actions.setLastConnectedDevice(connectedDevice); // Update last connected device
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

const loadLastConnectedDevice = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@lastConnectedDevice');
        if (jsonValue != null) {
            const device = JSON.parse(jsonValue);
            bleSlice.actions.setLastConnectedDevice(device);
            reconnectToDevice(device);
        }
    } catch (e) {
        console.log('Failed to load last connected device.', e);
    }
};

const initBluetooth = () => {
    requestPermissions();
    monitorSubscription();
    loadLastConnectedDevice();
};

const deinitBluetooth = () => {
    stopMonitoring();
};

export {
    bleManager,
    subscription,
    connectToDevice,
    monitorSubscription,
    initBluetooth,
    deinitBluetooth,
};
export default bleSlice.reducer;
