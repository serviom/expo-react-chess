import React, {createContext, useContext, useRef} from 'react';
import {useAppDispatch} from "@/features/store";
import {Board} from "@/models/Board";
import {setLastMoveIsEnPassant} from "@/features/board/boardSlice";
import {RefMyObject} from "@/types";

interface ChessCountersContextProps {
    // показує поточну позицію в дереві ходів для гри
    counterMove: RefMyObject<number>,
    setCounterMove: (value: number) => void,
    // показує поточну позицію в дереві ходів для аналізатора
    counterAnalysisMove: RefMyObject<number>,
    setCounterAnalysisMove: (value: number) => void,
    // counterAnalysisMoveIncrease завжди збільшується на 1 при кожному новому кроці для аналізу
    counterAnalysisMoveIncrease: RefMyObject<number>,
    setCounterAnalysisMoveIncrease: (value: number) => void,
    // коли ми формуємо fen код для шахів ми передаємо строку кодування можливості рокировки
    fenReportStringCastle: RefMyObject<string>,
    setFenReportStringCastle: (value: string) => void,
    // правило 50 ходів коли не ходять пішаком і не бють фігуру
    ruleOf50Moves: RefMyObject<number>,
    setRuleOf50Moves: (value: number) => void,
    board: RefMyObject<Board>,
    setBoard: (value: Board) => void,
    resetCounters: () => void,
}

const START_COUNTER = 0;
const START_FEN_STRING_CASTLE = 'KQkq';

const CountersContext = createContext<ChessCountersContextProps>({} as ChessCountersContextProps);

export const CountersProvider = ({ children } : { children: React.ReactNode }) => {
    const counterMove = useRef<number>(START_COUNTER);
    const counterAnalysisMove = useRef<number>(START_COUNTER);
    const counterAnalysisMoveIncrease = useRef<number>(START_COUNTER);
    const fenReportStringCastle = useRef<string>(START_FEN_STRING_CASTLE);
    const ruleOf50Moves = useRef<number>(START_COUNTER);

    const boardInit = new Board();
    boardInit.reset();
    const board = useRef<Board>(boardInit);

    const setCounterMove = (value: number) => {
        counterMove.current  = value;
    };

    const setCounterAnalysisMove = (value: number) => {
        counterAnalysisMove.current  = value;
    };

    const setCounterAnalysisMoveIncrease = (value: number) => {
        counterAnalysisMoveIncrease.current  = value;
    };

    const setFenReportStringCastle = (value: string) => {
        fenReportStringCastle.current  = value;
    };

    const setRuleOf50Moves = (value: number) => {
        ruleOf50Moves.current  = value;
    };

    const setBoard = (value: Board) => {
        board.current  = value;
    };

    const resetCounters = () => {
        setCounterMove(START_COUNTER);
        setCounterAnalysisMove(START_COUNTER);
        setCounterAnalysisMoveIncrease(START_COUNTER);
        setRuleOf50Moves(START_COUNTER);
        setFenReportStringCastle(START_FEN_STRING_CASTLE);
    }

    return (
        <CountersContext.Provider value={{resetCounters, setBoard, setCounterAnalysisMoveIncrease, setFenReportStringCastle, setRuleOf50Moves,
            board, counterMove, setCounterMove, counterAnalysisMove, setCounterAnalysisMove,
            counterAnalysisMoveIncrease, fenReportStringCastle, ruleOf50Moves }}>
            {children}
        </CountersContext.Provider>
    );
};

export const useCounters = () => {
    return useContext(CountersContext);
};