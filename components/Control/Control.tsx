import React, {FC, useEffect, useRef, useState} from 'react';
import { Picker } from '@react-native-picker/picker';
import {SingleValue, ISelectOption, modePlayerOptions, Player} from "../../types";
import {BestMove} from "../../utils/singletons/stockfish";
import {roundTime} from "../../utils/date";
import {View, Text, StyleSheet  } from "react-native";
import {CheckBox, Button} from '@rneui/themed';
import {PlayerTypes} from "@/constants";
import {useControl} from "@/providers/ControlProvider";
import Timer from "@/components/Control/includes/Timer";

import {
    endGame as endGameControl,
    restartGame as restartGameControl,
    setFinish,
    setPause
} from "@/features/control/controlSlice";

import {useDispatch, useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";

interface ControlProps {
    restart: () => void;
    endGame: () => void;
    showBestMove: () => void;
    moveBestMove: () => void;
    bestMove: BestMove | undefined;
    spentTimeForMove: number | undefined;
    modeWhitePlayer: SingleValue<ISelectOption>;
    setModeWhitePlayer: (val: SingleValue<ISelectOption>) => void;
    modeBlackPlayer: SingleValue<ISelectOption>;
    setModeBlackPlayer: (val: SingleValue<ISelectOption>) => void;
}

const matchTime = 300 * 1000; // seconds * 1000
const stepTime = 50; // ms

const Control: FC<ControlProps> = ({
         restart, endGame, showBestMove,
         bestMove, moveBestMove, setModeWhitePlayer, setModeBlackPlayer,
         spentTimeForMove, modeWhitePlayer, modeBlackPlayer
     }: ControlProps) => {

    const {start, analyze, finish, pause} = useSelector((state: RootState) => state.control)
    const { mode, setMode, rotate, setRotate, currentPlayer, setCurrentPlayer,  } = useControl();

    const [blackTime, setBlackTime] = useState<number>(matchTime);
    const [whiteTime, setWhiteTime] = useState<number>(matchTime);

    const fullMatchTimeBlack = useRef<number>(matchTime);
    const fullMatchTimeWhite = useRef<number>(matchTime);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null)

    const dispatch = useAppDispatch();

    // TODO перенести час в окремий компонент
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

    function changeMode(selectedMode: number) {
        setMode(selectedMode);
    }

    function switchRotate() {
        setRotate(!rotate);
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

            <Timer blackTime={blackTime} whiteTime={whiteTime} start={start} />

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
                    onPress={() => dispatch(setPause(!pause))}
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
