import React, {createContext, useContext, useEffect, useState} from 'react';
import {CELL_SIZE, MODE, ROTATE} from "@/constants";
import {initialStateModePlayerOptions, ISelectOption, Player, SingleValue} from "@/types";
import {useWindowDimensions} from "react-native";

interface ChessControlContextProps {
    mode: number,
    setMode: (val: number) => void
    rotate: boolean;
    setRotate: (val: boolean) => void
    currentPlayer: Player | null;
    setCurrentPlayer: (val: Player | null) => void,
    // modeWhitePlayer: SingleValue<ISelectOption>,
    // modeBlackPlayer: SingleValue<ISelectOption>,
    // setModeWhitePlayer: (val: SingleValue<ISelectOption>) => void,
    // setModeBlackPlayer: (val: SingleValue<ISelectOption>) => void,
    cellSize: number;
}

const ControlContext = createContext<ChessControlContextProps>({} as ChessControlContextProps);

export const ControlProvider = ({ children } : { children: React.ReactNode }) => {

    const { width } = useWindowDimensions();

    const [mode, setMode] = useState<number>(MODE);
    const [rotate, setRotate] = useState<boolean>(ROTATE);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    //const [modeWhitePlayer, setModeWhitePlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);
    //const [modeBlackPlayer, setModeBlackPlayer] = useState<SingleValue<ISelectOption>>(initialStateModePlayerOptions);
    const [cellSize, setCellSize] = useState<number>(CELL_SIZE);

    useEffect(() => {
        setCellSize(Math.floor(width/8));
    }, [width]);

    return (
        <ControlContext.Provider value={{ cellSize, mode, setMode, rotate, setRotate, currentPlayer, setCurrentPlayer}}>
            {children}
        </ControlContext.Provider>
    );
};

export const useControl = () => {
    return useContext(ControlContext);
};