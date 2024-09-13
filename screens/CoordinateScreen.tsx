import * as React from 'react';
import {
    Alert,
    ImageBackground,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {RootStackParamList, RoutesEnum} from '../App.tsx';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type CoordinateScreenProps = NativeStackScreenProps<RootStackParamList, RoutesEnum.Scan>;

function CoordinateScreen({navigation}: CoordinateScreenProps): React.JSX.Element {
    const [xCoordinate, setXCoordinate] = React.useState('');
    const [yCoordinate, setYCoordinate] = React.useState('');

    const handleCoordinatesSubmit = () => {
        const x = Number(xCoordinate);
        const y = Number(yCoordinate);
        if (!isNaN(x) && !isNaN(y)) {
            navigation.navigate(RoutesEnum.Scan, {xCoordinate: x, yCoordinate: y});
        } else {
            Alert.alert('Validation Error', 'Please enter valid X and Y coordinates.');
        }
    };

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={{width: '100%', height: '100%'}}
        >
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: '70%'}}>
                        <Text style={{fontSize: 45, fontWeight: 'bold', marginBottom: 20, color: '#FFFFFF'}}>
                            Insert Coordinates
                        </Text>
                        <Text style={{fontSize: 20, marginBottom: 20, color: '#FFFFFF'}}>
                            Insert coordinates for the position you want to scan.
                            When you press the button, the app will start scanning the Wi-Fi networks around you.
                            Then it will send the data to the server.
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <TextInput
                                style={{
                                    height: 60,
                                    borderRadius: 10,
                                    paddingLeft: 30,
                                    borderColor: '#60c7ff',
                                    borderWidth: 1,
                                    marginBottom: 20,
                                    color: '#FFFFFF',
                                    flex: 1,
                                    marginRight: 10,
                                }}
                                placeholder="X Coordinate"
                                placeholderTextColor="#ccc"
                                keyboardType="numeric"
                                value={xCoordinate}
                                onChangeText={setXCoordinate}
                            />
                            <TextInput
                                style={{
                                    height: 60,
                                    paddingLeft: 30,
                                    borderRadius: 10,
                                    borderColor: '#60c7ff',
                                    borderWidth: 1,
                                    marginBottom: 20,
                                    color: '#FFFFFF',
                                    flex: 1,
                                }}
                                placeholder="Y Coordinate"
                                placeholderTextColor="#ccc"
                                keyboardType="numeric"
                                value={yCoordinate}
                                onChangeText={setYCoordinate}
                            />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 30
                        }}>
                            <TouchableOpacity
                                style={{
                                    height: 120,
                                    width: '50%',
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    borderColor: '#7560ff',
                                    backgroundColor: 'rgba(117, 96, 255, 0.1)',
                                    padding: 10,
                                    justifyContent: 'center',
                                }}
                                onPress={handleCoordinatesSubmit}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                    }}
                                >
                                    START SCANNING
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

export default CoordinateScreen;
