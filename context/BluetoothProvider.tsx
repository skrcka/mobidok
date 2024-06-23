import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { BleManager, Device, State, Subscription } from 'react-native-ble-plx';

type BleType = {
    ble: BleManager;
    state: State;
    lastConnectedDevice: Device | null;
    connectedDevice: Device | null;
    availableDevices: Device[];
    connectToDevice: (device: Device) => void;
    scanDevices: () => void;
    stopDeviceScan: () => void;
    enableBluetooth: () => Promise<boolean>;
};

const BleManagerContext = createContext<BleType>({
    ble: new BleManager(),
    state: State.Unknown,
    lastConnectedDevice: null,
    connectedDevice: null,
    availableDevices: [],
    connectToDevice: (_: Device) => {},
    scanDevices: () => {},
    stopDeviceScan: () => {},
    enableBluetooth: async () => false,
});

const loadLastConnectedDevice = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@lastConnectedDevice');
        if (jsonValue != null) {
            const device = JSON.parse(jsonValue);
            return device;
        }
    } catch (e) {
        console.log('Failed to load last connected device.', e);
    }
    return null;
};

const saveLastConnectedDevice = async (device) => {
    try {
        const jsonValue = JSON.stringify(device);
        await AsyncStorage.setItem('@lastConnectedDevice', jsonValue);
    } catch (e) {
        console.log('Failed to save last connected device.', e);
    }
};

export const BleManagerProvider = ({ children }) => {
    const bleManager = useMemo(() => new BleManager(), []);
    const [state, setState] = useState(State.Unknown);
    const [lastConnectedDevice, setLastConnectedDevice] =
        useState<Device | null>(null);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [availableDevices, setAvailableDevices] = useState<Device[]>([]);

    useEffect(() => {
        const subscription: Subscription = bleManager.onStateChange((state) => {
            console.log('Bluetooth state changed:', state);
            setState(state);
        }, true);
        loadLastConnectedDevice().then((device) => {
            if (device) {
                setLastConnectedDevice(device);
                reconnectToDevice(device);
            }
        });

        return () => {
            subscription.remove();
            bleManager.stopDeviceScan();
        };
    }, []);

    useEffect(() => {
        setLastConnectedDevice(connectedDevice);
        saveLastConnectedDevice(connectedDevice);
    }, [connectedDevice]);

    const connectToDevice = (device) => {
        bleManager
            .connectToDevice(device.id)
            .then((connectedDevice) => {
                console.log('Connected to device:', connectedDevice.name);
                setLastConnectedDevice(connectedDevice);
                saveLastConnectedDevice(connectedDevice);
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
                console.log('Reconnection error:', error);
            });
    };

    const scanDevices = () => {
        bleManager.stopDeviceScan();
        const discoveredDevices = new Map();
        setAvailableDevices([]);

        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }

            if (device && !discoveredDevices.has(device.id)) {
                discoveredDevices.set(device.id, device);
                setAvailableDevices(Array.from(discoveredDevices.values()));
            }
        });
    };

    const stopDeviceScan = () => {
        bleManager.stopDeviceScan();
    };

    const enableBluetooth = async () => {
        try {
            await bleManager.enable();
            return true;
        } catch (error) {
            console.log('Failed to enable Bluetooth:', error);
            return false;
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

    return (
        <BleManagerContext.Provider
            value={{
                ble: bleManager,
                state,
                lastConnectedDevice,
                connectedDevice,
                availableDevices,
                connectToDevice,
                scanDevices,
                stopDeviceScan,
                enableBluetooth,
            }}>
            {children}
        </BleManagerContext.Provider>
    );
};

export const useBleManager = () => useContext(BleManagerContext);
