import {
    BoardActionEnum,
    SetAnalysisNotice,
    SetBoardLastCell,
    SetBoardMoveIsEnPassant,
    SetBoardPrevCell,
    SetLastCodeMove,
    SetNotice
} from "../board/types";

import {Cell} from "../../../models/Cell";
import {AppDispatch} from "../../index";
import {NOTES_LOCAL_STORAGE} from "../../../components/Chess";
import {moveTree} from "../../../components/Notice";


const saveLastCodeMoveToLocalStorage = (lastCodeMove: string) => {
    const notes = localStorage.getItem(NOTES_LOCAL_STORAGE) || '[]';
    const json = JSON.parse(notes) as string[];
    json.push(lastCodeMove);
    localStorage.setItem(NOTES_LOCAL_STORAGE, JSON.stringify(json));
}

export const BoardActionCreators = {
    setPrevCell: (cell: Cell): SetBoardPrevCell => ({type: BoardActionEnum.SET_PREV_CELL, payload: cell}),
    setNotice: (notice: string[]): SetNotice => ({type: BoardActionEnum.SET_NOTICE, payload: notice}),
    setAnalysisNotice: (data: moveTree): SetAnalysisNotice => ({type: BoardActionEnum.SET_ANALYSIS_NOTICE, payload: data}),
    setLastCodeMove: (code: string): SetLastCodeMove => ({type: BoardActionEnum.SET_LAST_CODE_MOVE, payload: code}),
    setLastCell: (cell: Cell): SetBoardLastCell => ({type: BoardActionEnum.SET_LAST_CELL, payload: cell}),
    setLastMoveIsEnPassant: (isEnPassant: boolean): SetBoardMoveIsEnPassant =>
        ({type: BoardActionEnum.LAST_MOVE_IS_EN_PASSANT, payload: isEnPassant}),
    saveLastCodeMove: (code: string) => async(dispatch: AppDispatch) => {
        try {
           // const response = await ChessService.saveLastCodeMoveToDatabase();
            saveLastCodeMoveToLocalStorage(code);
            dispatch(BoardActionCreators.setLastCodeMove(code));
        } catch (e) {
            throw new Error('set last move');
        }
    }
}