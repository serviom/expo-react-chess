import React, {FC} from "react";
import {setAnalysisNotice, setNotice} from "@/features/board/boardSlice";
import {NoticeMove} from "./includes/NoticeMove";
import {searchMustItemForAnalysisById} from "../utils/board";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Input} from "@rneui/themed";
import {RootState, useAppDispatch} from "@/features/store";
import {useSelector} from "react-redux";
import {storeDataInStorage} from "@/utils/storage";

import {KEY_NOTES_LOCAL_STORAGE, NOTES_LOCAL_STORAGE, PlayerTypes, VALUE_NOTES_LOCAL_STORAGE} from "@/constants";
import {Player} from "@/types";

export interface NoticeProps {
    nextMove: () => void;
    prevMove: () => void;
    firstMove: () => void;
    lastMove: () => void;
    goToStep: (step: number) => void;
    loadAnalyze: (position: number) => void;
    goToAnalysisStep: (step: number) => void;
    counter: number;
    setAnalyze: (key: boolean) => void;
    setStart: (key: boolean) => void;
    analyze: boolean;
    start: boolean;
    pgn: string;
    setPgn: (pgn: string) => void;
    counterAnalysisMove: React.RefObject<number>,
    isNext: boolean,
    isLast: boolean,
    isPrev: boolean,
    isFirst: boolean,
}

export interface moveTree {
    value: string,
    color: Player,
    deep: number,
    index: number,
    id: number,
    children: moveTree[]
}

const getStyle = (isActive: boolean) => {
    return isActive ? styles.current : styles.defaultStyle;
};

