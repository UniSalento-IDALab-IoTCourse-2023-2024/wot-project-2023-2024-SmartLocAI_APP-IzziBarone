import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "react-native-config";

export const fetchRoomCoordinates = async (): Promise<{ x: number, y: number }> => {
    try {
        const response = await fetch(`${Config.HOST_ORACLE_URL}/data/space/coordinates`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(!response.ok){
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        let maxX = -999;
        let maxY = -999;

        // Trova i valori massimi di X e Y
        data.forEach((element: any) => {
            if (element.x > maxX) {maxX = element.x;}
            if (element.y > maxY) {maxY = element.y;}
        });

        // Aggiunta padding
        return {x: maxX + 0.5, y: maxY + 0.5};

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return {x: 0, y: 0}; // Return a default value in case of an error
    }
};

export const fetchMLPosition = async (): Promise<{ RP: string, x: number, y: number }> => {
    try {
        const response = await fetch(`${Config.HOST_ORACLE_URL}/position`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AsyncStorage.getItem('access_token'),
            },
            body: JSON.stringify({
                rssi: [152, 61, 56],
            }),
        });

        if(!response.ok){
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        return {RP: data.position.RP, x: data.position.x, y: data.position.y};
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return {RP: '', x: 0, y: 0}; // Return a default value in case of an error
    }
};
// export const fetchTriangulationPosition = async (): Promise<{ x: number, y: number }> => {
//
// }
