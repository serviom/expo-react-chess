import React, {createContext, FC, useEffect, useRef, useState} from 'react';
import BoardComponent, {BoardProps} from "./BoardComponent";
import {BLACK_WON, Board, WHITE_WON} from "../models/Board";
import Notice, {moveTree, NoticeProps} from "./Notice";
import {Text, useWindowDimensions} from "react-native";

import {
    setAnalysisNotice,
    setLastCell,
    setLastCodeMove,
    setLastMoveIsEnPassant,
    setNotice,
    setPrevCell
} from "@/features/board/boardSlice";

import {
    CastleTypes,
    END_GAME,
    fillMovesRecursive,
    getColorPlayerForFen,
    getEnPassantCell,
    getFenFigureSignBySymbol,
    getPruningCoordinateMove,
    getSystemCoordinateMoveByShort,
    isBlackMove,
    oneAnalysisMove,
    searchItemForAnalysisByDeep,
    searchItemForAnalysisByDeepAndId,
    searchItemForAnalysisById,
    searchItemRecursiveForLast
} from "../utils/board";

import {FenFigureSign, Figure, FigureSides, typeFenFigureSign} from "../models/figures/Figure";
import {Queen} from "../models/figures/Queen";
import {Knight} from "../models/figures/Knight";
import {Cell} from "../models/Cell";
import {BestMove, getBestmoveByStockfish} from "../utils/singletons/stockfish";
import {
    initialStateModePlayerOptions,
    ISelectOption,
    modePlayer, Player, SingleValue,
    ValueOf
} from "../types";
// import {ISelectOption} from "../ui-kit/Select";
import {getTimeInNumber} from "../utils/date";
import {Dimensions, StyleSheet, View} from "react-native";
import {RootState, useAppDispatch} from "@/features/store";
import {useSelector} from "react-redux";
import {removeDataInStorage, saveLastCodeMoveToStorage, storeDataInStorage} from "@/utils/storage";
import {CELL_SIZE, MODE, NOTES_LOCAL_STORAGE, PlayerTypes, ROTATE} from "@/constants";
import {ChessContext} from "@/initChessContext";
import Control from "@/components/Control";
import {useModal} from "@/providers/ModalProvider";
import ModalComponent from "@/components/ModalComponent";


const START_COUNTER = 0;
const START_FEN_STRING_CASTLE = 'KQkq';
const WHITE_SHORT_CASTLE_FEN = 'K';
const WHITE_LONG_CASTLE_FEN = 'Q'
const BLACK_SHORT_CASTLE_FEN = 'k';
const BLACK_LONG_CASTLE_FEN = 'q'

export type staticRefObject = {
    targetCell: Cell | null,
    selectedCell: Cell | null,
    selectedFigure: Figure | null,
    opponentFigure: Figure | null,
    switchEnPassant: boolean,
}

export const initialStaticRefObject = {
    targetCell: null,
    selectedCell: null,
    selectedFigure: null,
    opponentFigure: null,
    switchEnPassant: false
}

