import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CoordinateScreen from './screens/CoordinateScreen.tsx';
import ScanScreen from './screens/ScanScreen.tsx';
import {FingerprintScan} from "./screens/scanModel.ts";
import SendDataScreen from "./screens/SendDataScreen.tsx";
import HomeScreen from "./screens/HomeScreen.tsx";
import TestZoneScreen from "./screens/TestZoneScreen.tsx";
import PositionScreen from "./screens/PositionScreen.tsx";
import LoginScreen from "./screens/LoginScreen.tsx";

export enum RoutesEnum {
    Login = 'Login',
    Coordinate = 'Coordinate',
    TestZone = 'TestZone',
    Position = 'Position',
    Scan = 'Scan',
    SendData = 'SendData',
    Test = 'Test',
    Home = 'Home'
}

export type RootStackParamList = {
    [RoutesEnum.Login]: undefined;
    [RoutesEnum.Test]: undefined;
    [RoutesEnum.Home]: undefined;
    [RoutesEnum.Coordinate]: undefined;
    [RoutesEnum.TestZone]: undefined;
    [RoutesEnum.Position]: undefined;
    [RoutesEnum.Scan]: { xCoordinate?: number; yCoordinate?: number; zone?: string };
    [RoutesEnum.SendData]: {
        xCoordinate?: number;
        yCoordinate?: number;
        zone?: string;
        fingerprintScan: FingerprintScan[]
    };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={RoutesEnum.Login}
                screenOptions={{
                    headerShown: false,
                }}
            >
                {/*<Stack.Screen name={RoutesEnum.Test} component={MockScreen}/>*/}
                <Stack.Screen name={RoutesEnum.Login} component={LoginScreen}/>
                <Stack.Screen name={RoutesEnum.Home} component={HomeScreen}/>
                <Stack.Screen name={RoutesEnum.Coordinate} component={CoordinateScreen}/>
                <Stack.Screen name={RoutesEnum.TestZone} component={TestZoneScreen}/>
                <Stack.Screen name={RoutesEnum.Position} component={PositionScreen}/>
                <Stack.Screen name={RoutesEnum.Scan} component={ScanScreen}/>
                <Stack.Screen name={RoutesEnum.SendData} component={SendDataScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
