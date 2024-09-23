import { faWifi } from '@fortawesome/free-solid-svg-icons/faWifi';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { usePathname } from 'expo-router';
import { View, Text } from 'react-native';

import {
    NetworkQuality,
    useConnectionStatus,
} from '../../context/ConnectionStatusProvider';

const Header = () => {
    const path = usePathname();
    const { networkQuality } = useConnectionStatus();

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
                    {networkQuality === NetworkQuality.WIFI ? (
                        <FontAwesomeIcon icon={faWifi} size={30} color="blue" />
                    ) : networkQuality === NetworkQuality.GOOD ? (
                        <FontAwesomeIcon
                            icon={faWifi}
                            size={30}
                            color="green"
                        />
                    ) : networkQuality === NetworkQuality.MEDIUM ? (
                        <FontAwesomeIcon
                            icon={faWifi}
                            size={30}
                            color="orange"
                        />
                    ) : networkQuality === NetworkQuality.BAD ? (
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
