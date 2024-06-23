import { useEffect, useState } from 'react';
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Button,
    FlatList,
    Animated,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import Images from '../../assets/index';
import { useBleManager } from '../../context/BluetoothProvider';

const BluetoothSettings = () => {
    const bleManager = useBleManager();
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = () => {
        setExpanded(!expanded);
        bleManager.scanDevices();
    };

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
        <View style={styles.container}>
            <Text style={styles.containerHeader}>Nastavení tiskárny</Text>
            <View style={styles.pileContainer}>
                <Animated.View style={styles.pileContainerInner}>
                    <>
                        <View style={styles.flexRow}>
                            {bleManager.state === 'PoweredOn' ? (
                                <>
                                    <Text>Žádné připojené zařízení</Text>
                                    <TouchableOpacity
                                        style={styles.pileButton}
                                        onPress={toggleExpanded}>
                                        <SvgXml
                                            color="black"
                                            xml={
                                                expanded
                                                    ? Images.svgs.arrowUp.source
                                                    : Images.svgs.arrowDown
                                                          .source
                                            }
                                            width="70%"
                                            height="70%"
                                        />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <Text>Bluetooth není dostupné</Text>
                                    <TouchableOpacity
                                        style={styles.pileButton}
                                        onPress={bleManager.enableBluetooth}>
                                        <SvgXml
                                            color="#7ca1f8"
                                            xml={
                                                Images.svgs.bluetoothOff.source
                                            }
                                            width="70%"
                                            height="70%"
                                        />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                        {expanded && (
                            <FlatList
                                data={bleManager.availableDevices}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                contentContainerStyle={styles.deviceList}
                            />
                        )}
                    </>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    deviceId: {
        fontSize: 12,
        color: '#666',
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
    deviceList: {
        width: '100%',
        marginHorizontal: 10,
        marginBottom: 10,
    },
    pileButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    container: {
        paddingHorizontal: 20,
    },
    containerHeader: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 30,
    },
    pileContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 100,
        maxHeight: '95%',
        borderRadius: 40,
        padding: 1,
        marginBottom: 20,
        backgroundColor: 'white',
    },
    pileContainerInner: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        minHeight: 100,
        paddingHorizontal: 20,
        borderRadius: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    flexRow: {
        minHeight: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
});

export default BluetoothSettings;
