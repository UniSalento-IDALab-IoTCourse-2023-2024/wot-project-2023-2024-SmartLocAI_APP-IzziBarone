import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList, RoutesEnum} from "../App.tsx";
import {
    Alert,
    ImageBackground,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import React, {JSX} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "react-native-config";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, RoutesEnum.Login>;


function LoginScreen({navigation}: LoginScreenProps): JSX.Element {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    console.log(Config.HOST_ORACLE_URL);

    const handleCredentialsSubmit = () => {
        if (username !== '' && password !== '') {
            fetch(`${Config.HOST_ORACLE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
                .then(async (response) => {
                    // Verifica se la risposta HTTP è "ok" (status code 2xx)
                    if (!response.ok) {
                        Alert.alert('Login Error', "Error during the login, invalid credentials or server error.");
                    }

                    const data = await response.json();
                    console.log(data);

                    if (data && data.access_token) {
                        await AsyncStorage.setItem('access_token', data.access_token);
                        console.log(await AsyncStorage.getItem("access_token"));
                        navigation.navigate(RoutesEnum.Home);
                        Alert.alert('Login Success', 'You have successfully logged in');
                    } else {
                        Alert.alert('Login Error', 'Invalid credentials');
                    }
                })
                .catch((error) => {
                    // Mostra un alert con il messaggio di errore se qualcosa va storto
                    console.error('Error:', error);
                    Alert.alert('Login Error', `There was a problem with the login: ${error.message}`);
                });
        } else {
            Alert.alert('Validation Error', 'Please enter valid username and password.');
        }
    };


    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={{width: '100%', height: '100%'}}
        >
            <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{width: '50%'}}>
                        <Text style={styles.titleText}>Log in</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#ccc"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#ccc"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleCredentialsSubmit}>
                                <Text style={styles.buttonText}>LOGIN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = {
    titleText: {
        fontSize: 45,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderRadius: 10,
        paddingLeft: 20,
        borderColor: '#60c7ff',
        borderWidth: 1,
        marginBottom: 20,
        color: '#FFFFFF',
        fontSize: 18, // Larger font size
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    button: {
        height: 60,
        width: '100%',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#7560ff',
        backgroundColor: 'rgba(117, 96, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
};

export default LoginScreen;
