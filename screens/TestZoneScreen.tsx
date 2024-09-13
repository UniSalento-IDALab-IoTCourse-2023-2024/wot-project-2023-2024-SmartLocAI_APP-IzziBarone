import {
    Alert,
    ImageBackground, Linking,
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
import {JSX, useState} from "react";
import Config from "react-native-config";

type TestZoneScreen = NativeStackScreenProps<RootStackParamList, RoutesEnum.TestZone>;


function TestZoneScreen({navigation}: TestZoneScreen): JSX.Element {

    const [zone, setZone] = useState("");

    const handleChangeZone = (input: string) => {
        setZone(input.toUpperCase());
    };
    const handleZoneSubmit = () => {
        if (zone.length === 0) {
            Alert.alert('Validation Error', 'Please enter a valid zone.');
        } else {
            navigation.navigate(RoutesEnum.Scan, {zone});
        }
    };

    const handleNavigationUrl = async () => {
        const url = `${Config.HOST_ORACLE_URL}/Extract_Data`;
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert(`Non posso aprire questa pagina: ${url}`);
            console.error('An error occurred', error);
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
                        <Text style={{
                            fontSize: 45,
                            fontWeight: 'bold',
                            marginBottom: 20,
                            color: '#FFFFFF',
                            textAlign: 'center'
                        }}>
                            Insert Zone for testing process
                        </Text>
                        <Text style={{fontSize: 20, marginBottom: 20, color: '#FFFFFF'}}>
                            Insert the zone you are actually in, based on the previous fingerprint.
                            If you want to check the name of the zone please go to this website:
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity
                                style={{
                                    height: 90,
                                    width: '50%',
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    borderColor: '#ff9d58',
                                    backgroundColor: 'rgba(255,164,118,0.79)',
                                    padding: 10,
                                    justifyContent: 'center',
                                }}
                                onPress={handleNavigationUrl}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                    }}
                                >
                                    CHECK THE ZONES
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 80,
                        }}>
                            <TextInput
                                style={{
                                    height: 60,
                                    width: '20%',
                                    borderRadius: 10,
                                    borderColor: '#60c7ff',
                                    borderWidth: 1,
                                    marginBottom: 20,
                                    textAlign: 'center',
                                }}
                                placeholder="Zone code"
                                placeholderTextColor="#ccc"
                                keyboardType="default"
                                value={zone}
                                onChangeText={handleChangeZone}
                                autoCapitalize="characters"
                            />
                            <TouchableOpacity
                                style={{
                                    height: 90,
                                    width: '40%',
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    borderColor: '#7560ff',
                                    backgroundColor: 'rgba(117, 96, 255, 0.1)',
                                    padding: 10,
                                    justifyContent: 'center',
                                }}
                                onPress={handleZoneSubmit}
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

export default TestZoneScreen;
