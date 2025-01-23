import {Cell} from "../../../models/Cell";
import {moveTree} from "../../../components/Notice";

export interface BoardState {
    lastMoveIsEnPassant: boolean,
    prevCell: Cell | null,
    lastCell: Cell | null,
    lastCodeMove: string,
    notice: string[],
    analysis_notes: moveTree
}

export enum BoardActionEnum {
    SET_PREV_CELL = "setPrevCell",
    SET_LAST_CELL = "setLastCell",
    LAST_MOVE_IS_EN_PASSANT = "lastMoveIsEnPassant",
    SET_LAST_CODE_MOVE = "setLastCodeMove",
    SET_NOTICE = "setNotice",
    SET_ANALYSIS_NOTICE = "setAnalysisNotice"
}

export interface SetBoardPrevCell {
    type: BoardActionEnum.SET_PREV_CELL;
    payload: Cell;
}

export interface SetBoardLastCell {
    type: BoardActionEnum.SET_LAST_CELL;
    payload: Cell;
}

export interface SetBoardMoveIsEnPassant {
    type: BoardActionEnum.LAST_MOVE_IS_EN_PASSANT;
    payload: boolean;
}

export interface SetLastCodeMove {
    type: BoardActionEnum.SET_LAST_CODE_MOVE;
    payload: string;
}

export interface SetNotice {
    type: BoardActionEnum.SET_NOTICE;
    payload: string[];
}

export interface analysisMovesPayload {
    keys: string[],
    moves: string[]
}

export interface SetAnalysisNotice {
    type: BoardActionEnum.SET_ANALYSIS_NOTICE;
    payload: moveTree;
}

export interface analysisCodeMovePayload {
    index: number,
    newId: number,
    codeMove: string,
    searchObject: moveTree
}

export type BoardAction =
    SetBoardPrevCell |
    SetBoardLastCell |
    SetBoardMoveIsEnPassant |
    SetLastCodeMove |
    SetNotice |
    SetAnalysisNotice;

