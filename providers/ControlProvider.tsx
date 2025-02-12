import React, {createContext, useContext, useEffect, useState} from 'react';
import {CELL_SIZE, MODE, NOTES_LOCAL_STORAGE, PlayerTypes, ROTATE} from "@/constants";
import {initialStateModePlayerOptions, ISelectOption, Player, SingleValue} from "@/types";
import {useWindowDimensions} from "react-native";
import {endGame, restartGame} from "@/features/control/controlSlice";
import {useAppDispatch} from "@/features/store";
import {resetGame, setLastMoveIsEnPassant, setNotice} from "@/features/board/boardSlice";
import {removeDataInStorage} from "@/utils/storage";
import {Cell} from "@/models/Cell";
import {useCounters} from "@/providers/CountersProvider";

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
    selectedCell: Cell | null;
    setSelectedCell: (cell: Cell | null) => void;
}

const ControlContext = createContext<ChessControlContextProps>({} as ChessControlContextProps);

export const ControlProvider = ({ children } : { children: React.ReactNode }) => {

    // const { width } = useWindowDimensions();
    // Math.floor(width/8)

    const [mode, setMode] = useState<number>(MODE);
    const [rotate, setRotate] = useState<boolean>(ROTATE);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const [modeWhitePlayer, setModeWhitePlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);
    const [modeBlackPlayer, setModeBlackPlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);
    const [cellSize, setCellSize] = useState<number>(CELL_SIZE);
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

    const dispatch = useAppDispatch();

    const {board, resetCounters} = useCounters();

    useEffect(() => {
        setCellSize(32);
    }, []);

    async function end() {
        dispatch(endGame());
        setCurrentPlayer(null);
        await init();
    }

    async function restart() {
        dispatch(restartGame());
        await init();
        setCurrentPlayer(PlayerTypes.WHITE);
    }

    async function init() {
        dispatch(setNotice([]));
        await removeDataInStorage(NOTES_LOCAL_STORAGE);
        board.current.reset();
        dispatch(setLastMoveIsEnPassant(false));
        dispatch(resetGame())
        resetCounters();
    }

    return (
        <ControlContext.Provider value={{selectedCell, setSelectedCell, endGame: end, restartGame: restart, setModeWhitePlayer, setModeBlackPlayer, modeWhitePlayer, modeBlackPlayer, cellSize, mode, setMode, rotate, setRotate, currentPlayer, setCurrentPlayer}}>
            {children}
        </ControlContext.Provider>
    );
};

export const useControl = () => {
    return useContext(ControlContext);
};