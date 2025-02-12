import {createSlice} from '@reduxjs/toolkit';
import {ISelectOption, Player, SingleValue} from "@/types";
import {Cell} from "@/models/Cell";
import {Board} from "@/models/Board";

export interface ControlState {
    start: number,
    finish: boolean,
    pause: boolean,
    analyze: boolean,
    // TODO in future
    // mode: number,
    // rotate: boolean;
    // currentPlayer: Player | null;
    // modeWhitePlayer: SingleValue<ISelectOption>,
    // modeBlackPlayer: SingleValue<ISelectOption>,
    // cellSize: number;
    // selectedCell: Cell | null;
    // setSelectedCell: (cell: Cell | null) => void;
}

const controlInitialState: ControlState = {
    start: 0,
    finish: false,
    pause: false,
    analyze: false,
}

const controlSlice = createSlice({
    name: 'control',
    initialState: controlInitialState,
    reducers: {
        setStart: (state) => {
            state.start = state.start + 1;
        },
        setFinish: (state, action: {payload: boolean, type: string }) => {
            state.finish = action.payload;
        },
        setAnalyze: (state, action: {payload: boolean, type: string }) => {
            state.analyze = action.payload;
        },
        setPause: (state, action: {payload: boolean, type: string }) => {
            state.pause = action.payload;
        },
        endGame: (state) => {
            state.start = 0;
            state.analyze = false;
        },
        restartGame: (state) => {
            state.start =  state.start + 1;
            state.analyze = false;
        },
        startGame: (state) => {
            state.start = 1;
            state.analyze = false;
        }

    },
    extraReducers: (builder) => {},
});

export const {
    setStart,
    setFinish,
    setAnalyze,
    setPause,
    endGame,
    restartGame
} = controlSlice.actions;

export default controlSlice.reducer;


