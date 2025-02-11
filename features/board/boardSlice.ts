import {moveTree} from "../../components/Notice";
import {createSlice} from '@reduxjs/toolkit';
import {CellInfo} from "@/types";

export interface BoardState {
    lastMoveIsEnPassant: boolean,
    prevCell: CellInfo | null,
    lastCell: CellInfo | null,
    lastCodeMove: string,
    notice: string[],
    analysis_notes: moveTree
}

export interface analysisMovesPayload {
    keys: string[],
    moves: string[]
}

export interface analysisCodeMovePayload {
    index: number,
    newId: number,
    codeMove: string,
    searchObject: moveTree
}

const boardInitialState: BoardState = {
    lastMoveIsEnPassant: false,
    lastCodeMove: '',
    notice: [],
    analysis_notes: {} as moveTree,
    prevCell: null,
    lastCell: null,
}

const boardSlice = createSlice({
    name: 'board',
    initialState: boardInitialState,
    reducers: {
        setPrevCell: (state, action: {payload: CellInfo, type: string }) => {
            state.prevCell = action.payload;
        },
        setLastCell: (state, action: {payload: CellInfo, type: string }) => {
            state.lastCell = action.payload;
        },
        setLastMoveIsEnPassant: (state, action: {payload: boolean, type: string }) => {
            state.lastMoveIsEnPassant = action.payload;
        },
        setLastCodeMove: (state, action: {payload: string, type: string }) => {
            state.lastCodeMove = action.payload;
            state.notice.push(action.payload);
        },
        setNotice: (state, action: {payload: string[], type: string }) => {
            state.notice = action.payload;
        },
        setAnalysisNotice: (state, action: {payload: moveTree, type: string }) => {
            state.analysis_notes = action.payload;
        },
        resetGame: (state) => {
            state.prevCell = null;
            state.lastCell = null;
            state.lastCodeMove = '';
        }
    },
    extraReducers: (builder) => {
        // builder.addMatcher(
        //     authEndpoints.endpoints.signIn.matchFulfilled,
        //     (state,{ payload, type }) => {
        //         console.log('payload in api.endpoints.signIn.matchFulfilled', payload);
        //         const { id, ...user } = {...payload.user, ...{userId: payload.user.id}};
        //         console.log('payload in api.endpoints.signIn.matchFulfilled', user);
        //         boardSlice.caseReducers.login(state, { payload: user, type });
        //
        //         // @ts-ignore
        //         // eslint-disable-next-line no-undef
        //         setAccessToken(payload.tokens.accessToken);
        //         // @ts-ignore
        //         // eslint-disable-next-line no-undef
        //         setRefreshToken(payload.tokens.refreshToken);
        //     }
        // )
    },
});

export const {
    setPrevCell,
    setLastCell,
    setLastMoveIsEnPassant,
    setLastCodeMove,
    setNotice,
    setAnalysisNotice,
    resetGame
} = boardSlice.actions;

export default boardSlice.reducer;


