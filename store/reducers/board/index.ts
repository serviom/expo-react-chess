import {BoardAction, BoardActionEnum, BoardState} from "./types";
import {moveTree} from "../../../components/Notice";

const initialState: BoardState = {
    lastMoveIsEnPassant: false,
    prevCell: null,
    lastCell: null,
    lastCodeMove: '',
    notice: [],
    analysis_notes: {} as moveTree,

}

export default function boardReducer(state = initialState, action: BoardAction): BoardState {
    switch(action.type) {
        case BoardActionEnum.SET_PREV_CELL:
            return {...state, prevCell: action.payload }
        case BoardActionEnum.SET_NOTICE:
            return {...state, notice: action.payload }
        case BoardActionEnum.SET_ANALYSIS_NOTICE:
            return {...state, analysis_notes: action.payload}
        case BoardActionEnum.SET_LAST_CELL:
            return {...state, lastCell: action.payload }
        case BoardActionEnum.LAST_MOVE_IS_EN_PASSANT:
            return {...state, lastMoveIsEnPassant: action.payload }
        case BoardActionEnum.SET_LAST_CODE_MOVE:
            return {
                ...state,
                lastCodeMove: action.payload,
                notice: [...state.notice, action.payload]
            }
        default:
        return state
    }
}
