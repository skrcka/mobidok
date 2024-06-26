import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import Images from '../../assets/index';
import { useBleManager } from '../../context/BluetoothProvider';
import {
    PRINTER_CHARACTERISTIC_UUID,
    PRINTER_NAME_PREFIX,
    PRINTER_SERVICE_UUID,
} from '../constants/const';

const BluetoothSettings = () => {
    const bleManager = useBleManager();
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = () => {
        setExpanded(!expanded);
        bleManager.scanDevices(PRINTER_NAME_PREFIX);
    };

    useEffect(() => {
        bleManager.scanDevices(PRINTER_NAME_PREFIX);

        return () => {
            bleManager.stopDeviceScan();
        };
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => bleManager.connectToDevice(item)}>
            <View style={styles.deviceNameContainer}>
                <Text style={styles.deviceName}>
                    {item.name ? item.name : 'Neznámé zařízení'}
                </Text>
                {bleManager.lastConnectedDevice?.id === item.id && (
                    <SvgXml
                        color="green"
                        xml={Images.svgs.checkmark.source}
                        width="100%"
                        height="100%"
                    />
                )}
            </View>
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
                                    {!bleManager.lastConnectedDevice &&
                                    !bleManager.connectedDevice ? (
                                        <Text>Žádné připojené zařízení</Text>
                                    ) : (
                                        <View style={styles.flexRowInner}>
                                            {bleManager.connectedDevice ? (
                                                <Text>
                                                    {
                                                        bleManager
                                                            .connectedDevice
                                                            .name
                                                    }
                                                </Text>
                                            ) : (
                                                <Text>
                                                    {
                                                        bleManager
                                                            .lastConnectedDevice
                                                            .name
                                                    }
                                                </Text>
                                            )}
                                            <TouchableOpacity
                                                style={styles.pileButton}
                                                onPress={() => {
                                                    if (
                                                        bleManager.connectedDevice
                                                    ) {
                                                        bleManager.writeToConnectedDevice(
                                                            PRINTER_SERVICE_UUID,
                                                            PRINTER_CHARACTERISTIC_UUID,
                                                            'test'
                                                        );
                                                    } else {
                                                        bleManager.reconnectToDevice();
                                                    }
                                                }}>
                                                <SvgXml
                                                    color="black"
                                                    xml={
                                                        bleManager.connectedDevice
                                                            ? Images.svgs
                                                                  .printer
                                                                  .source
                                                            : Images.svgs
                                                                  .bluetoothConnected
                                                                  .source
                                                    }
                                                    width="70%"
                                                    height="70%"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
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
                            <View
                                style={{
                                    justifyContent: 'center',
                                    width: '100%',
                                }}>
                                {bleManager.availableDevices.length === 0 && (
                                    <ActivityIndicator
                                        size="large"
                                        color="black"
                                    />
                                )}
                                <FlatList
                                    data={bleManager.availableDevices}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItem}
                                    contentContainerStyle={styles.deviceList}
                                />
                            </View>
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
    deviceNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deviceList: {
        width: '100%',
        marginHorizontal: 10,
        marginBottom: 15,
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
    flexRowInner: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginEnd: 10,
    },
});

export default BluetoothSettings;
