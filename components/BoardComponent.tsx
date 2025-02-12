import React, {useCallback, useEffect, useRef} from 'react';
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {FenFigureSign, Figure, FigureSides, typeFenFigureSign} from "../models/figures/Figure";
// import {PopupBoxSelectFigureComponent} from "./PopupBoxSelectFigureComponent";
import {StyleSheet, Text, View} from "react-native";

import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";
import {
    BoardState,
    resetGame,
    setAnalysisNotice,
    setLastCell,
    setLastCodeMove,
    setLastMoveIsEnPassant,
    setNotice,
    setPrevCell
} from "@/features/board/boardSlice";

import {NOTES_LOCAL_STORAGE, PlayerTypes} from "@/constants";
import {modePlayer} from "@/types";
import {
    changeRuleOf50Moves,
    fillMovesRecursive,
    getColorPlayerForFen,
    getEnPassantCell,
    getFenFigureSignBySymbol,
    getPruningCoordinateMove,
    makeCoordinateByLine,
    moveIsEnPassant,
    searchItemForAnalysisById
} from "@/utils/board";
import ModalComponent from "@/components/ModalComponent";
import {useControl} from "@/providers/ControlProvider";
import {removeDataInStorage, saveLastCodeMoveToStorage} from "@/utils/storage";
import {useModal} from "@/providers/ModalProvider";
import {getBestmoveByStockfish} from "@/utils/singletons/stockfish";
import {Queen} from "@/models/figures/Queen";
import {Knight} from "@/models/figures/Knight";
import {useCounters} from "@/providers/CountersProvider";

export interface BoardProps {}

export type staticRefObject = {
    targetCell: Cell | null,
    selectedCell: Cell | null,
    selectedFigure: Figure | null,
    opponentFigure: Figure | null,
    switchEnPassant: boolean,
}

const initialStaticRefObject = {
    targetCell: null,
    selectedCell: null,
    selectedFigure: null,
    opponentFigure: null,
    switchEnPassant: false
}


