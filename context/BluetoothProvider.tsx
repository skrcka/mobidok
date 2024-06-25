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
    scanDevices: (namePrefix?: string) => void;
    stopDeviceScan: () => void;
    enableBluetooth: () => Promise<boolean>;
    reconnectToDevice: () => Promise<boolean>;
    writeToConnectedDevice: (
        service: string,
        characteristic: string,
        value: string
    ) => Promise<boolean>;
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
    reconnectToDevice: async () => false,
    writeToConnectedDevice: (_: string, __: string, ___: string) =>
        Promise.resolve(false),
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
            setLastConnectedDevice(device);
            if (device) {
                connectToDevice(device);
            }
        });

        return () => {
            subscription.remove();
            bleManager.stopDeviceScan();
        };
    }, []);

    useEffect(() => {
        setLastConnectedDevice(connectedDevice);
    }, [connectedDevice]);

    useEffect(() => {
        saveLastConnectedDevice(lastConnectedDevice);
    }, [lastConnectedDevice]);

    const connectToDevice = async (device: Device): Promise<boolean> => {
        const res = await bleManager
            .connectToDevice(device.id)
            .then((connectedDevice) => {
                console.log('Connected to device:', connectedDevice.name);
                return connectedDevice
                    .discoverAllServicesAndCharacteristics()
                    .then(() => {
                        setConnectedDevice(connectedDevice);
                        return true;
                    })
                    .catch((error) => {
                        console.log('Discovery error:', error);
                        return false;
                    });
            })
            .catch((error) => {
                console.log('Connection error:', error);
                return false;
            });
        return res;
    };

    const reconnectToDevice = async (): Promise<boolean> => {
        const res = await bleManager
            .connectToDevice(lastConnectedDevice.id)
            .then((connectedDevice) => {
                return connectedDevice
                    .discoverAllServicesAndCharacteristics()
                    .then(() => {
                        setConnectedDevice(connectedDevice);
                        return true;
                    })
                    .catch((error) => {
                        console.log('Discovery error:', error);
                        return false;
                    });
            })
            .catch((error) => {
                console.log('Reconnection error:', error);
                return false;
            });
        return res;
    };

    const scanDevices = (nameFilter?: string) => {
        bleManager.stopDeviceScan();
        const discoveredDevices = new Map();
        setAvailableDevices([]);

        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }

            if (device && !discoveredDevices.has(device.id)) {
                if (
                    (nameFilter && !device.name) ||
                    !device.name.includes(nameFilter)
                ) {
                    return;
                }
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

    const writeToConnectedDevice = async (
        service: string,
        characteristic: string,
        value: string
    ): Promise<boolean> => {
        if (!connectedDevice) {
            if (!lastConnectedDevice) {
                console.log('No device connected');
                return false;
            }
            const res = await reconnectToDevice();
            if (!res) {
                console.log('Reconnection failed');
                return false;
            }
        }

        const device = await connectedDevice.isConnected();
        if (!device) {
            const res = await reconnectToDevice();
            if (!res) {
                console.log('Reconnection failed');
                return false;
            }
        }

        const encodedText = btoa(value);
        const chunkSize = 300;
        try {
            for (let i = 0; i < encodedText.length; i += chunkSize) {
                const subStr = encodedText.substring(i, i + chunkSize);
                const retCharacteristic =
                    await connectedDevice.writeCharacteristicWithResponseForService(
                        service,
                        characteristic,
                        subStr
                    );
                if (!retCharacteristic) {
                    console.log('Write failed');
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.log('Writing error', error);
            return false;
        }
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
                reconnectToDevice,
                writeToConnectedDevice,
            }}>
            {children}
        </BleManagerContext.Provider>
    );
};

export const useBleManager = () => useContext(BleManagerContext);
