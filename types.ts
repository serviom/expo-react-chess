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
