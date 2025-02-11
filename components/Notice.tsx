import React, {FC, useEffect, useState} from "react";
import {
    setAnalysisNotice,
    setLastCell,
    setLastMoveIsEnPassant,
    setNotice,
    setPrevCell
} from "@/features/board/boardSlice";
import {setStart, setAnalyze} from "@/features/control/controlSlice";
import {NoticeMove} from "./includes/NoticeMove";
import {
    CastleTypes, changeRuleOf50Moves,
    END_GAME,
    fillMovesRecursive,
    getSystemCoordinateMoveByShort,
    isBlackMove,
    moveIsEnPassant,
    oneAnalysisMove,
    searchItemForAnalysisByDeep,
    searchItemForAnalysisByDeepAndId,
    searchItemForAnalysisById,
    searchItemRecursiveForLast,
    searchMustItemForAnalysisById
} from "../utils/board";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Input} from "@rneui/themed";
import {RootState, useAppDispatch} from "@/features/store";
import {useSelector} from "react-redux";
import {storeDataInStorage} from "@/utils/storage";

import {KEY_NOTES_LOCAL_STORAGE, NOTES_LOCAL_STORAGE, PlayerTypes, VALUE_NOTES_LOCAL_STORAGE} from "@/constants";
import {Player} from "@/types";
import {useControl} from "@/providers/ControlProvider";
import {Board} from "@/models/Board";

export interface NoticeProps {}

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

