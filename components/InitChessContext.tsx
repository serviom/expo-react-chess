import {Player} from "@/models/Player";
import {createContext} from "react";
import {valuesColors} from "@/models/Colors";

export const MODE = 1;
export const ROTATE = false;
export const whitePlayer = new Player(valuesColors.WHITE);

export const initChessContext = {
    mode: MODE,
    currentPlayer: whitePlayer,
    rotate: ROTATE
}


export interface chessContextType {
    mode: number;
    currentPlayer: Player | null;
    rotate: boolean;
}

export const ChessContext = createContext<chessContextType>(initChessContext);