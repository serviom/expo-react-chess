import {createSlice} from '@reduxjs/toolkit';

export interface ControlState {
    start: boolean,
    finish: boolean,
    pause: boolean,
    analyze: boolean,
}

const controlInitialState: ControlState = {
    start: false,
    finish: false,
    pause: false,
    analyze: false,
}

const controlSlice = createSlice({
    name: 'control',
    initialState: controlInitialState,
    reducers: {
        setStart: (state, action: {payload: boolean, type: string }) => {
            state.start = action.payload;
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
            state.start = false;
            state.analyze = false;
        },
        restartGame: (state) => {
            state.start = true;
            state.analyze = false;
        },
        startGame: (state) => {
            state.start = true;
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


