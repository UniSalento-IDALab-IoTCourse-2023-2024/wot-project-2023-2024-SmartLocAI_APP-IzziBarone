import {useEffect, useRef, useState, JSX} from "react";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, RoutesEnum} from '../App.tsx';
import {
    Alert,
    FlatList,
    Image,
    ImageBackground,
    NativeEventEmitter,
    NativeModules,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Card, Paragraph, Title} from 'react-native-paper';
import WifiManager from 'react-native-wifi-reborn';
import BleManager from 'react-native-ble-manager';
import {getRSSIColor} from '../utils/rssiMapColor.ts';
import {BluetoothScan, FingerprintScan, WifiScan} from "./scanModel.ts";

type ScanScreenProps = NativeStackScreenProps<RootStackParamList, RoutesEnum.Scan>;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

function ScanScreen({route, navigation}: ScanScreenProps): JSX.Element {
    const {xCoordinate, yCoordinate, zone} = route.params;
    const isLocalization = xCoordinate === undefined && yCoordinate === undefined && zone === undefined;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fingerprintIterations, setFingerprintIterations] = useState<FingerprintScan[]>([]);

    let wifiArray: WifiScan[] = [];
    let bluetoothArray: BluetoothScan[] = [];
    const renderKey = useRef(0);

    const [wifiState, setWifiState] = useState<WifiScan[]>([]);
    const [bleState, setBleState] = useState<BluetoothScan[]>([]);

    const [sendData, setSendData] = useState<boolean>(false);
    const [isScanning, setIsScanning] = useState(false);
    const [bleManagerInitialized, setBleManagerInitialized] = useState(false);

    const backgroundStyle = {
        flex: 1,
    };
    const cardStyle = {
        backgroundColor: 'transparent',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#392aaa',
        overflow: 'hidden',
        margin: 5,
        flex: 0.48,
        gap: 10,
    };

    // Is loading button counter
    useEffect(() => {
        if (isLocalization) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 10000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, []);

    useEffect(() => {
        if (!sendData) {
            if (!bleManagerInitialized) {
                BleManager.start({showAlert: false})
                    .then(() => {
                        console.log('BleManager started');
                        setBleManagerInitialized(true);
                    })
                    .catch(error => console.error('BleManager start error:', error));
            }

            bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', bluetoothScan);

            if (bleManagerInitialized) {
                startWifiScan();
                startBluetoothScan();
            }

            const intervalId = setInterval(() => {
                if (bleManagerInitialized) {
                    startWifiScan();
                    startBluetoothScan();
                }
            }, 4000);

            return () => {
                setIsScanning(false);
                BleManager.stopScan().catch(err => console.log('Error stopping Bluetooth scan:', err));
                bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
                clearInterval(intervalId);
            };
        }
    }, [bleManagerInitialized, sendData]);

    const startBluetoothScan = async () => {
        if (!isScanning && !sendData) {
            setIsScanning(true);
            try {
                await BleManager.scan([], 5, true);
                console.log('Bluetooth scanning started');
            } catch (error) {
                console.error('Failed to start Bluetooth scan:', error);
            } finally {
                setTimeout(() => {
                    setIsScanning(false);
                }, 4000);
            }
        }
    };
    const startWifiScan = async () => {
        if (!sendData) {
            try {
                const wifiInfo = await WifiManager.reScanAndLoadWifiList();
                if (Array.isArray(wifiInfo)) {
                    const wifiData: WifiScan[] = wifiInfo.map(network => ({
                        SSID: network.SSID,
                        RSSI: network.level,
                    }));
                    wifiArray = wifiData;

                    console.log('WiFi list:', wifiArray);
                    console.log('Bluetooth list:', bluetoothArray);

                    renderKey.current += 1;

                    setWifiState(wifiArray);
                    setBleState(bluetoothArray);

                    setFingerprintIterations((prevData) => {
                        return [...prevData, {wifiDatas: wifiArray, bluetoothDatas: bluetoothArray}];
                    });
                }
            } catch (error) {
                console.log('Error loading WiFi list:', error);
            }
        }
    };

    const bluetoothScan = (peripheral: any) => {
        let name = peripheral.name || peripheral.advertising.localName || 'Unknown';

        if (name === 'Unknown' && peripheral.advertising && peripheral.advertising.manufacturerData) {
            const manufacturerData = peripheral.advertising.manufacturerData.bytes;
            if (manufacturerData) {
                const manufacturerDataArray: number[] = Array.from(new Uint8Array(manufacturerData));
                name = String.fromCharCode(...manufacturerDataArray).trim();
            }
        }

        const rssi = peripheral.rssi;

        bluetoothArray = bluetoothArray.filter(device => device.SSID !== peripheral.id);
        bluetoothArray = [...bluetoothArray, {SSID: peripheral.id, RSSI: rssi}]; // Mantieni i dispositivi precedenti
    };

    const renderWifiItem = ({item}: { item: WifiScan }) => (
        <Card style={cardStyle}>
            <Card.Content>
                <Title
                    style={
                        {
                            color: '#FFFFFF',
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: 30,
                            overflow: 'scroll'
                        }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.SSID}
                </Title>
                <Paragraph
                    style={{color: getRSSIColor(item.RSSI), fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>
                    {item.RSSI} dBm
                </Paragraph>
                <View style={{position: 'absolute', bottom: 10, right: 10}}>
                    <Image
                        source={require('../assets/wifi_icon.png')}
                        style={{width: 20, height: 20, tintColor: 'white'}} // Imposta la dimensione dell'icona
                    />
                </View>
            </Card.Content>
        </Card>
    );

    const handleSendData = async () => {
        if (fingerprintIterations.length > 0) {
            console.log("Fingerprint data", fingerprintIterations);
            setSendData(true);

            try {
                await BleManager.stopScan();
                console.log('Bluetooth scan stopped');
            } catch (err) {
                console.log('Error stopping Bluetooth scan:', err);
            }

            bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');

            console.log("Coordinate", xCoordinate, yCoordinate);
            console.log("Zone", zone);

            if (xCoordinate !== undefined && yCoordinate !== undefined) {
                navigation.navigate(RoutesEnum.SendData, {
                    xCoordinate,
                    yCoordinate,
                    fingerprintScan: fingerprintIterations,
                });
            } else {
                navigation.navigate(RoutesEnum.SendData, {
                    zone,
                    fingerprintScan: fingerprintIterations,
                });
            }
        } else {
            Alert.alert('No data to send.');
        }
    };

    const renderBluetoothItem = ({item}: { item: BluetoothScan }) => (
        <Card style={cardStyle}>
            <Card.Content>
                <Title
                    style={{color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 30}}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.SSID}
                </Title>
                <Paragraph
                    style={{color: getRSSIColor(item.RSSI), fontSize: 15, fontWeight: 'bold', textAlign: 'center'}}>
                    {item.RSSI} dBm
                </Paragraph>
                <View style={{position: 'absolute', bottom: 10, right: 10}}>
                    <Image
                        source={require('../assets/bluetooth_icon.png')}
                        style={{width: 20, height: 20, tintColor: 'white'}} // Imposta la dimensione dell'icona
                    />
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={{width: '100%', height: '100%'}}
        >
            <SafeAreaView style={backgroundStyle}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 35, fontWeight: 'bold', marginTop: 50, marginBottom: 20, color: '#FFFFFF'}}>
                        Scanning for Wi-Fi & Bluetooth:
                    </Text>
                    <FlatList
                        key="wifi-list"
                        data={wifiState}
                        keyExtractor={(item) => `${item.SSID}-${item.RSSI}`}
                        renderItem={renderWifiItem}
                        numColumns={2}
                        columnWrapperStyle={{justifyContent: 'space-between'}}
                        style={{width: '80%', height: '40%', flex: 2, marginTop: 40}}
                    />
                    <FlatList
                        key="bluetooth-list"
                        data={bleState}
                        keyExtractor={(item) => item.SSID}
                        renderItem={renderBluetoothItem}
                        numColumns={2}
                        columnWrapperStyle={{justifyContent: 'space-between'}}
                        style={{width: '80%', height: '20%', flex: 2, marginTop: 40}}
                    />
                    <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 150}}>
                        <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom: 40, color: '#FFFFFF'}}>
                            Total number of datas collected: {fingerprintIterations.length}
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 150,
                            maxWidth: '50%',
                            gap: 30
                        }}>
                            {
                                isLocalization &&
                                <TouchableOpacity
                                    style={{
                                        height: 120,
                                        width: '50%',
                                        borderWidth: 2,
                                        borderRadius: 10,
                                        borderColor: isLoading ? '#636363' : '#7560ff',
                                        backgroundColor: isLoading ? 'rgb(84,83,97)' : 'rgba(117, 96, 255, 0.1)',
                                        padding: 10,
                                        justifyContent: 'center',
                                    }}
                                    onPress={() => navigation.navigate(RoutesEnum.Position)}
                                    disabled={isLoading}
                                >
                                    <Text
                                        style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
                                        {isLoading ? 'Loading...' : 'LOCALIZE ME'}
                                    </Text>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity
                                style={{
                                    height: 120,
                                    width: '50%',
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    borderColor: isLoading ? '#636363' : '#7560ff',
                                    backgroundColor: isLoading ? 'rgb(84,83,97)' : 'rgba(117, 96, 255, 0.1)',
                                    padding: 10,
                                    justifyContent: 'center',
                                }}
                                onPress={handleSendData}
                                disabled={isLoading}
                            >
                                <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
                                    {isLoading ? 'Loading...' : 'FILTER DATA'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

export default ScanScreen;
