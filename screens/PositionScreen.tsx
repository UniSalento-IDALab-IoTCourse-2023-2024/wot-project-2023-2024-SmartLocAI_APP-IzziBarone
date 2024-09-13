import React, {JSX, useEffect, useState} from 'react';
import {ImageBackground, SafeAreaView, Text, View} from 'react-native';
import {VictoryChart, VictoryLabel, VictoryLine, VictoryScatter, VictoryTheme} from 'victory-native';
import {fetchMLPosition, fetchRoomCoordinates} from '../utils/positionScreen/fetchCalls.ts';

type GridPosition = {
    RP: string;
    x: number;
    y: number;
};

function PositionScreen(): JSX.Element {
    // Usa lo stato per i valori massimi di X e Y
    const [greaterX, setGreaterX] = useState(0);
    const [greaterY, setGreaterY] = useState(0);
    const [MLPosition, setMLPosition] = useState<GridPosition>({RP: '', x: 0, y: 0});
    // const [TriangulationPosition, setTriangulationPosition] = useState<GridPosition>({x: 0, y: 0});

    // Dati per limiti stanza
    useEffect(() => {
        fetchRoomCoordinates().then(({x, y}) => {
            setGreaterX(x);
            setGreaterY(y);
        });
        console.log(greaterX, greaterY);
        fetchMLPosition().then(({RP, x, y}) => {
            setMLPosition({RP, x, y});
        });
        console.log(MLPosition);
        // fetchTriangulationPosition().then(({x, y}) => {
        //     setTriangulationPosition(x, y);
        // });
    }, []);

    // Dati per chiudere il grafico
    const boundaryData = [
        {x: 0, y: 0},
        {x: 0, y: greaterY},
        {x: greaterX, y: greaterY},
    ];

    const canRender = greaterX > 0 && greaterY > 0;
    const x_ML = MLPosition.x; const y_ML = MLPosition.y;

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={{width: '100%', height: '100%'}}
        >
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                    <Text style={{
                        fontSize: 40,
                        fontWeight: 'bold',
                        marginTop: 30,
                        marginBottom: 60,
                        color: '#FFFFFF',
                        textAlign: 'center',
                    }}>
                        You are here!
                    </Text>
                    {canRender &&
                        <VictoryChart
                            theme={VictoryTheme.material}
                            domain={{x: [greaterX, 0], y: [0, greaterY]}}
                        >
                            {/* Linee per chiudere il grafico */}
                            <VictoryLine
                                data={boundaryData}
                                style={{data: {stroke: '#ffffff', strokeWidth: 2}}}
                            />
                            <VictoryScatter
                                data={[{x: 1.85, y: greaterY}]}
                                size={7}
                                labels="Access point A"
                                labelComponent={<VictoryLabel dx={-1}
                                                              style={[{fill: 'green'}]}/>}
                                style={{data: {fill: '#25711c'}}}
                            />
                            <VictoryScatter
                                data={[{x: 2.5, y: 0}]}
                                size={7}
                                labels="Access point B"
                                labelComponent={<VictoryLabel dx={-1}
                                                              style={[{fill: 'green'}]}/>}
                                style={{data: {fill: '#25711c'}}}
                            />
                            <VictoryScatter
                                data={[{x: greaterX, y: 1.80}]}
                                size={7}
                                labels="Access point C"
                                labelComponent={<VictoryLabel dx={-1}
                                                              style={[{fill: 'green'}]}/>}
                                style={{data: {fill: '#25711c'}}}
                            />
                            <VictoryScatter
                                data={[{x: MLPosition.x, y: MLPosition.y}]}
                                size={7}
                                labels={MLPosition.RP}
                                labelComponent={<VictoryLabel dx={-1}
                                                              style={[{fill: 'red'}]}/>}
                                style={{data: {fill: '#c43a31'}}}
                            />
                            {/*<VictoryScatter*/}
                            {/*    data={[{x: 3, y: 3.6}]}*/}
                            {/*    size={7}*/}
                            {/*    labels="Triangularization method"*/}
                            {/*    labelComponent={<VictoryLabel dx={-1}*/}
                            {/*                                  style={[{fill: 'green'}]}/>}*/}
                            {/*    style={{data: {fill: '#56ff00'}}}*/}
                            {/*/>*/}
                        </VictoryChart>
                    }
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

export default PositionScreen;
