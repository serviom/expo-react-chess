import React, {FC, useEffect, useRef, useState} from 'react';
import { Picker } from '@react-native-picker/picker';
import {SingleValue, ISelectOption, modePlayerOptions, Player} from "../types";
import {BestMove} from "../utils/singletons/stockfish";
import {roundTime} from "../utils/date";
import {View, Text, StyleSheet  } from "react-native";
import {CheckBox, Button} from '@rneui/themed';
import {PlayerTypes} from "@/constants";

interface TimerProps {
    currentPlayer: Player | null;
    restart: () => void;
    start: boolean;
    changeMode: (selectedMode: number) => void;
    mode: number;
    rotate: boolean;
    switchRotate: () => void;
    endGame: () => void;
    modeWhitePlayer: SingleValue<ISelectOption>;
    modeBlackPlayer: SingleValue<ISelectOption>;
    setModeWhitePlayer: (newValue: SingleValue<ISelectOption>) => void;
    setModeBlackPlayer: (newValue: SingleValue<ISelectOption>) => void;
    showBestMove: () => void;
    pause: boolean;
    setPause: (mode: boolean) => void;
    moveBestMove: () => void;
    bestMove: BestMove | undefined;
    spentTimeForMove: number | undefined;
    timeOver: () => void;
    finish: boolean;
    analyze: boolean;
}

const matchTime = 5 * 1000; // seconds * 1000
const stepTime = 100; // ms

const Control: FC<TimerProps> = ({
         modeWhitePlayer, setModeWhitePlayer, modeBlackPlayer,
         setModeBlackPlayer, currentPlayer, restart, start, changeMode,
         mode, rotate, switchRotate, endGame, showBestMove, pause,
         setPause, bestMove, moveBestMove, spentTimeForMove, timeOver, finish, analyze

     }) => {

    const fullMatchTimeBlack = useRef<number>(matchTime);
    const fullMatchTimeWhite = useRef<number>(matchTime);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null)

    useEffect(() => {
        if (!finish && !analyze) {
            if (spentTimeForMove) {
                if (currentPlayer === PlayerTypes.BLACK) {
                    fullMatchTimeBlack.current = fullMatchTimeBlack.current - spentTimeForMove;
                    setBlackTime(roundTime(fullMatchTimeBlack.current));
                } else {
                    fullMatchTimeWhite.current = fullMatchTimeWhite.current - spentTimeForMove;
                    setWhiteTime(roundTime(fullMatchTimeWhite.current));
                }
            }

            if (currentPlayer) {
                startTimer();
            }
        }

        return () => {
            if (timer?.current !== null) {
                clearTimeout(timer.current);
            }
            timer.current = null;
        };

    }, [currentPlayer]);

    const handleRestart = () => {
        fullMatchTimeBlack.current = matchTime;
        fullMatchTimeWhite.current = matchTime;
        setWhiteTime(matchTime);
        setBlackTime(matchTime);
        startTimer();
        restart()
    }


    const [blackTime, setBlackTime] = useState<number>(matchTime);
    const [whiteTime, setWhiteTime] = useState<number>(matchTime);

    function startTimer() {
        if (timer.current) {
            clearInterval(timer.current)
        }
        const callback = currentPlayer === PlayerTypes.WHITE ? decrementWhiteTimer : decrementBlackTimer
        timer.current = setInterval(callback, stepTime)
    }

    function decrementBlackTimer() {
        setBlackTime(prev => prev - stepTime);
    }

    function decrementWhiteTimer() {
        setWhiteTime(prev => prev - stepTime);
    }

    function getSeconds() {
        const now = new Date();
        return now.getSeconds();
    }

    useEffect(() => {
        if(!analyze) {
            if (whiteTime <= 0 || blackTime <= 0) {
                timeOver();

                if (timer.current) {
                    clearInterval(timer.current)
                }
            }
        }
    },[whiteTime, blackTime]);

    useEffect(() => {
        if (finish !== undefined && finish) {
            if (timer.current) {
                clearInterval(timer.current)
            }
        }
    },[finish]);

    return (
        <View>
            <View>
                <Button
                    title={'Restart game'}
                    onPress={handleRestart}
                />
            </View>

            <View>
                <Button
                    title={'Start game'}
                    onPress={handleRestart}
                />
            </View>

            <View>
                <Button
                    title={'End game'}
                    onPress={endGame}
                />
            </View>

            {
                start && (
                    <View>
                        <Text>Чорні - {blackTime / 1000} сек.</Text>
                        <Text>Білі - {whiteTime / 1000} сек. </Text>
                    </View>
                )
            }

            <View style={styles.container}>
                <View style={styles.wrapType}>
                    <Text style={styles.label}>Тип фігур</Text>
                    <Text>{getSeconds()}</Text>
                    <CheckBox
                        title="Тип 1"
                        checked={mode === 1}
                        onPress={() => changeMode(1)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                    />
                    <CheckBox
                        title="Тип 2"
                        checked={mode === 2}
                        onPress={() => changeMode(2)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                    />
                    <CheckBox
                        title="Тип 3"
                        checked={mode === 3}
                        onPress={() => changeMode(3)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                    />
                </View>

                <View style={styles.wrapType}>
                    <CheckBox
                        title="Обернути"
                        checked={rotate}
                        onPress={switchRotate}
                    />
                </View>
            </View>

            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 10 }}>Mode white player</Text>
                    <Picker
                        selectedValue={modeWhitePlayer}
                        onValueChange={(value) => setModeWhitePlayer(value)}
                        style={{ height: 50, width: 150 }}
                    >
                        {modePlayerOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 10 }}>Mode black player</Text>
                    <Picker
                        selectedValue={modeBlackPlayer}
                        onValueChange={(value) => setModeBlackPlayer(value)}
                        style={{ height: 50, width: 150 }}
                    >
                        {modePlayerOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View>
                <Button
                    title={'Move Best Move'}
                    onPress={moveBestMove}
                />
            </View>

            <View>
                <Button
                    disabled={bestMove !== undefined}
                    title={'Show Best Move'}
                    onPress={showBestMove}
                />
                {
                    bestMove !== undefined &&
                    <View>
                        <Text>{'From: ' + bestMove.from + ' -> ' + bestMove.to + (bestMove.promotion ? ' | promo: ' + bestMove.promotion : '')}</Text>
                    </View>
                }
            </View>
            <View>
                <Button
                    title={pause ? 'Pause on' : 'Pause off'}
                    onPress={() => setPause(!pause)}
                />
            </View>
        </View>
    );
};

export default Control;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    wrapType: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
});