const Notice: FC<NoticeProps> = ({isNext, nextMove, isFirst, firstMove, isPrev, prevMove, isLast, lastMove,
     goToStep, goToAnalysisStep, loadAnalyze, counter, setAnalyze, setStart, start, analyze,
     pgn,setPgn, counterAnalysisMove}) => {

    const dispatch = useAppDispatch();
    const {notice, analysis_notes} = useSelector((state: RootState) => state.board);

    function currentMove(step: number): boolean {
        return step === counter;
    }

    function analysisCurrentMove(step: number): boolean {
        return step === counterAnalysisMove.current;
    }

    function addMovesToArray(moves: string, codesInArray: string[]) {
        let [a, b] = moves.split(' ');
        codesInArray.push(a);
        b && codesInArray.push(b);
    }

    function clearNewLines(moves: string): string {
        // h3\nBh5'
        moves = moves.replaceAll("\n",' ');
        moves = moves.replaceAll("\r",' ');
        moves = moves.replaceAll('  ',' ');
        return moves.trim();
    }

    function addItemToTree(parentItem: moveTree, move: string, idLastItem: number): number {
        parentItem.children.unshift({
            value: move,
            color: parentItem.color === PlayerTypes.BLACK ? PlayerTypes.WHITE : PlayerTypes.BLACK,
            deep: parentItem.deep + 1,
            index: parentItem.children.length,
            id: ++idLastItem,
            children: []
        });

        return idLastItem;
    }

    function makeAdvancedItems(step: number, clearPgnPicture: string, moveTree: moveTree, idLastItem: number,
                               parentItem: moveTree, findOutParentMove = true ): number {

        let origParentItem = parentItem;

        let i = step;
        let moves = clearPgnPicture;

        let firstPngChunk = null;

        while (true) {
            let reg = new RegExp('(?<![0-9])' + i + '\\.\\s+([^\\.\\s]+|\\.{3})\\s+([^\\.\\s]+|\\.{3})\\s*', 'gm');

            const result = getLastMatch(reg, moves);

            if (result === null) {
                break;
            }

            const index = indexOfLast(moves, result[0]);

            if (firstPngChunk === null) {
                firstPngChunk = moves.substring(index);
                clearPgnPicture = clearPgnPicture.replace(firstPngChunk, '');
            }

            if (result[1] === '...') {
                if (findOutParentMove) {
                    let reg2 = new RegExp('(?<![0-9])' + i + '\\.\\s+([^\\.\\s]+|\\.{3})\\s+(\\.{3})\\s+', 'gm');
                    const result2 = getLastMatch(reg2, moves);

                    if (result2 === null) {
                        throw new Error('Match type "Re2 in makeAdvancedItems" is null');
                    }

                    moves = moves.replace(result2[0], '');
                    moves = moves.trim();

                    idLastItem = addItemToTree(parentItem, result2[1], idLastItem);
                    parentItem = searchMustItemForAnalysisById(moveTree, idLastItem);
                    idLastItem = makeAdvancedItems(i, moves, moveTree, idLastItem, parentItem, false);
                    moves = '';
                } else {
                    idLastItem = addItemToTree(parentItem, result[2], idLastItem);
                    findOutParentMove = true;
                    parentItem = searchMustItemForAnalysisById(moveTree, idLastItem);
                    moves = moves.substring(index + result[0].length);
                    moves = moves.trim();
                }
            } else {
                idLastItem = addItemToTree(parentItem, result[1], idLastItem);

                const lastItem = searchMustItemForAnalysisById(moveTree, idLastItem);
                parentItem = lastItem;

                idLastItem = addItemToTree(lastItem, result[2], idLastItem);
                findOutParentMove = true;
                parentItem = searchMustItemForAnalysisById(moveTree, idLastItem);

                moves = moves.substring(index + result[0].length);
                moves = moves.trim();
            }


            if (moves.length === 0 || i > 100) {
                break;
            }
            i++;
        }

        if (clearPgnPicture.length > 0) {
            idLastItem = makeAdvancedItems(step, clearPgnPicture, moveTree, idLastItem, origParentItem, false);
        }

        return idLastItem;
    }

    function makeAdvancedMoves(clearPgnPicture: string,  moveTree: moveTree, idLastItem: number): number {
        let i = 1
        let moves = clearPgnPicture;
        let originalMoves = moves;
        while (true) {
            let parentItem = i > 1 ? searchMustItemForAnalysisById(moveTree, (i - 1) * 2) : searchMustItemForAnalysisById(moveTree, 1);
            let reg = new RegExp('(?<![0-9])' + i + '\\.\\s+([^\\.\\s]+|\\.{3})\\s+([^\\.\\s]+|\\.{3})\\s+', 'gm');
            const result = getLastMatch(reg, originalMoves);
            if (result === null) {
                break;
            }

            const indexOriginal = indexOfLast(originalMoves, result[0]);
            moves = originalMoves.substring(0, indexOriginal);
            moves = moves.trim();

            if (result[1] === '...') {
                let reg2 = new RegExp('(?<![0-9])' + i + '\\.\\s+([^\\.\\s]+|\\.{3})\\s+(\\.{3})\\s+', 'gm');
                const result2 = getLastMatch(reg2, moves);
                if (result2 === null) {
                    throw new Error('Match type "Re2 ..." is null');
                }

                moves = moves.replace(result2[0], '');
                moves = moves.trim();
                parentItem = searchMustItemForAnalysisById(moveTree, (i - 1) * 2 + 1);
            }

            if (moves !== '') {
                idLastItem = makeAdvancedItems(i, moves, moveTree, idLastItem, parentItem, false);
            }

            originalMoves = originalMoves.substring(indexOriginal + result[0].length);
            i++;
        }
        return idLastItem;
    }

    function makeMineLineHistoryFromPng(clearPgnPicture: string): string[] {
        let i = 1;
        let codesInArray: string[] = [];

        while (true) {
            let reg = new RegExp('(?<![0-9])' + i + '\\.\\s+([^\\.\\s]+|\\.{3})\\s+([^\\.\\s]+|\\.{3})\\s+', 'gm');

            const result = getLastMatch(reg, clearPgnPicture);

            if (result === null) {
                break;
            }

            if (result[1] === '...') {
                let reg2 = new RegExp('(?<![0-9])' + i + '\\.\\s+([^\\.\\s]+|\\.{3})\\s+(\\.{3})\\s+', 'gm');
                const result2 = getLastMatch(reg2, clearPgnPicture);

                if (result2 === null) {
                    throw new Error('Match type "Re2 ..." is null');
                }

                codesInArray.push(result2[1]);
                codesInArray.push(result[2]);

                const index = indexOfLast(clearPgnPicture, result[0]);
                clearPgnPicture = clearPgnPicture.substring(index + result[0].length);

            } else {
                codesInArray.push(result[1]);
                codesInArray.push(result[2]);
            }
            i++;
        }
        return codesInArray;
    }

    function indexOfLast(string: string, search: string) {
        let lastIndex = -1;
        for (let i = 0; i < string.length; i++) {
            if (string.indexOf(search, i) !== -1) {
                lastIndex = string.indexOf(search, i);
            }
        }
        return lastIndex;
    }

    function getLastMatch(regex: RegExp, string: string) {
        let match;
        let lastMatch = null;

        while ((match = regex.exec(string)) !== null) {
            lastMatch = match;
        }

        return lastMatch;
    }

    function makeMainTreeObject(movesInArray: string[], children: moveTree | null): moveTree | null {

        const identifier = movesInArray.length - 1;

        const lastValue = movesInArray.pop();

        if (lastValue === undefined) {
            return children;
        }

        let tree = {
            value: lastValue,
            color: identifier % 2 !== 0 ? PlayerTypes.BLACK : PlayerTypes.WHITE,
            deep: identifier + 1,
            index: 0,
            id: identifier + 1,
            children: children === null ? [] : [children]
        }

        return makeMainTreeObject(movesInArray, tree);
    }

    async function loadGameFromPngHistory() {
        const clearPgnPicture = clearNewLines(pgn);
        const mineLineHistory = makeMineLineHistoryFromPng(clearPgnPicture);

        let copyMineLineHistory = [...mineLineHistory];

        const moveTree = makeMainTreeObject(copyMineLineHistory, null);

        if (moveTree === null) {
            throw new Error('moveTree is null');
        }

        console.log('mineLineHistory.length: ', mineLineHistory.length);
        const idLastItem = makeAdvancedMoves(clearPgnPicture, moveTree, mineLineHistory.length);
        await storeDataInStorage(NOTES_LOCAL_STORAGE, JSON.stringify(mineLineHistory));
        await storeDataInStorage(VALUE_NOTES_LOCAL_STORAGE, JSON.stringify(mineLineHistory));
        await storeDataInStorage(KEY_NOTES_LOCAL_STORAGE, JSON.stringify(moveTree));

        dispatch(setNotice(mineLineHistory));
        dispatch(setAnalysisNotice(moveTree));
        loadAnalyze(idLastItem);
    }

    return (
        <View style={styles['wrapNotice']}>
            {
                analyze && (
                    <Text>Включений аналіз партії</Text>
                )
            }
            <View style={styles['historyMoves']}>
                { !analyze && (
                    <View style={styles['mainMoves']}>
                    {
                        notice.map((codeMove: string, index: number) => {
                            return (
                                <View key={'notice-fragment' + index} style={styles['pairMoves']}>
                                    {
                                    (index + 1) % 2 !== 0 ? (
                                        <Text style={{fontWeight: 'bold'}}>{Math.ceil((index + 1) / 2) + '. '}</Text>
                                    ) : <></>
                                    }
                                    <TouchableOpacity  onPress={() => goToStep(index + 1)} key={'notice' + index}>
                                        <Text style={getStyle(currentMove(index + 1))}>{codeMove + ''}</Text>
                                    </TouchableOpacity>
                                    {(index + 1) % 2 == 0 ? <Text>{' '}</Text> : <Text>{', '}</Text>}
                                </View>
                            )
                        })
                    }
                    </View>
                    )
                }
                { analyze && (analysis_notes.id ?? false) && (
                    <View style={styles['mainMoves']}>
                        <NoticeMove prevColor={analysis_notes.color} object={analysis_notes} analysisCurrentMove={analysisCurrentMove} goToAnalysisStep={goToAnalysisStep} />
                    </View>
                    )
                }
            </View>

            <View style={styles.wrapControl}>
                <View style={[isFirst && styles.disable]}>
                    <TouchableOpacity onPress={() => {
                        if (isFirst) {
                            return;
                        }
                        firstMove();
                    }}>
                        <Text>first move</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.separator}>|</Text>

                <View style={[!isPrev && styles.disable]}>
                    <TouchableOpacity onPress={() => {
                        if (!isPrev) {
                            return;
                        }
                        prevMove();
                    }}>
                        <Text>prev move</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.separator}>|</Text>

                <View style={[!isNext && styles.disable]}>
                    <TouchableOpacity onPress={() => {
                        if (!isNext) {
                            return;
                        }
                        nextMove();
                    }}>
                        <Text>next move</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.separator}>|</Text>

                <View style={[isLast && styles.disable]}>
                    <TouchableOpacity onPress={() => {
                        if (isLast) {
                            return;
                        }
                        lastMove();
                    }}>
                        <Text>last move</Text>
                    </TouchableOpacity>
                </View>
            </View>

            { !start &&
                <View style={[styles.wrapPngNotice, styles.containerTextarea]}>
                    <View>
                        <Input
                            style={styles.textarea}
                            multiline={true}
                            numberOfLines={4}
                            value={pgn}
                            onChangeText={setPgn}
                        />
                    </View>
                    <View>
                        <Button
                            title={'Load game'}
                            disabled={false}
                            onPress={async (e) => {
                                setAnalyze(true);
                                setStart(false);
                                await loadGameFromPngHistory();
                            }}
                        />
                    </View>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    containerTextarea: {
        flex: 1,
        padding: 20,
    },
    textarea: {
        height: 100, // Аналог `rows={10}`
        width: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
    },
    wrapNotice: {

    },
    disable: {
        opacity: 0.5
    },
    wrapControl: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    separator: {
        marginHorizontal: 10, // Відступи між роздільниками
        fontSize: 18,
        color: '#333',
    },
    pairMoves: {
        display: 'flex',
        flexDirection: 'row',
    },
    mainMoves: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    historyMoves: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    historyMovesCurrent: {
        fontWeight: 'bold',
        color: 'darkgoldenrod'
    },
    innerNoticeBlock: {
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },
    wrapPngNotice: {
        width: 520,
    },
    current: {
        fontWeight: 'bold',
        color: 'darkgoldenrod'
    },
    defaultStyle: {
        backgroundColor: "transparent",
    }
});


export default Notice;

