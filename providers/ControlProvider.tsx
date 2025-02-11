import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {CELL_SIZE, MODE, NOTES_LOCAL_STORAGE, PlayerTypes, ROTATE} from "@/constants";
import {initialStateModePlayerOptions, ISelectOption, Player, SingleValue} from "@/types";
import {useWindowDimensions} from "react-native";
import {endGame as endGameControl, restartGame as restartGameControl} from "@/features/control/controlSlice";
import {useAppDispatch} from "@/features/store";
import {setLastMoveIsEnPassant, setNotice} from "@/features/board/boardSlice";
import {removeDataInStorage} from "@/utils/storage";
import {Board} from "@/models/Board";
import {Cell} from "@/models/Cell";

interface ChessControlContextProps {
    mode: number,
    setMode: (val: number) => void
    rotate: boolean;
    setRotate: (val: boolean) => void
    currentPlayer: Player | null;
    setCurrentPlayer: (val: Player | null) => void,
    modeWhitePlayer: SingleValue<ISelectOption>,
    modeBlackPlayer: SingleValue<ISelectOption>,
    setModeWhitePlayer: (val: SingleValue<ISelectOption>) => void,
    setModeBlackPlayer: (val: SingleValue<ISelectOption>) => void,
    cellSize: number;
    endGame: () => void;
    restartGame: () => void;
    board: any;
    selectedCell: Cell | null;
    setSelectedCell: (cell: Cell | null) => void;
    initNewBoard: () => Board;
}

const ControlContext = createContext<ChessControlContextProps>({} as ChessControlContextProps);

export const ControlProvider = ({ children } : { children: React.ReactNode }) => {

    const { width } = useWindowDimensions();

    const [mode, setMode] = useState<number>(MODE);
    const [rotate, setRotate] = useState<boolean>(ROTATE);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [modeWhitePlayer, setModeWhitePlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);
    const [modeBlackPlayer, setModeBlackPlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);
    const [cellSize, setCellSize] = useState<number>(CELL_SIZE);
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

    const dispatch = useAppDispatch();

    const board = useRef(new Board());

    useEffect(() => {
        setCellSize(Math.floor(width/8));
    }, [width]);

    async function endGame() {
        dispatch(endGameControl());
        setCurrentPlayer(null);
        await init();
    }

    async function restartGame() {
        dispatch(restartGameControl());
        await init();
        setCurrentPlayer(PlayerTypes.WHITE);
    }

    function initNewBoard(): Board {
        const newBoard = new Board();
        newBoard.initCells();
        newBoard.addFigures();
        dispatch(setLastMoveIsEnPassant(false));
        return newBoard;
    }

    async function init() {
        dispatch(setNotice([]));
        await removeDataInStorage(NOTES_LOCAL_STORAGE);
        board.current = initNewBoard();
    }

    return (
        <ControlContext.Provider value={{initNewBoard, selectedCell, setSelectedCell, board, endGame, restartGame, setModeWhitePlayer, setModeBlackPlayer, modeWhitePlayer, modeBlackPlayer, cellSize, mode, setMode, rotate, setRotate, currentPlayer, setCurrentPlayer}}>
            {children}
        </ControlContext.Provider>
    );
};

export const useControl = () => {
    return useContext(ControlContext);
};