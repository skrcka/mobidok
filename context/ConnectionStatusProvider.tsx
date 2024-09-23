import NetInfo from '@react-native-community/netinfo';
import { createContext, useContext, useEffect, useState } from 'react';

export enum NetworkQuality {
    WIFI,
    GOOD,
    MEDIUM,
    BAD,
    UNKNOWN,
}

export type ConnectionStatusType = {
    isInternetReachable: boolean;
    networkQuality: NetworkQuality;
};

const ConnectionStatusContext = createContext<ConnectionStatusType>({
    isInternetReachable: false,
    networkQuality: NetworkQuality.UNKNOWN,
});

export const useConnectionStatus = () => useContext(ConnectionStatusContext);

export function ConnectionStatusProvider({
    children,
}: {
    children: JSX.Element;
}): JSX.Element {
    const [isInternetReachable, setIsInternetReachable] =
        useState<boolean>(false);
    const [connectionQuality, setConnectionQuality] = useState<NetworkQuality>(
        NetworkQuality.UNKNOWN
    );

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            console.log(state);
            if (!state.isInternetReachable) {
                setIsInternetReachable(false);
                setConnectionQuality(NetworkQuality.BAD);
                return;
            }
            setIsInternetReachable(true);
            if (state.type === 'wifi') {
                setConnectionQuality(NetworkQuality.WIFI);
                return;
            }
            if (state.type === 'cellular') {
                switch (state.details.cellularGeneration) {
                    case '2g':
                        setConnectionQuality(NetworkQuality.BAD);
                        break;
                    case '3g':
                        setConnectionQuality(NetworkQuality.MEDIUM);
                        break;
                    case '4g':
                        setConnectionQuality(NetworkQuality.GOOD);
                        break;
                    default:
                        setConnectionQuality(NetworkQuality.UNKNOWN);
                }
            }
        });

        // Unsubscribe to clean up
        return () => unsubscribe();
    }, []);

    const connectioStatusContext: ConnectionStatusType = {
        isInternetReachable,
        networkQuality: connectionQuality,
    };

    return (
        <ConnectionStatusContext.Provider value={connectioStatusContext}>
            {children}
        </ConnectionStatusContext.Provider>
    );
}