const Chess: FC = () => {
    const [pgn, setPgn] = useState(''); // Declare a state variable...
    const [board, setBoard] = useState(new Board());
    const [start, setStart] = useState<boolean>(false);
    const [finish, setFinish] = useState<boolean>(false);
    const [pause, setPause] = useState<boolean>(false);
    const [modeWhitePlayer, setModeWhitePlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);
    const [modeBlackPlayer, setModeBlackPlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);

    const [isOpenedSelectFigure, setIsOpenedSelectFigure] = useState(false);
    const [analyze, setAnalyze] = useState<boolean>(false);
    const [mode, setMode] = useState(MODE);
    const [rotate, setRotate] = useState(ROTATE);
    const whitePlayer = PlayerTypes.WHITE;
    const blackPlayer = PlayerTypes.BLACK;
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

    const dispatch = useAppDispatch();


    // показує поточну позицію в дереві ходів для гри
    const counterMove = useRef<number>(START_COUNTER);
    const startMoveTime = useRef<number | undefined>(undefined);
    const spentTimeForMove = useRef<number | undefined>(undefined);

    // показує поточну позицію в дереві ходів для аналізатора
    const counterAnalysisMove = useRef<number>(START_COUNTER);

    // counterAnalysisMoveIncrease завжди збільшується на 1 при кожному новому кроці для аналізу
    const counterAnalysisMoveIncrease = useRef<number>(START_COUNTER);

    const fenReportStringCastle = useRef<string>(START_FEN_STRING_CASTLE);
    const ruleOf50Moves = useRef<number>(START_COUNTER);
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    //const childRef = useRef<any>(null);

    const boardState = useSelector((state: RootState) => state.board);

    let myState = useRef<staticRefObject>(initialStaticRefObject);

    const [isNext, setIsNext] = useState<boolean>(false);
    const [isLast, setIsLast] = useState<boolean>(false);
    const [isPrev, setIsPrev] = useState<boolean>(false);
    const [isFirst, setIsFirst] = useState<boolean>(false);

    const [bestMove, setBestMove] = useState<BestMove | undefined>(undefined);
    const [cellSize, setCellSize] = useState<number>(CELL_SIZE);

    const { width, height } = useWindowDimensions();

    useEffect(() => {
        setCellSize(Math.floor(width/8));
    }, [width]);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (bestMove !== undefined && pause === false && analyze === false) {
            setSelectedCell(board.getCellByInterCoordinate(bestMove.from));
            moveOnClick(board.getCellByInterCoordinate(bestMove.from),
                board.getCellByInterCoordinate(bestMove.to), bestMove.promotion);
        }
    }, [bestMove]);

    useEffect(() => {
        if (!currentPlayer) {
            return;
        }

        if (startMoveTime.current !== undefined) {
            spentTimeForMove.current = getTimeInNumber() - startMoveTime.current;
        }

        startMoveTime.current = getTimeInNumber();

        setIsNext(checkIsNext());
        setIsLast(checkIsLast());
        setIsPrev(checkIsPrev());
        setIsFirst(checkIsFirst());

        setBestMove(undefined);

        // кінець ігри
        if (!analyze && start && !finish) {
            const {status, msg} = board.theEnd(currentPlayer);

            if (status) {
                // openModal(msg);
                setFinish(true);
                return;
            }

            if (pause) {
                return;
            }

            if (currentPlayer === PlayerTypes.WHITE && modeWhitePlayer?.value === modePlayer.AUTO ||
                currentPlayer === PlayerTypes.BLACK && modeBlackPlayer?.value === modePlayer.AUTO) {
                moveBestMove();
            }
        }
    }, [currentPlayer]);


    useEffect(() => {
        if (!pause) {
            moveBestMove();
        }
    }, [pause]);


    useEffect(() => {
        if (start) {
            setPgn('');
        }

    }, [start]);


    const timeOver = () => {
        const msg = currentPlayer === PlayerTypes.WHITE ? BLACK_WON : WHITE_WON;
        if (!finish) {
          //  openModal(msg);
        }
        setFinish(true);
        return;
    }

    const chessContext = {
        mode,
        currentPlayer,
        rotate,
        cellSize
    }

    function getAnalysisDeep() {
        const currentMoveTree = searchItemForAnalysisById(boardState.analysis_notes, counterAnalysisMove.current);

        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }

        return currentMoveTree.deep;
    }

    function getOppositeCurrentPlayer() {
        return currentPlayer === PlayerTypes.WHITE ? blackPlayer : whitePlayer;
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
        getBestmoveByStockfish(fen(analyze ? getAnalysisDeep() : counterMove.current + 1)).then((result: any) => {
            setBestMove(result);
        });
    }

    function changeRuleOf50Moves(mode: boolean): void {
        if (!mode) {
            ruleOf50Moves.current++;
            return;
        }
        ruleOf50Moves.current = 0;
    }

    function checkIsLast() {
        return analyze ? getLastIdMove() === counterAnalysisMove.current : numberOfLastMove() === counterMove.current;
    }

    function checkIsPrev() {
        return analyze ? counterAnalysisMove.current !== 1 : counterMove.current !== 1;
    }

    function checkIsFirst() {
        if (!analyze) {
            return counterMove.current === 1;
        }

        if (counterAnalysisMove.current === 1) {
            return true;
        }

        const currentMoveTree = searchItemForAnalysisById(boardState.analysis_notes, counterAnalysisMove.current);

        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }

        const currentMoveNextTree = searchItemForAnalysisByDeepAndId(boardState.analysis_notes, currentMoveTree.deep - 1, currentMoveTree.id - 1);

        if (!currentMoveNextTree) {
            return true;
        }

        return false;
    }

    function checkIsNext() {
        if (!analyze) {
            return counterMove.current !== numberOfLastMove();
        }

        if (counterAnalysisMove.current === counterAnalysisMoveIncrease.current) {
            return false;
        }

        const currentMoveTree = searchItemForAnalysisById(boardState.analysis_notes, counterAnalysisMove.current);

        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }

        if (!currentMoveTree.children || currentMoveTree.children.length === 0) {
            return false;
        }

        if (currentMoveTree.children.length > 1) {
            // якщо наступний крок це основна цепочка по якій була розіграна шахматна гра тоді він завжди доступний
            const currentMoveNextTree = searchItemForAnalysisById(boardState.analysis_notes, counterAnalysisMove.current + 1);
            if (currentMoveNextTree && currentMoveNextTree.index === 0) {
                return true;
            }

            return false
        }
        return true;
    }

    function finishMove() {
        unmarkEnPassantFigure();
        dispatch(setLastMoveIsEnPassant(myState.current.switchEnPassant));
        setSelectedCell(null);
        updateBoard();
        if (!analyze) {
            incrementCounter();
        }
        swapPlayer();
    }

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard)
    }

    function setFigure(FigureName: typeFenFigureSign) {
        const targetCell = myState.current.targetCell;
        const selectedCell = myState.current.selectedCell;
        const selectedFigure = myState.current.selectedFigure;
        const opponentFigure = myState.current.opponentFigure;

        if (!currentPlayer || targetCell === null || targetCell.figure === null || selectedCell === null) {
            return;
        }

        if (FenFigureSign.QUEEN === FigureName) {
            targetCell.addLostFigure();
            board.addFigureToArray(new Queen(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        if (FenFigureSign.KNIGHT === FigureName) {
            targetCell.addLostFigure();
            board.addFigureToArray(new Knight(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        const lastCodeMove = getPruningCoordinateMove(boardState, selectedCell, targetCell, selectedFigure, opponentFigure);
        wrapSaveLastCodeMove(lastCodeMove);
        finishMove();
    }

    function unmarkEnPassantFigure() {
        const cell = getEnPassantCell(board, boardState);
        if (cell !== null) {
            cell.enPassantFigure = false;
        }
    }

    async function moveOnClick(selectedCell: Cell, targetCell: Cell, promotion: string | null = null) {
        if (selectedCell.figure === null) {
            return;
        }

        // записуємо останній хід
        dispatch(setPrevCell(selectedCell.getCellInfo()));
        dispatch(setLastCell(targetCell.getCellInfo()));

        const switchEnPassant = moveIsEnPassant(selectedCell, targetCell);

        const selectedFigure = selectedCell.figure;
        const opponentFigure = targetCell.figure;

        myState.current = {
            targetCell,
            selectedCell,
            selectedFigure,
            opponentFigure,
            switchEnPassant
        }

        // якщо зроблений хід пішаком чи збито фігуру targetCell не була пустою
        // тоді ми обновляємо правило 50 ходів до 0
        changeRuleOf50Moves(selectedCell.figure.isPawn() || !targetCell.isEmpty());

        const lastCodeMove = selectedCell.moveFigure(targetCell, boardState);

        // lastCodeMove in Portable Game Notation
        if (lastCodeMove) {
            await wrapSaveLastCodeMove(lastCodeMove); // There is still a record in function setFigure
        }

        // promotion існує тільки в тому випадку якщо хід вже відомий наприклад він визначений stockfish-ом
        if (promotion) {
            setFigure(getFenFigureSignBySymbol(promotion));
            return;
        }

        if (targetCell.figure?.isPawn() && targetCell.isLastLineForTransforming(selectedFigure.color)) {
            setIsOpenedSelectFigure(true);
            return;
        }

        finishMove();
    }

    function moveIsEnPassant(selectedCell: Cell, target: Cell): boolean {
        if (!selectedCell.figure || !target) {
            return false;
        }

        return selectedCell.figure && selectedCell.figure.isPawn() && selectedCell.figure.isFirstStep === true
            && Math.abs(target.y - selectedCell.y) === 2;
    }

    function fen(counterMove: number): string {
        if (!currentPlayer) {
            return '';
        }

        let fen = board.partBoardFen();

        fen += ' ' + getColorPlayerForFen(currentPlayer) + ' ' + (fenReportStringCastle.current === '' ? '-' : fenReportStringCastle.current);

        const enPassantCell = getEnPassantCell(board, boardState);

        fen += ' ' + (enPassantCell !== null ? enPassantCell.interCoordinate : '-');

        fen += ' ' + ruleOf50Moves.current;

        fen += ' ' + (counterMove).toString();

        return fen;
    }

    function goToAnalysisEnd() {
        clearSelectedCell();
        goToAnalysisStep(counterAnalysisMoveIncrease.current);
    }

    async function init() {
        await clearNotice();
        setBoard(initNewBoard());
        counterMove.current = 0;
    }

    async function endGame() {
        setStart(false);
        setAnalyze(false);
        setCurrentPlayer(null);
        await init();
    }

    async function restart() {
        startMoveTime.current = undefined;
        spentTimeForMove.current = undefined;
        setStart(true);
        setFinish(false);
        setAnalyze(false);
        await init();
        setCurrentPlayer(whitePlayer);
    }

    function clearOpportunitiesCastleWhite() {
        fenReportStringCastle.current = fenReportStringCastle.current.replace(WHITE_SHORT_CASTLE_FEN, '');
        fenReportStringCastle.current = fenReportStringCastle.current.replace(WHITE_LONG_CASTLE_FEN, '');
    }

    function clearOpportunitiesCastleBlack() {
        fenReportStringCastle.current = fenReportStringCastle.current.replace(BLACK_SHORT_CASTLE_FEN, '');
        fenReportStringCastle.current = fenReportStringCastle.current.replace(BLACK_LONG_CASTLE_FEN, '');
    }

    function changeFenReportStringCastle(codeMove: string) {
        if (fenReportStringCastle.current === '') {
            return;
        }

        if (board.kingDidMove(PlayerTypes.WHITE)) {
            clearOpportunitiesCastleWhite();
        }

        if (board.kingDidMove(PlayerTypes.BLACK)) {
            clearOpportunitiesCastleBlack();
        }

        if (board.rookDidMove(PlayerTypes.WHITE, FigureSides.RIGHT)) {
            fenReportStringCastle.current = fenReportStringCastle.current.replace(WHITE_SHORT_CASTLE_FEN, '');
        }

        if (board.rookDidMove(PlayerTypes.WHITE, FigureSides.LEFT)) {
            fenReportStringCastle.current = fenReportStringCastle.current.replace(WHITE_LONG_CASTLE_FEN, '');
        }

        if (board.rookDidMove(PlayerTypes.BLACK, FigureSides.RIGHT)) {
            fenReportStringCastle.current = fenReportStringCastle.current.replace(BLACK_LONG_CASTLE_FEN, '');
        }

        if (board.rookDidMove(PlayerTypes.BLACK, FigureSides.LEFT)) {
            fenReportStringCastle.current = fenReportStringCastle.current.replace(BLACK_SHORT_CASTLE_FEN, '');
        }

        if (codeMove === CastleTypes.SHORT || codeMove === CastleTypes.LONG) {
            if (currentPlayer === PlayerTypes.WHITE) {
                clearOpportunitiesCastleWhite();
            }

            if (currentPlayer === PlayerTypes.BLACK) {
                clearOpportunitiesCastleBlack();
            }
        }
    }

    async function wrapSaveLastCodeMove(codeMove: string) {
        if (analyze) {
            saveLastAnalyzeCodeMove(codeMove);
            changeFenReportStringCastle(codeMove);
        } else if (currentMoveIsLast() && start) {
            await saveLastCodeMoveToStorage(codeMove);
            dispatch(setLastCodeMove(codeMove));
            changeFenReportStringCastle(codeMove);
        }
    }

    function incrementCounter() {
        counterMove.current = counterMove.current + 1;
    }

    function saveLastAnalyzeCodeMove(codeMove: string): void {
        counterAnalysisMoveIncrease.current++;
        const moveTree = JSON.parse(JSON.stringify(boardState.analysis_notes));
        console.log('moveTree', moveTree);
        const moves: string[] = [];
        const searchObject = fillMovesRecursive(moveTree, counterAnalysisMove.current, moves);
        if (!searchObject) {
            return;
        }

        if (searchObject.children === null) {
            searchObject.children = [];
        }

        const virtualItem = searchObject.children.find((item: any) => item.value === '*');

        if (virtualItem) {
            virtualItem.value = codeMove;
            dispatch(setAnalysisNotice(moveTree));
            counterAnalysisMove.current = virtualItem.id;
            return;
        }

        const isMoveInAnalysis = searchObject.children.find((item: any) => item.value === codeMove);

        if (isMoveInAnalysis) {
            counterAnalysisMove.current = isMoveInAnalysis.id;
            return;
        }

        searchObject.children.unshift({
            value: codeMove,
            color: searchObject.color === PlayerTypes.BLACK ? PlayerTypes.WHITE : PlayerTypes.BLACK,
            deep: searchObject.deep + 1,
            index: searchObject.children.length,
            id: counterAnalysisMoveIncrease.current,
            children: []
        });

        dispatch(setAnalysisNotice(moveTree));
        counterAnalysisMove.current = counterAnalysisMoveIncrease.current;
    }

    function changeMode(selectedMode: number) {
        setMode(selectedMode);
    }

    function switchRotate() {
        setRotate(!rotate);
    }

    function swapPlayer() {
        setCurrentPlayer(prev => (prev === PlayerTypes.WHITE ? blackPlayer : whitePlayer));
    }

    async function clearNotice(): Promise<void> {
        dispatch(setNotice([]));
        await removeDataInStorage(NOTES_LOCAL_STORAGE);
    }

    function currentMoveIsLast(): boolean {
        return boardState.notice.length === counterMove.current;
    }

    function currentMoveAnalysisIsLast(): boolean {
        return boardState.notice.length === counterAnalysisMove.current;
    }

    function numberOfLastMove(): number {
        return boardState.notice.length;
    }

    function getLastIdMove(): number | null {
        const currentMoveTree = searchItemForAnalysisById(boardState.analysis_notes, counterAnalysisMove.current);
        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }
        return searchItemRecursiveForLast(currentMoveTree)?.id ?? null;
    }

    function clearSelectedCell() {
        setSelectedCell(null)
        // TODO not use useImperativeHandle hook
        // childRef.current?.clearSelectedCell();
    }

    function getFirstAnalysisStep() {
        const currentTreeMove = searchItemForAnalysisById(boardState.analysis_notes, counterAnalysisMove.current);

        if (!currentTreeMove) {
            throw new Error('currentTreeMove is null');
        }

        let parentTreeMove = searchItemForAnalysisByDeepAndId(boardState.analysis_notes, currentTreeMove.deep - 1, currentTreeMove.id - 1);

        if (!parentTreeMove) {
            return currentTreeMove.id;
        }

        let id: number = parentTreeMove.id;

        while (true) {
            const parentTreeMoveNew = searchItemForAnalysisByDeepAndId(boardState.analysis_notes, parentTreeMove.deep - 1, parentTreeMove.id - 1);

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

    function getNextAnalysisStep() {
        return counterAnalysisMove.current + 1;
    }

    function getPrevAnalysisStep() {
        const currentTreeMove = searchItemForAnalysisById(boardState.analysis_notes, counterAnalysisMove.current);

        if (!currentTreeMove || currentTreeMove.deep < 1 || currentTreeMove.id < 1) {
            throw new Error('currentTreeMove is null');
        }

        let parentTreeMove = searchItemForAnalysisByDeepAndId(boardState.analysis_notes, currentTreeMove.deep - 1, currentTreeMove.id - 1);

        if (!parentTreeMove) {
            parentTreeMove = searchItemForAnalysisByDeep(boardState.analysis_notes, currentTreeMove.deep - 1);
        }

        if (!parentTreeMove) {
            throw new Error('parentTreeMove is null');
        }

        return parentTreeMove.id;
    }

    function nextMove(): void {
        clearSelectedCell();

        if (!analyze && currentMoveIsLast()) {
            return;
        }

        if (analyze && currentMoveAnalysisIsLast()) {
            return;
        }

        const newStep = analyze ? getNextAnalysisStep() : counterMove.current + 1;
        wrapGoToStep(newStep);
    }

    function prevMove(): void {
        clearSelectedCell();

        const newStep = analyze ? getPrevAnalysisStep() : counterMove.current - 1;
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

    function initNewBoard(): Board {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        fenReportStringCastle.current = START_FEN_STRING_CASTLE;
        ruleOf50Moves.current = 0;
        dispatch(setLastMoveIsEnPassant(false));
        return newBoard;
    }

    function wrapGoToStep(step: number): void {
        if (analyze) {
            goToAnalysisStep(step);
            return;
        }
        goToStep(step);
    }

    function goToAnalysisStep(step: number): void {
        const moves: string[] = [];
        const notes = boardState.analysis_notes;
        const lastObject = fillMovesRecursive(notes, step, moves);

        clearSelectedCell();
        const newBoard = initNewBoard();

        moves.forEach((codeMove, index) => {
            if (codeMove && codeMove !== END_GAME) {
                wrapOneMoveForNotice(codeMove, newBoard, isBlackMove(index + 1));
            }
        });

        setBoard(newBoard);
        counterAnalysisMove.current = step;

        setCurrentPlayer(isBlackMove(moves.length) ? whitePlayer : blackPlayer);
    }

    function wrapOneMoveForNotice(codeMove: string, board: Board, isBlack: boolean): void {
        changeFenReportStringCastle(codeMove);

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

        changeRuleOf50Moves(cellPrev.figure.isPawn() || !cellNext.isEmpty());

        cellPrev.figure.moveFigure(cellNext);
        oneAnalysisMove(cellPrev, cellNext, moveCoordinate, codeMove, board, isBlack);

        const switchEnPassant = moveIsEnPassant(cellPrev, cellNext);
        dispatch(setLastMoveIsEnPassant(switchEnPassant));

        dispatch(setPrevCell(cellPrev.getCellInfo()));
        dispatch(setLastCell(cellNext.getCellInfo()));
    }

    function goToStep(step: number): void {
        clearSelectedCell();
        if (step === counterMove.current) {
            return;
        }

        const newBoard = step < counterMove.current ? initNewBoard() : board.getCopyBoard();

        if (step < counterMove.current) {
            counterMove.current = 0;
        }

        while (counterMove.current < step) {
            incrementCounter();
            const codeMove = boardState.notice[counterMove.current - 1] ?? '';

            if (codeMove && codeMove !== END_GAME) {
                wrapOneMoveForNotice(codeMove, newBoard, isBlackMove(counterMove.current));
            }
        }

        setBoard(newBoard);
        setCurrentPlayer(isBlackMove(counterMove.current) ? whitePlayer : blackPlayer);
    }

    function loadAnalyze(position: number): void {
        counterAnalysisMoveIncrease.current = position;
        goToAnalysisEnd();
    }

    const propsForNotice : NoticeProps = {
        nextMove,
        prevMove,
        firstMove,
        lastMove,
        goToStep,
        setAnalyze,
        setStart,
        pgn,
        setPgn,
        analyze,
        start,
        counter: counterMove.current,
        counterAnalysisMove,
        goToAnalysisStep,
        isNext,
        isLast,
        isPrev,
        loadAnalyze,
        isFirst,
    }

    const props: BoardProps = {
        board,
        currentPlayer,
        counter: counterMove.current,
        analyze,
        start,
        currentMoveIsLast,
        moveOnClick,
        setFigure,
        updateBoard,
        myState,
        selectedCell,
        setSelectedCell,
        isOpenedSelectFigure,
        setIsOpenedSelectFigure
    }

    function getSeconds() {
        const now = new Date();
        return now.getSeconds();
    }

    return (
        <View>
            <View>
                <Text>{getSeconds()}</Text>

                <Control
                    restart={restart}
                    changeMode={changeMode}
                    currentPlayer={currentPlayer}
                    mode={mode}
                    rotate={rotate}
                    start={start}
                    switchRotate={switchRotate}
                    endGame={endGame}
                    modeWhitePlayer={modeWhitePlayer}
                    setModeWhitePlayer={setModeWhitePlayer}
                    modeBlackPlayer={modeBlackPlayer}
                    setModeBlackPlayer={setModeBlackPlayer}
                    showBestMove={showBestMove}
                    moveBestMove={moveBestMove}
                    bestMove={bestMove}
                    pause={pause}
                    setPause={setPause}
                    spentTimeForMove={spentTimeForMove.current}
                    timeOver={timeOver}
                    finish={finish}
                    analyze={analyze}
                />
            </View>
            <View>
                <Notice
                    {...propsForNotice}
                />
            </View>
            <View>
                <ChessContext.Provider value={chessContext}>
                    <BoardComponent  {...props} />
                    <View>
                        {/*<LostFigures*/}
                        {/*    title="Чорні фігури"*/}
                        {/*    figures={board.lostBlackFigures}*/}
                        {/*/>*/}
                        {/*<LostFigures*/}
                        {/*    title="Білі фігури"*/}
                        {/*    figures={board.lostWhiteFigures}*/}
                        {/*/>*/}
                    </View>
                </ChessContext.Provider>
            </View>
        </View>
    );
};

export default Chess;