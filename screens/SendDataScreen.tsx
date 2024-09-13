import {useState, JSX} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, RoutesEnum} from '../App.tsx';
import {ImageBackground, ScrollView, StyleSheet, View, TouchableOpacity, Text, FlatList, Alert} from 'react-native';
import {Cell, Row, Table, TableWrapper} from 'react-native-table-component';
import {Card} from 'react-native-paper';
import {adaptPayload} from '../utils/adaptPayload.ts';
import {useAsyncStorage} from "@react-native-async-storage/async-storage";
import Config from "react-native-config";

type SendDataScreenProps = NativeStackScreenProps<RootStackParamList, RoutesEnum.SendData>;

function SendDataScreen({navigation, route}: SendDataScreenProps): JSX.Element {
    const {xCoordinate, yCoordinate, zone, fingerprintScan} = route.params;
    const isLocalization = xCoordinate === undefined && yCoordinate === undefined && zone === undefined;


    const uniqueWifiSSIDs = Array.from(new Set(fingerprintScan.flatMap(scan => scan.wifiDatas.map(data => data.SSID))));
    const uniqueBluetoothSSIDs = Array.from(new Set(fingerprintScan.flatMap(scan => scan.bluetoothDatas.map(data => data.SSID))));

    const [selectedSSIDs, setSelectedSSIDs] = useState([...uniqueWifiSSIDs, ...uniqueBluetoothSSIDs]);
    const [ssidLetterMapping, setSsidLetterMapping] = useState<Record<string, string>>({});

    const toggleSSIDSelection = (ssid: string) => {
        setSelectedSSIDs(prevSelected =>
            prevSelected.includes(ssid)
                ? prevSelected.filter(item => item !== ssid)
                : [...prevSelected, ssid]
        );
    };
    const selectLetterForSSID = (ssid: string, letter: string) => {
        setSsidLetterMapping(prevMapping => ({
            ...prevMapping,
            [ssid]: letter,
        }));
    };

    const displayedWifiSSIDs = uniqueWifiSSIDs.filter(ssid => selectedSSIDs.includes(ssid));
    const displayedBluetoothSSIDs = uniqueBluetoothSSIDs.filter(ssid => selectedSSIDs.includes(ssid));

    // Header della tabella
    const tableHead = (xCoordinate !== undefined && yCoordinate !== undefined) ?
        ['X', 'Y', ...displayedWifiSSIDs, ...displayedBluetoothSSIDs] :
        ['Zone', ...displayedWifiSSIDs, ...displayedBluetoothSSIDs];

    // Dati della tabella
    const tableData = fingerprintScan.map(scan => {
        const rowData = [];

        if (xCoordinate !== undefined && yCoordinate !== undefined) {
            rowData.push(xCoordinate.toString());
            rowData.push(yCoordinate.toString());
        } else {
            rowData.push(zone);
        }

        displayedWifiSSIDs.forEach(ssid => {
            const wifiData = scan.wifiDatas.find(data => data.SSID === ssid);
            rowData.push(wifiData ? wifiData.RSSI.toString() : 'N/A');
        });

        displayedBluetoothSSIDs.forEach(ssid => {
            const bluetoothData = scan.bluetoothDatas.find(data => data.SSID === ssid);
            rowData.push(bluetoothData ? bluetoothData.RSSI.toString() : 'N/A');
        });

        return rowData;
    });

    const renderSSIDCard = ({item}: { item: string }) => {
        const isSelected = selectedSSIDs.includes(item);

        return (
            <View style={styles.ssidCardWrapper}>
                <TouchableOpacity onPress={() => toggleSSIDSelection(item)}>
                    <Card style={[styles.ssidCard, isSelected ? styles.ssidCardSelected : null]}>
                        <Text style={styles.ssidCardText}>{item}</Text>
                    </Card>
                </TouchableOpacity>
                <View style={styles.letterSelectionContainer}>
                    {['A', 'B', 'C'].map(letter => (
                        <TouchableOpacity
                            key={letter}
                            style={[
                                styles.letterButton,
                                isSelected ? (ssidLetterMapping[item] === letter ? styles.letterButtonSelected : null) : styles.letterButtonDisabled,
                            ]}
                            onPress={() => isSelected && selectLetterForSSID(item, letter)}
                            disabled={!isSelected}
                        >
                            <Text style={styles.letterButtonText}>{letter}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    const handleSendData = async () => {

        if (selectedSSIDs.length < 3 || Object.keys(ssidLetterMapping).length < 3) {
            Alert.alert('Please select at least 3 access points and associate a letter to each one.');
            return;
        }

        const mappedLetters = Object.values(ssidLetterMapping);
        const uniqueLetters = new Set(mappedLetters);
        if (uniqueLetters.size !== mappedLetters.length) {
            Alert.alert('Please make sure all mapped letters are unique.');
            return;
        }

        const payload = adaptPayload(isLocalization, fingerprintScan, selectedSSIDs, ssidLetterMapping, xCoordinate, yCoordinate, zone);
        console.log(payload);

        // Invia il payload al server
        let url = '';
        if (isLocalization) {
            url = `${Config.HOST_ORACLE_URL}/position`;
        } else {
            url =
                (xCoordinate !== undefined && yCoordinate !== undefined) ?
                    `${Config.HOST_ORACLE_URL}/data` :
                    `${Config.HOST_ORACLE_URL}/data/test`;
        }

        console.log(url);
        const { getItem } = useAsyncStorage('access_token');
        const token = await getItem();

        // console.log('Sending data to server...');
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer' + token,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Se necessario, gestisci la risposta qui
            console.log('Data sent successfully!');
            console.log(response);
            console.log('###############################################');
            console.log(isLocalization);

            if (isLocalization) {
                navigation.navigate(RoutesEnum.Position);
                return;
            }

            if (xCoordinate !== undefined && yCoordinate !== undefined){
                navigation.navigate(RoutesEnum.Coordinate);
            } else {
                navigation.navigate(RoutesEnum.TestZone);
            }

            Alert.alert('Data sent successfully!');
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            Alert.alert('There was a problem with the fetch operation:\n' + error);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={{width: '100%', height: '100%'}}
        >
            <ScrollView style={styles.container}>
                <View style={styles.tableContainer}>
                    <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                        <Row data={tableHead} style={styles.header} textStyle={{...styles.text}}/>
                        {tableData.map((rowData, index) => (
                            <TableWrapper key={index} style={styles.wrapper}>
                                {rowData.map((cellData, cellIndex) => (
                                    <Cell key={cellIndex} data={cellData} textStyle={{...styles.text}}/>
                                ))}
                            </TableWrapper>
                        ))}
                    </Table>
                </View>
                <View style={styles.ssidContainer}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', color: '#FFF', marginBottom: 20}}>Select SSIDs and
                        associate letters:</Text>
                    <FlatList
                        data={[...uniqueWifiSSIDs, ...uniqueBluetoothSSIDs]}
                        keyExtractor={(item) => item}
                        renderItem={renderSSIDCard}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                    <View style={{alignItems: 'center', marginTop: 80, justifyContent: 'center'}}>
                        <Text style={{
                            fontSize: 40,
                            fontWeight: 'bold',
                            marginBottom: 15,
                            textAlign: 'center',
                            color: 'white',
                        }}>
                            Send data to the server
                        </Text>
                        <Text style={{
                            fontSize: 20,
                            color: '#FFF',
                            marginBottom: 30,
                            maxWidth: '60%',
                            textAlign: 'center',
                        }}>
                            Send this data to server, remember to select 3 access points in total (WIFI and BLE).
                        </Text>
                        <TouchableOpacity
                            style={{
                                height: 100,
                                width: '30%',
                                borderWidth: 2,
                                borderRadius: 10,
                                borderColor: '#7560ff',
                                backgroundColor: 'rgba(117, 96, 255, 0.1)',
                                padding: 10,
                                justifyContent: 'center',
                            }}
                            onPress={handleSendData}
                        >
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
                                SEND DATA
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, padding: 16, paddingTop: 30},
    tableContainer: {flex: 1, marginBottom: 50, marginTop: 50, overflow: 'scroll', maxHeight: '40%', borderRadius: 3},
    header: {height: 50, backgroundColor: 'rgb(27,22,53)', padding: 1},
    wrapper: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', height: 40},
    text: {textAlign: 'center', fontWeight: 'bold', color: '#FFF', fontSize: 14},
    ssidContainer: {paddingVertical: 10, paddingHorizontal: 5, justifyContent: 'center', alignItems: 'center'},
    ssidCardWrapper: {alignItems: 'center', marginBottom: 20},
    ssidCard: {
        backgroundColor: '#292540',
        height: 90,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    ssidCardSelected: {
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: 'rgb(117,96,255)',
    },
    ssidCardText: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    letterSelectionContainer: {flexDirection: 'row', marginTop: 5},
    letterButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#392aaa',
        borderRadius: 5,
        marginHorizontal: 3,
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letterButtonDisabled: {
        backgroundColor: '#2e2840',  // Colore disabilitato
        borderWidth: 0,
    },
    letterButtonSelected: {
        backgroundColor: 'rgb(117,96,255)',
    },
    letterButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SendDataScreen;
