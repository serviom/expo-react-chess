import {createSlice} from '@reduxjs/toolkit';

export interface ControlState {
    start: number,
    finish: boolean,
    pause: boolean,
    analyze: boolean,
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