const Notice: FC<NoticeProps> = ({}:NoticeProps) => {
    const [pgn, setPgn] = useState('');
    const {currentPlayer, board, selectedCell, setSelectedCell, initNewBoard, setCurrentPlayer} = useControl();

    const [isNext, setIsNext] = useState<boolean>(false);
    const [isLast, setIsLast] = useState<boolean>(false);
    const [isPrev, setIsPrev] = useState<boolean>(false);
    const [isFirst, setIsFirst] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const {notice, analysis_notes} = useSelector((state: RootState) => state.board);
    const {start, analyze} = useSelector((state: RootState) => state.control);

    useEffect(() => {
        if (start) {
            setPgn('');
        }
    }, [start]);

    useEffect(() => {
        if (!currentPlayer || !start) {
            return;
        }
        setIsNext(checkIsNext());
        setIsLast(checkIsLast());
        setIsPrev(checkIsPrev());
        setIsFirst(checkIsFirst());

    }, [currentPlayer, start]);

    function numberOfLastMove(): number {
        return notice.length;
    }

    function checkIsNext() {
        if (!analyze) {
            return board.current.counterMove !== numberOfLastMove();
        }

        if (board.current.counterAnalysisMove === board.current.counterAnalysisMoveIncrease) {
            return false;
        }

        const currentMoveTree = searchItemForAnalysisById(analysis_notes, board.current.counterAnalysisMove);

        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }

        if (!currentMoveTree.children || currentMoveTree.children.length === 0) {
            return false;
        }

        if (currentMoveTree.children.length > 1) {
            // якщо наступний крок це основна цепочка по якій була розіграна шахматна гра тоді він завжди доступний
            const currentMoveNextTree = searchItemForAnalysisById(analysis_notes, board.current.counterAnalysisMove + 1);
            if (currentMoveNextTree && currentMoveNextTree.index === 0) {
                return true;
            }

            return false
        }
        return true;
    }

    function checkIsLast() {
        return analyze ? getLastIdMove() === board.current.counterAnalysisMove : numberOfLastMove() === board.current.counterMove;
    }

    function getLastIdMove(): number | null {
        const currentMoveTree = searchItemForAnalysisById(analysis_notes, board.current.counterAnalysisMove);
        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }
        return searchItemRecursiveForLast(currentMoveTree)?.id ?? null;
    }

    function checkIsPrev() {
        return analyze ? board.current.counterAnalysisMove !== 1 : board.current.counterMove !== 1;
    }

    function checkIsFirst() {
        if (!analyze) {
            return board.current.counterMove === 1;
        }

        if (board.current.counterAnalysisMove === 1) {
            return true;
        }

        const currentMoveTree = searchItemForAnalysisById(analysis_notes, board.current.counterAnalysisMove);

        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }

        const currentMoveNextTree = searchItemForAnalysisByDeepAndId(analysis_notes, currentMoveTree.deep - 1, currentMoveTree.id - 1);

        if (!currentMoveNextTree) {
            return true;
        }

        return false;
    }

    function clearSelectedCell() {
        setSelectedCell(null)
        // TODO not use useImperativeHandle hook
        // childRef.current?.clearSelectedCell();
    }

    function currentMoveIsLast(): boolean {
        return notice.length === board.current.counterMove;
    }

    function currentMoveAnalysisIsLast(): boolean {
        return notice.length === board.current.counterAnalysisMove;
    }

    function getNextAnalysisStep() {
        return board.current.counterAnalysisMove;
    }

    function getPrevAnalysisStep() {
        const currentTreeMove = searchItemForAnalysisById(analysis_notes, board.current.counterAnalysisMove);

        if (!currentTreeMove || currentTreeMove.deep < 1 || currentTreeMove.id < 1) {
            throw new Error('currentTreeMove is null');
        }

        let parentTreeMove = searchItemForAnalysisByDeepAndId(analysis_notes, currentTreeMove.deep - 1, currentTreeMove.id - 1);

        if (!parentTreeMove) {
            parentTreeMove = searchItemForAnalysisByDeep(analysis_notes, currentTreeMove.deep - 1);
        }

        if (!parentTreeMove) {
            throw new Error('parentTreeMove is null');
        }

        return parentTreeMove.id;
    }

    function getFirstAnalysisStep() {
        const currentTreeMove = searchItemForAnalysisById(analysis_notes, board.current.counterAnalysisMove);

        if (!currentTreeMove) {
            throw new Error('currentTreeMove is null');
        }

        let parentTreeMove = searchItemForAnalysisByDeepAndId(analysis_notes, currentTreeMove.deep - 1, currentTreeMove.id - 1);

        if (!parentTreeMove) {
            return currentTreeMove.id;
        }

        let id: number = parentTreeMove.id;

        while (true) {
            const parentTreeMoveNew = searchItemForAnalysisByDeepAndId(analysis_notes, parentTreeMove.deep - 1, parentTreeMove.id - 1);

            if (parentTreeMoveNew === null) {
                break;
            }

            if (parentTreeMoveNew) {
                id = parentTreeMoveNew.id;
                parentTreeMove = parentTreeMoveNew;
            }
        }

        return id;
    }

    function prevMove(): void {
        clearSelectedCell();

        const newStep = analyze ? getPrevAnalysisStep() : board.current.counterMove - 1;

        console.log('prevMove newStep', newStep);
        if (newStep === 0) {
            return;
        }
        wrapGoToStep(newStep);
    }

    function lastMove(): void {
        clearSelectedCell();
        const lastIdMove = analyze ? getLastIdMove() : numberOfLastMove();

        if (!lastIdMove) {
            return;
        }

        wrapGoToStep(lastIdMove);
    }

    function firstMove(): void {
        clearSelectedCell();
        wrapGoToStep(analyze ? getFirstAnalysisStep() : 1);
    }

    function nextMove(): void {
        clearSelectedCell();

        if (!analyze && currentMoveIsLast()) {
            return;
        }

        if (analyze && currentMoveAnalysisIsLast()) {
            return;
        }

        const newStep = analyze ? getNextAnalysisStep() : board.current.counterMove + 1;

        console.log('newStep', newStep);
        wrapGoToStep(newStep);
    }

    function wrapGoToStep(step: number): void {
        if (analyze) {
            goToAnalysisStep(step);
            return;
        }
        goToStep(step);
    }

    function loadAnalyze(position: number): void {
        board.current.counterAnalysisMoveIncrease = position;
        goToAnalysisEnd();
    }

    function goToAnalysisEnd() {
        clearSelectedCell();
        goToAnalysisStep(board.current.counterAnalysisMoveIncrease);
    }

    function incrementCounter() {
        board.current.counterMove = board.current.counterMove + 1;
    }

    function goToStep(step: number): void {
        clearSelectedCell();
        if (step === board.current.counterMove) {
            return;
        }

        console.log('board.current.counterMove', board.current.counterMove);

        const newBoard = step < board.current.counterMove ? initNewBoard() : board.current.getCopyBoard();

        debugger

        if (step < board.current.counterMove) {
            board.current.counterMove = 0;
        }

        while (board.current.counterMove < step) {
            incrementCounter();
            const codeMove = notice[board.current.counterMove - 1] ?? '';

            if (codeMove && codeMove !== END_GAME) {
                wrapOneMoveForNotice(codeMove, newBoard, isBlackMove(board.current.counterMove));
            }
        }

        board.current = newBoard;
        setCurrentPlayer(isBlackMove(board.current.counterMove) ? PlayerTypes.WHITE : PlayerTypes.BLACK);
    }

    function wrapOneMoveForNotice(codeMove: string, board: Board, isBlack: boolean): void {

        board.changeFenReportStringCastle(codeMove, currentPlayer);

        if (codeMove === CastleTypes.LONG || codeMove === CastleTypes.SHORT) {
            board.castleMove(isBlack, codeMove === CastleTypes.LONG);
            return;
        }

        const moveCoordinate = getSystemCoordinateMoveByShort(codeMove, board, isBlack);
        const cellPrev = board.getCell(moveCoordinate.from.x, moveCoordinate.from.y);

        if (!cellPrev.figure) {
            throw new Error('cellPrev.figure is null');
        }

        const cellNext = board.getCell(moveCoordinate.to.x, moveCoordinate.to.y);

        board.ruleOf50Moves = changeRuleOf50Moves(cellPrev, cellNext, board);

        cellPrev.figure.moveFigure(cellNext);
        oneAnalysisMove(cellPrev, cellNext, moveCoordinate, codeMove, board, isBlack);

        const switchEnPassant = moveIsEnPassant(cellPrev, cellNext);

        dispatch(setLastMoveIsEnPassant(switchEnPassant));
        dispatch(setPrevCell(cellPrev.getCellInfo()));
        dispatch(setLastCell(cellNext.getCellInfo()));
    }


    function goToAnalysisStep(step: number): void {
        const moves: string[] = [];
        const notes = analysis_notes;
        const lastObject = fillMovesRecursive(notes, step, moves);

        clearSelectedCell();
        const newBoard = initNewBoard();

        moves.forEach((codeMove, index) => {
            if (codeMove && codeMove !== END_GAME) {
                wrapOneMoveForNotice(codeMove, newBoard, isBlackMove(index + 1));
            }
        });

        board.current = newBoard;
        board.current.counterAnalysisMove = step;

        setCurrentPlayer(isBlackMove(moves.length) ? PlayerTypes.WHITE : PlayerTypes.BLACK);
    }

    function currentMove(step: number): boolean {
        return step === board.current.counter;
    }

    function analysisCurrentMove(step: number): boolean {
        return step === board.current.counterAnalysisMove;
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
                                setStart();
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

