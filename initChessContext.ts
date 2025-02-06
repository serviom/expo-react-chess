import {chessContextType} from "@/types";
import {createContext} from "react";

export const ChessContext = createContext<chessContextType>({} as chessContextType);

