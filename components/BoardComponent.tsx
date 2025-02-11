import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {FenFigureSign, Figure, FigureSides, typeFenFigureSign} from "../models/figures/Figure";
// import {PopupBoxSelectFigureComponent} from "./PopupBoxSelectFigureComponent";
import {StyleSheet, Text, View} from "react-native";

import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";
import {
    BoardState,
    resetGame, setAnalysisNotice,
    setLastCell, setLastCodeMove,
    setLastMoveIsEnPassant,
    setNotice,
    setPrevCell
} from "@/features/board/boardSlice";

import {NOTES_LOCAL_STORAGE, PlayerTypes} from "@/constants";
import {modePlayer, Player} from "@/types";
import {
    CastleTypes, changeRuleOf50Moves,
    END_GAME,
    fillMovesRecursive,
    getColorPlayerForFen,
    getEnPassantCell,
    getFenFigureSignBySymbol,
    getPruningCoordinateMove,
    getSystemCoordinateMoveByShort,
    isBlackMove,
    makeCoordinateByLine, moveIsEnPassant,
    oneAnalysisMove,
    searchItemForAnalysisByDeep,
    searchItemForAnalysisByDeepAndId,
    searchItemForAnalysisById,
    searchItemRecursiveForLast
} from "@/utils/board";
import ModalComponent from "@/components/ModalComponent";
import {useControl} from "@/providers/ControlProvider";
import {removeDataInStorage, saveLastCodeMoveToStorage} from "@/utils/storage";
import {useModal} from "@/providers/ModalProvider";
import {getBestmoveByStockfish} from "@/utils/singletons/stockfish";
import {Queen} from "@/models/figures/Queen";
import {Knight} from "@/models/figures/Knight";

export interface BoardProps {
    // isOpenedSelectFigure: boolean;
    // setIsOpenedSelectFigure: (state: boolean) => void;
    // counter: number;
    // currentMoveIsLast: () => boolean;
    // moveOnClick: (selectedCell: Cell, targetCell: Cell, promotion: string | null) => void;
    // myState: React.RefObject<staticRefObject>;
    // setFigure: (FigureName: typeFenFigureSign) => void;
    // updateBoard: () => void;
    // selectedCell: Cell | null;
    // setSelectedCell: (cell: Cell | null) => void;
}

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

    const {board, currentPlayer, setCurrentPlayer, modeWhitePlayer, modeBlackPlayer} = useControl();

    const boardState = useSelector((state: RootState) => state.board);
    const {start, analyze, pause} = useSelector((state: RootState) => state.control);
    const {rotate, cellSize, selectedCell, setSelectedCell, endGame, restartGame, initNewBoard} = useControl();

    const dispatch = useAppDispatch();

    const {openModal} = useModal();

    let myState = useRef<staticRefObject>(initialStaticRefObject);

    // useImperativeHandle(ref, () => ({
    //     clearSelectedCell(): void  {
    //         setSelectedCell(null);
    //     }
    // }));


    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (currentPlayer) {
            board.current.highlightCells(selectedCell, currentPlayer, boardState as BoardState);
            //updateBoard()
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
        board.current = initNewBoard();
    }

    async function clearNotice(): Promise<void> {
        dispatch(setNotice([]));
        await removeDataInStorage(NOTES_LOCAL_STORAGE);
    }

    function currentMoveIsLast(): boolean {
        return boardState.notice.length === board.current.counterMove;
    }

    const clickHandler = useCallback((colIndex: number, rowIndex: number): void => {

        console.log('clickHandler');

        const targetCell = board.current.getCell(rowIndex, colIndex);

        if (!currentPlayer) {
            return;
        }

        console.log('clickHandler2');

        if (selectedCell && selectedCell !== targetCell && selectedCell.figure !== null
            && board.current.playerCanMove(selectedCell, targetCell, currentPlayer)
        ) {
            console.log('clickHandler3');
            moveOnClick(selectedCell, targetCell, null);
        } else {
            console.log('clickHandler4');
            if (start && !currentMoveIsLast()) {
                console.log('clickHandler5');
                return;
            }

            if (targetCell.figure?.color === currentPlayer) {
                console.log('clickHandler6');
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
        const currentMoveTree = searchItemForAnalysisById(boardState.analysis_notes, board.current.counterAnalysisMove);

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
        getBestmoveByStockfish(fen(analyze ? getAnalysisDeep() : board.current.counterMove + 1)).then((result: any) => {
            //setBestMove(result);
        });
    }

    function fen(counterMove: number): string {
        if (!currentPlayer) {
            return '';
        }

        let fen = board.current.partBoardFen();

        fen += ' ' + getColorPlayerForFen(currentPlayer) + ' ' + (board.current.fenReportStringCastle === '' ? '-' : board.current.fenReportStringCastle);

        const enPassantCell = getEnPassantCell(board.current, boardState);

        fen += ' ' + (enPassantCell !== null ? enPassantCell.interCoordinate : '-');

        fen += ' ' + board.current.ruleOf50Moves;

        fen += ' ' + (counterMove).toString();

        return fen;
    }


    function unmarkEnPassantFigure() {
        const cell = getEnPassantCell(board.current, boardState);
        if (cell !== null) {
            cell.enPassantFigure = false;
        }
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
            board.current.addFigureToArray(new Queen(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        if (FenFigureSign.KNIGHT === FigureName) {
            targetCell.addLostFigure();
            board.current.addFigureToArray(new Knight(targetCell.figure.color, targetCell, FigureSides.ADDITIONAL));
        }

        const lastCodeMove = getPruningCoordinateMove(boardState, selectedCell, targetCell, selectedFigure, opponentFigure);
        wrapSaveLastCodeMove(lastCodeMove);
        finishMove();
    }

    function updateBoard() {
        const newBoard = board.current.getCopyBoard();
        board.current = newBoard;
    }

    function finishMove() {
        unmarkEnPassantFigure();
        dispatch(setLastMoveIsEnPassant(myState.current.switchEnPassant));
        setSelectedCell(null);
        updateBoard();
        if (!analyze) {
            console.log('increment');
            board.current.counterMove++;
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
        board.current.ruleOf50Moves = changeRuleOf50Moves(selectedCell, targetCell, board);

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
        board.current.counterAnalysisMoveIncrease++;
        const moveTree = JSON.parse(JSON.stringify(boardState.analysis_notes));
        console.log('moveTree', moveTree);
        const moves: string[] = [];
        const searchObject = fillMovesRecursive(moveTree, board.current.counterAnalysisMove, moves);
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
            board.current.counterAnalysisMove = virtualItem.id;
            return;
        }

        const isMoveInAnalysis = searchObject.children.find((item: any) => item.value === codeMove);

        if (isMoveInAnalysis) {
            board.current.counterAnalysisMove = isMoveInAnalysis.id;
            return;
        }

        searchObject.children.unshift({
            value: codeMove,
            color: searchObject.color === PlayerTypes.BLACK ? PlayerTypes.WHITE : PlayerTypes.BLACK,
            deep: searchObject.deep + 1,
            index: searchObject.children.length,
            id: board.current.counterAnalysisMoveIncrease,
            children: []
        });

        dispatch(setAnalysisNotice(moveTree));
        board.current.counterAnalysisMove = board.current.counterAnalysisMoveIncrease;
    }

    function getSeconds() {
        const now = new Date();
        return now.getSeconds();
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