//const BoardComponent = forwardRef((props: BoardProps, ref) => {
const BoardComponent = (props: BoardProps) => {
    const {} = props;
    const {rotate, cellSize, selectedCell, setSelectedCell, currentPlayer, setCurrentPlayer, modeWhitePlayer, modeBlackPlayer} = useControl();
    const boardState = useSelector((state: RootState) => state.board);
    const {start, analyze, pause} = useSelector((state: RootState) => state.control);
    const {board, setBoard, counterMove, ruleOf50Moves, fenReportStringCastle,
        counterAnalysisMoveIncrease, setCounterAnalysisMoveIncrease, counterAnalysisMove, setCounterAnalysisMove,
        setRuleOf50Moves, setCounterMove} = useCounters();

    const dispatch = useAppDispatch();

    const {openModal} = useModal();

    let myState = useRef<staticRefObject>(initialStaticRefObject);

    // useImperativeHandle(ref, () => ({
    //     clearSelectedCell(): void  {
    //         setSelectedCell(null);
    //     }
    // }));

    if(!board.current) {
        return;
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (currentPlayer) {
            board.current.highlightCells(selectedCell, currentPlayer, boardState as BoardState);
            updateBoard()
        }
    }, [selectedCell]);

    useEffect(() => {
        if (!pause) {
            //moveBestMove();
        }
    }, [pause]);

    useEffect(() => {
        if (!currentPlayer || !start) {
            return;
        }

        // setBestMove(undefined);

        // кінець ігри
        if (!analyze && start) {
            const {status, msg} = board.current.theEnd(currentPlayer);

            if (status) {
                openModal(msg);
                dispatch(resetGame());
                return;
            }

            if (pause) {
                return;
            }

            if (currentPlayer === PlayerTypes.WHITE && modeWhitePlayer?.value === modePlayer.AUTO ||
                currentPlayer === PlayerTypes.BLACK && modeBlackPlayer?.value === modePlayer.AUTO) {
                //moveBestMove();
            }
        }
    }, [currentPlayer, start]);

    async function init() {
        await clearNotice();
        board.current.reset();
        debugger
        dispatch(setLastMoveIsEnPassant(false));
    }

    async function clearNotice(): Promise<void> {
        dispatch(setNotice([]));
        await removeDataInStorage(NOTES_LOCAL_STORAGE);
    }

    function currentMoveIsLast(): boolean {
        return boardState.notice.length === counterMove.current
    }

    const clickHandler = useCallback((colIndex: number, rowIndex: number): void => {
        const targetCell = board.current.getCell(rowIndex, colIndex);

        if (!currentPlayer) {
            return;
        }

        if (selectedCell && selectedCell !== targetCell && selectedCell.figure !== null
            && board.current.playerCanMove(selectedCell, targetCell, currentPlayer)
        ) {
            moveOnClick(selectedCell, targetCell, null);
        } else {
            if (start && !currentMoveIsLast()) {
                return;
            }
            if (targetCell.figure?.color === currentPlayer) {
                setSelectedCell(targetCell);
            }
        }
    }, [selectedCell, currentPlayer, start, board]);

    // function getPlayerStatus_old(): string {
    //     return analyze && currentPlayer === PlayerTypes.WHITE || !analyze && counter % 2 === 0 ? 'Хід білих' : 'Хід чорних';
    // }

    function getPlayerStatus(): string {
        return currentPlayer === PlayerTypes.WHITE ? 'Хід білих' : 'Хід чорних';
    }

    function getAnalysisDeep() {
        const currentMoveTree = searchItemForAnalysisById(boardState.analysis_notes, counterAnalysisMove.current);

        if (!currentMoveTree) {
            throw new Error('currentMoveTree is null');
        }

        return currentMoveTree.deep;
    }

    function getOppositeCurrentPlayer() {
        return currentPlayer === PlayerTypes.WHITE ? PlayerTypes.BLACK : PlayerTypes.WHITE;
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
            //setBestMove(result);
        });
    }

    function fen(counterMove: number): string {
        if (!currentPlayer) {
            return '';
        }

        let fen = board.current.partBoardFen();

        fen += ' ' + getColorPlayerForFen(currentPlayer) + ' ' + (fenReportStringCastle.current === '' ? '-' : fenReportStringCastle.current);

        const enPassantCell = getEnPassantCell(board.current, boardState);

        fen += ' ' + (enPassantCell !== null ? enPassantCell.interCoordinate : '-');

        fen += ' ' + ruleOf50Moves.current;

        fen += ' ' + (counterMove).toString();

        return fen;
    }


    function unmarkEnPassantFigure() {
        const cell = getEnPassantCell(board.current, boardState);
        if (cell !== null) {
            cell.enPassantFigure = false;
        }
    }

    async function setFigure(FigureName: typeFenFigureSign) {
        const targetCell = myState.current.targetCell;
        const selectedCell = myState.current.selectedCell;
        const selectedFigure = myState.current.selectedFigure;
        const opponentFigure = myState.current.opponentFigure;

        if (!currentPlayer || targetCell === null || targetCell.figure === null || selectedCell === null) {
            return;
        }

        if (FenFigureSign.QUEEN === FigureName) {
            targetCell.addLostFigure();
            board.current.addFigureToArray(new Queen(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        if (FenFigureSign.KNIGHT === FigureName) {
            targetCell.addLostFigure();
            board.current.addFigureToArray(new Knight(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        const lastCodeMove = getPruningCoordinateMove(boardState, selectedCell, targetCell, selectedFigure, opponentFigure);
        await wrapSaveLastCodeMove(lastCodeMove);
        finishMove();
    }

    function updateBoard() {
        setBoard(board.current.getCopyBoard());
    }

    function finishMove() {
        unmarkEnPassantFigure();
        dispatch(setLastMoveIsEnPassant(myState.current.switchEnPassant));
        setSelectedCell(null);
        updateBoard();
        if (!analyze) {
            setCounterMove(counterMove.current + 1);
        }
        swapPlayer();
    }

    function swapPlayer() {
        setCurrentPlayer(currentPlayer === PlayerTypes.WHITE ? PlayerTypes.BLACK : PlayerTypes.WHITE);
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
        setRuleOf50Moves(changeRuleOf50Moves(selectedCell, targetCell, board))

        const lastCodeMove = selectedCell.moveFigure(targetCell, boardState);

        // lastCodeMove in Portable Game Notation
        if (lastCodeMove) {
            await wrapSaveLastCodeMove(lastCodeMove); // There is still a record in function setFigure
        }

        // promotion існує тільки в тому випадку якщо хід вже відомий наприклад він визначений stockfish-ом
        if (promotion) {
            await setFigure(getFenFigureSignBySymbol(promotion));
            return;
        }

        if (targetCell.figure?.isPawn() && targetCell.isLastLineForTransforming(selectedFigure.color)) {
            //setIsOpenedSelectFigure(true);
            return;
        }

        finishMove();
    }

    async function wrapSaveLastCodeMove(codeMove: string) {
        if (analyze) {
            saveLastAnalyzeCodeMove(codeMove);
            board.current.changeFenReportStringCastle(codeMove, currentPlayer);
        } else if (currentMoveIsLast() && start) {
            await saveLastCodeMoveToStorage(codeMove);
            dispatch(setLastCodeMove(codeMove));
            board.current.changeFenReportStringCastle(codeMove, currentPlayer);
        }
    }

    function saveLastAnalyzeCodeMove(codeMove: string): void {
        setCounterAnalysisMoveIncrease(counterAnalysisMoveIncrease.current + 1);
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
            setCounterAnalysisMove(virtualItem.id);
            return;
        }

        const isMoveInAnalysis = searchObject.children.find((item: any) => item.value === codeMove);

        if (isMoveInAnalysis) {
            setCounterAnalysisMove(isMoveInAnalysis.id);
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
        setCounterAnalysisMove(counterAnalysisMoveIncrease.current)
    }

    function getSeconds() {
        const now = new Date();
        return now.getSeconds();
    }

    function getCells() {
        return board.current.cells;
    }

    const styles = StyleSheet.create({
        wrapperPlayPlace: {
            flex: 1,
            alignItems: 'center',
        },
        header: {
            textAlign: 'center',
            marginBottom: 10,
        },
        headerText: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        playPlace: {
            flexDirection: 'row',
            width: "100%",
        },
        rotate180: {
            transform: [{ rotate: '180deg' }],
        },
        markingVert: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        markingHorWrap: {
            flexDirection: 'column',
        },
        markingHor: {
            flexDirection: 'row',
        },
        wrapBoard: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            width: cellSize * 8,
            height: cellSize * 8,
        },
        board: {
            flexDirection: 'column',
        },
        wrapCell: {
            flexDirection: 'row',
        }
    });

    return (
        <View style={styles.wrapperPlayPlace}>
            <Text>{getSeconds()}</Text>
            <ModalComponent />
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>{getPlayerStatus()}</Text>
            </View>
            {/* Play Place */}
            <View style={[styles.playPlace, rotate && styles.rotate180]}>
                <View style={styles.wrapBoard}>
                    <View style={styles.board}>
                        {board.current.cells.map((row: any, colIndex: any) => (
                            <View key={`col-${colIndex}`} style={styles.wrapCell}>
                                {row.map((cell: any, rowIndex: any) => (
                                    <CellComponent
                                        isHighlightPrev={boardState.prevCell !== null &&
                                            cell.coordinateByLine === makeCoordinateByLine(boardState.prevCell.x, boardState.prevCell.y)}
                                        isHighlightLast={boardState.lastCell !== null &&
                                            cell.coordinateByLine === makeCoordinateByLine(boardState.lastCell.x, boardState.lastCell.y)}
                                        available={cell.available}
                                        isEnPassantFigure={cell.isEnPassantFigure}
                                        isFigure={cell.isFigure}
                                        figureNameEn={cell.getFigureNameEn}
                                        figureColor={cell.getFigureColor}
                                        rowIndex={rowIndex}
                                        colIndex={colIndex}
                                        click={() => clickHandler(colIndex, rowIndex)}
                                        cellColor={cell.color}
                                        key={`cell-${colIndex}-${rowIndex}`}
                                        selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default BoardComponent;


