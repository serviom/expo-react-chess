import React, {forwardRef, useCallback, useContext, useEffect, useImperativeHandle} from 'react';
import {Board} from "../models/Board";
import CellComponent from "./CellComponent";
import {Cell} from "../models/Cell";
import {typeFenFigureSign} from "../models/figures/Figure";
// import {PopupBoxSelectFigureComponent} from "./PopupBoxSelectFigureComponent";
import {StyleSheet, Text, View} from "react-native";

import {staticRefObject} from "./Chess";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";
import {BoardState} from "@/features/board/boardSlice";

import {PlayerTypes} from "@/constants";
import {Player} from "@/types";
import {PopupBoxSelectFigureComponent} from "@/components/PopupBoxSelectFigureComponent";
import {makeCoordinateByLine} from "@/utils/board";
import ModalComponent from "@/components/ModalComponent";
import {useModal} from "@/providers/ModalProvider";
import {useControl} from "@/providers/ControlProvider";

export interface BoardProps {
    board: Board;
    isOpenedSelectFigure: boolean;
    setIsOpenedSelectFigure: (state: boolean) => void;
    currentPlayer: Player | null;
    counter: number;
    analyze: boolean;
    currentMoveIsLast: () => boolean;
    start: boolean;
    moveOnClick: (selectedCell: Cell, targetCell: Cell, promotion: string | null) => void;
    myState: React.RefObject<staticRefObject>;
    setFigure: (FigureName: typeFenFigureSign) => void;
    updateBoard: () => void;
    selectedCell: Cell | null;
    setSelectedCell: (cell: Cell | null) => void;
}

//const BoardComponent = forwardRef((props: BoardProps, ref) => {
const BoardComponent = (props: BoardProps) => {
    const {board, currentPlayer, counter, analyze, currentMoveIsLast, isOpenedSelectFigure,
        setIsOpenedSelectFigure, start, moveOnClick, setFigure, myState, updateBoard,
        selectedCell, setSelectedCell} = props;

    const dispatch = useAppDispatch();
    const boardState = useSelector((state: RootState) => state.board);
    const {rotate, cellSize} = useControl();
    const {openModal} = useModal();

    // useImperativeHandle(ref, () => ({
    //     clearSelectedCell(): void  {
    //         setSelectedCell(null);
    //     }
    // }));


    useEffect(() => {
        if (currentPlayer) {
            board.highlightCells(selectedCell, currentPlayer, boardState as BoardState);
            updateBoard()
        }
    }, [selectedCell]);

    const clickHandler = useCallback((colIndex: number, rowIndex: number): void => {

        const targetCell = board.getCell(rowIndex, colIndex);

        if (!currentPlayer) {
            return;
        }

        if (selectedCell && selectedCell !== targetCell && selectedCell.figure !== null
            && board.playerCanMove(selectedCell, targetCell, currentPlayer)
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


    // function getPlayerStatus(): string {
    //     return analyze && currentPlayer === PlayerTypes.WHITE || !analyze && counter % 2 === 0 ? 'Хід білих' : 'Хід чорних';
    // }

    function getPlayerStatus(): string {
        return currentPlayer === PlayerTypes.WHITE ? 'Хід білих' : 'Хід чорних';
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
            <ModalComponent />
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>{getPlayerStatus()}</Text>
            </View>
            {/* Play Place */}
            <View style={[styles.playPlace, rotate && styles.rotate180]}>
                {/*<View style={styles.markingHorWrap}>*/}
                    {/* Board */}
                    <View style={styles.wrapBoard}>
                        {/*<PopupBoxSelectFigureComponent*/}
                        {/*    isOpenedSelectFigure={isOpenedSelectFigure}*/}
                        {/*    setIsOpenedSelectFigure={setIsOpenedSelectFigure}*/}
                        {/*    targetCell={myState.current?.targetCell}*/}
                        {/*    setFigure={setFigure}*/}
                        {/*/>*/}
                        <View style={styles.board}>
                            {board.cells.map((row, colIndex) => (
                                <View key={`col-${colIndex}`} style={styles.wrapCell}>
                                    {row.map((cell, rowIndex) => (
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
                {/*</View>*/}
            </View>
        </View>
    );
};

export default BoardComponent;


