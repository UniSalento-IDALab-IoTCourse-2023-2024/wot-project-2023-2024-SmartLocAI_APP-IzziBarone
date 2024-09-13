import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, RoutesEnum} from '../App.tsx';
import * as React from 'react';
import {JSX, useEffect} from 'react';
import {
    Alert,
    Image,
    ImageBackground,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, RoutesEnum.Home>;

function HomeScreen({navigation}: HomeScreenProps): JSX.Element {

    const [permissionsGranted, setPermissionsGranted] = React.useState(false);

    useEffect(() => {
        if (Platform.OS === 'android' && !permissionsGranted) {
            requestGenericPermissions();
        }
    }, [permissionsGranted]);

    useEffect(() => {
        setInterval(() => {
            checkLocationEnabled();
        }, 3000);
    }, []);

    const checkLocationEnabled = async () => {
        try {
            const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (result === RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    () => {
                        console.log('Location services enabled');
                    },
                    (error) => {
                        if (error.code === 2) {  // Code 2 is for location services disabled
                            showLocationAlert();
                        }
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000,
                    }
                );
            } else {
                requestLocationPermission();
            }
        } catch (error) {
            console.log('Error checking location permission', error);
        }
    };

    const showLocationAlert = () => {
        Alert.alert(
            'Location required',
            'Please enable your location services to continue.',
            [{text: 'OK', onPress: () => requestLocationPermission()}],
            {cancelable: false} // Prevents dismissing the alert without clicking OK
        );
    };

    const requestGenericPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);

            if (
                granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                setPermissionsGranted(true);
                console.log('All required permissions granted');
            } else {
                console.log('One or more permissions denied');
            }
        } catch (error) {
            console.error('Permission error:', error);
        }
    };
    const requestLocationPermission = async () => {
        try {
            const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (status !== RESULTS.GRANTED) {
                showLocationAlert(); // Re-show the alert if permission isn't granted
            }
        } catch (error) {
            console.log('Error requesting location permission', error);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={{width: '100%', height: '100%'}}
        >
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{padding: 10, maxWidth: '70%', justifyContent: 'center'}}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={{
                            width: 200,
                            height: 200,
                            marginBottom: 10,
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}
                        resizeMode="contain"
                    />
                    <Text style={{
                        fontSize: 40,
                        fontWeight: 'bold',
                        marginTop: 30,
                        marginBottom: 60,
                        color: '#FFFFFF',
                        textAlign: 'center',
                    }}>
                        Welcome in Smartloc AI !
                    </Text>
                    <Text style={{fontSize: 20, color: '#FFFFFF', textAlign: 'center'}}>
                        In this application you can scan your environment and send data to a server that can predict
                        your location.
                        To do that you have to fingerprint your environment.
                        If you already did that you can test your position or localize yourself:
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 70,
                        gap: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            style={{
                                height: 200,
                                width: '30%',
                                borderWidth: 2,
                                borderRadius: 10,
                                borderColor: '#7560ff',
                                backgroundColor: 'rgba(117, 96, 255, 0.1)',
                                padding: 10,
                                justifyContent: 'center',
                            }}
                            onPress={() => navigation.navigate(RoutesEnum.Coordinate)}
                        >
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
                                Fingerprint environment
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                height: 200,
                                width: '30%',
                                borderWidth: 2,
                                borderRadius: 10,
                                borderColor: '#7560ff',
                                backgroundColor: 'rgba(117, 96, 255, 0.1)',
                                padding: 10,
                                justifyContent: 'center',
                            }}
                            onPress={() => {
                                navigation.navigate(RoutesEnum.TestZone)
                            }}
                        >
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
                                Test model
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                height: 200,
                                width: '30%',
                                borderWidth: 2,
                                borderRadius: 10,
                                borderColor: '#907eff',
                                backgroundColor: 'rgba(170,162,228,0.53)',
                                padding: 10,
                                justifyContent: 'center',
                            }}
                            onPress={() => {
                                navigation.navigate(RoutesEnum.Scan, {});
                            }}
                        >
                            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>
                                Localize me
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>

    )
};

export default HomeScreen;
