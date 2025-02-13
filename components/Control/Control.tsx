import React, {FC, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {ISelectOption, modePlayerOptions, SingleValue} from "../../types";
import {BestMove} from "../../utils/singletons/stockfish";
import {StyleSheet, Text, View} from "react-native";
import {Button, CheckBox} from '@rneui/themed';
import {useControl} from "@/providers/ControlProvider";
import Timer from "@/components/Control/includes/Timer";
import {setPause} from "@/features/control/controlSlice";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";

interface ControlProps {}

const Control: FC<ControlProps> = ({}: ControlProps) => {

    const {pause} = useSelector((state: RootState) => state.control)
    const { mode, setMode, rotate, setRotate, setModeWhitePlayer, setModeBlackPlayer,
        modeWhitePlayer, modeBlackPlayer, endGame, restartGame } = useControl();

    const [bestMove, setBestMove] = useState<BestMove | undefined>(undefined);

    const dispatch = useAppDispatch();

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

    function showBestMove() {
        // getBestmoveByStockfish(fen(analyze ? getAnalysisDeep() : counterMove.current + 1)).then(() => {
        //     setBestMove({
        //         from: 'a2',
        //         to: 'a3',
        //         promotion: ''
        //     });
        // });
    }

    function moveBestMove() {
        // getBestmoveByStockfish(fen(analyze ? getAnalysisDeep() : counterMove.current + 1)).then((result: any) => {
        //     setBestMove(result);
        // });
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, paddingRight: 5, gap: 2 }}>
                    {/*<Timer />*/}
                    <Button style={styles.button} title={'Restart game'} onPress={restartGame} />
                    <Button style={styles.button} title={'Start game'} onPress={restartGame} />
                    <Button style={styles.button} title={'End game'} onPress={endGame} />
                    <CheckBox title="Обернути" checked={rotate} onPress={switchRotate} />
                </View>
                <View style={{ flex: 1, paddingLeft: 5 }}>
                    <Text style={{textAlign: "center", fontWeight: "bold"}}>Тип фігур</Text>
                    <CheckBox title="Тип 1" checked={mode === 1} onPress={() => changeMode(1)} checkedIcon="dot-circle-o" uncheckedIcon="circle-o" />
                    <CheckBox title="Тип 2" checked={mode === 2} onPress={() => changeMode(2)} checkedIcon="dot-circle-o" uncheckedIcon="circle-o" />
                    <CheckBox title="Тип 3" checked={mode === 3} onPress={() => changeMode(3)} checkedIcon="dot-circle-o" uncheckedIcon="circle-o" />
                </View>
            </View>

            {/* Рядочок */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View style={{ flex: 1, paddingRight: 5 }}>
                    <Text>Mode white player</Text>
                    <Picker selectedValue={modeWhitePlayer} onValueChange={(value) => setModeWhitePlayer(value)}>
                        {modePlayerOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>
                <View style={{ flex: 1, paddingLeft: 5 }}>
                    <Text>Mode black player</Text>
                    <Picker selectedValue={modeBlackPlayer} onValueChange={(value) => setModeBlackPlayer(value)}>
                        {modePlayerOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View style={{ flex: 1, paddingRight: 5, gap: 2 }}>
                    <Button style={styles.button} title={'Move Best Move'} onPress={moveBestMove} />
                    <Button style={styles.button} disabled={bestMove !== undefined} title={'Show Best Move'} onPress={showBestMove} />
                    {bestMove !== undefined && (
                        <View>
                            <Text>{'From: ' + bestMove.from + ' -> ' + bestMove.to + (bestMove.promotion ? ' | promo: ' + bestMove.promotion : '')}</Text>
                        </View>
                    )}
                </View>
                <View style={{ flex: 1, paddingLeft: 5 }}>
                    <Button title={pause ? 'Pause on' : 'Pause off'} onPress={() => dispatch(setPause(!pause))} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
    }
})

export default Control;

