export type NavigationType = {
    push: (tab: string, params?: any) => void;
    goBack: () => void;
    pop: (steps: number) => void;
};

export * from "./shared/types"
