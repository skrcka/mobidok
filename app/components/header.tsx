import { faWifi } from '@fortawesome/free-solid-svg-icons/faWifi';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import NetInfo from '@react-native-community/netinfo';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

enum NetworkQuality {
    WIFI,
    GOOD,
    MEDIUM,
    BAD,
    UNKNOWN,
}

const Header = () => {
    const path = usePathname();
    const [connectionQuality, setConnectionQuality] = useState<NetworkQuality>(
        NetworkQuality.UNKNOWN
    );

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            console.log(state);
            if (!state.isInternetReachable) {
                setConnectionQuality(NetworkQuality.BAD);
                return;
            }
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

    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    height: 100,
                    top: 20,
                    padding: 10,
                    position: 'relative',
                }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    {path === '/HomePage' ? (
                        <Text>ONLINE</Text>
                    ) : path === '/OfflineMode' ? (
                        <Text>OFFLINE</Text>
                    ) : path === '/Settings' ? (
                        <Text>NASTAVENÍ</Text>
                    ) : null}
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text>Mobidok</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    {connectionQuality === NetworkQuality.WIFI ? (
                        <FontAwesomeIcon icon={faWifi} size={30} color="blue" />
                    ) : connectionQuality === NetworkQuality.GOOD ? (
                        <FontAwesomeIcon
                            icon={faWifi}
                            size={30}
                            color="green"
                        />
                    ) : connectionQuality === NetworkQuality.MEDIUM ? (
                        <FontAwesomeIcon
                            icon={faWifi}
                            size={30}
                            color="orange"
                        />
                    ) : connectionQuality === NetworkQuality.BAD ? (
                        <FontAwesomeIcon icon={faWifi} size={30} color="red" />
                    ) : (
                        <FontAwesomeIcon icon={faWifi} size={30} color="gray" />
                    )}
                </View>
            </View>
        </>
    );
};
export default Header;
