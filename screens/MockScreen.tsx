import {JSX, useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import Config from "react-native-config";

function MockScreen(): JSX.Element {

    const [number, setNumber] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${Config.HOST_ORACLE_URL}/data`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.length);
                setNumber(data.length);

                let tot = 0;
                data.forEach((element: any) => {
                    tot += element.data.length;
                });

                setTotal(tot);

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();
    }, []);  // L'array vuoto [] fa sì che l'effetto venga eseguito solo una volta al montaggio

    return (
        <View>
            <Text>Number of entries: {number}</Text>
            <Text>Total data length: {total}</Text>
        </View>
    );
}

export default MockScreen;
