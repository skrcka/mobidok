import React, { createContext, useContext, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

const requestCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Camera Permission',
                message: 'App needs access to your camera',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Camera permission granted');
            return true;
        } else {
            console.log('Camera permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
};

const requestBluetoothPermissions = async () => {
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
                return true;
            } else {
                console.log('Some permissions denied');
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    }
};

enum PermissionStatus {
    Unknown = 'unknown',
    Granted = 'granted',
    Denied = 'denied',
}

type PermissionStatusType = {
    bluetoothStatus: PermissionStatus;
    cameraStatus: PermissionStatus;
};

const PermissionContext = createContext<PermissionStatusType>({
    bluetoothStatus: PermissionStatus.Unknown,
    cameraStatus: PermissionStatus.Unknown,
});

export const PermissionProvider = ({ children }) => {
    const [bluetoothStatus, setBluetoothStatus] = React.useState(
        PermissionStatus.Unknown
    );
    const [cameraStatus, setCameraStatus] = React.useState(
        PermissionStatus.Unknown
    );

    useEffect(() => {
        requestBluetoothPermissions().then((granted) => {
            setBluetoothStatus(
                granted ? PermissionStatus.Granted : PermissionStatus.Denied
            );
        });
        requestCameraPermission().then((granted) => {
            setCameraStatus(
                granted ? PermissionStatus.Granted : PermissionStatus.Denied
            );
        });
    }, []);

    return (
        <PermissionContext.Provider value={{ bluetoothStatus, cameraStatus }}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermissionProvider = () => useContext(PermissionContext);
