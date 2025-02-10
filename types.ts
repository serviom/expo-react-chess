import {PlayerTypes} from "@/constants";
import {FigureNameEn} from "@/models/figures/Figure";

export type NavigationType = {
    push: (tab: string, params?: any) => void;
    goBack: () => void;
    pop: (steps: number) => void;
};

export type ValueOf<T> = T[keyof T];
export type SingleValue<T> = T | null;
export type MultiValue<T> = T[];

export interface ISelectOption {
    label: string;
    value: string;
}

export * from "./shared/types"

export const modePlayer = {
    AUTO: 'auto',
    MANUAL: 'manual'
} as const;

const LABEL_MANUAL = "manual";
const LABEL_AUTO = "auto";

export const initialStateModePlayerOptions: SingleValue<ISelectOption> = {
    value: modePlayer.MANUAL,
    label: LABEL_MANUAL
}
export const modePlayerOptions: ISelectOption[] = [
    initialStateModePlayerOptions,
    {value: modePlayer.AUTO, label: LABEL_AUTO},
];

//export type Player = ValueOf<typeof Players>;
export type Player = (typeof PlayerTypes)[keyof typeof PlayerTypes];

export interface chessContextType {
    mode: number;
    currentPlayer: Player | null;
    rotate: boolean;
    cellSize: number;
}

export interface CellInfo {
    readonly x: number;
    readonly y: number;
    figure: FigureNameEn | null;
    color: Player | null;
}