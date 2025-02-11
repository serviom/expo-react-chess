import React, {FC} from 'react';
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

interface ControlProps {
    restart: () => void;
    endGame: () => void;
    // showBestMove: () => void;
    // moveBestMove: () => void;
    //bestMove: BestMove | undefined;
}

const Control: FC<ControlProps> = ({
         restart, endGame,
     }: ControlProps) => {

    const {pause} = useSelector((state: RootState) => state.control)
    const { mode, setMode, rotate, setRotate, setModeWhitePlayer, setModeBlackPlayer,
        modeWhitePlayer, modeBlackPlayer } = useControl();

    const dispatch = useAppDispatch();

    const handleRestart = () => {
        restart()
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

            <Timer />

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

            {/*<View>*/}
            {/*    <Button*/}
            {/*        title={'Move Best Move'}*/}
            {/*        onPress={moveBestMove}*/}
            {/*    />*/}
            {/*</View>*/}

            {/*<View>*/}
            {/*    <Button*/}
            {/*        disabled={bestMove !== undefined}*/}
            {/*        title={'Show Best Move'}*/}
            {/*        onPress={showBestMove}*/}
            {/*    />*/}
            {/*    {*/}
            {/*        bestMove !== undefined &&*/}
            {/*        <View>*/}
            {/*            <Text>{'From: ' + bestMove.from + ' -> ' + bestMove.to + (bestMove.promotion ? ' | promo: ' + bestMove.promotion : '')}</Text>*/}
            {/*        </View>*/}
            {/*    }*/}
            {/*</View>*/}
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
