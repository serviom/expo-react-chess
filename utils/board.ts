import {Cell} from "../models/Cell";
import {
    FenFigureSign,
    Figure,
    FigureSides,
    FigureSign,
    typeFenFigureSign,
} from "../models/figures/Figure";

import {Board,} from "../models/Board";
import {Knight} from "../models/figures/Knight";
import {Queen} from "../models/figures/Queen";
import {moveTree} from "../components/Notice";
import {Player, ValueOf} from "../types";
import {BoardState} from "@/features/board/boardSlice";
import {PlayerTypes} from "@/constants";

const SIGN_EN_PASSANT: string = 'e.p.';
const SEIZE_SIGN: string = 'x';
const EQUAL_SIGN: string = '=';

export const TEST_NOTICE = '1. c4 e5 2. f4 d5 3. b5 4. exf4 5. bxc7 a5 6. cxb8=Q';

export const WHITE = 'w';
export const BLACK = 'b';

export const DEFAULT_FEN_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export type gameForce = {
    level: number,
    name: string,
    elo: number,
    deep: number
}

export const gameForces: gameForce[] = [
    {
        level: 1,
        name: 'beginner',
        elo: 250,
        deep: 1
    },
    {
        level: 1,
        name: 'beginner',
        elo: 400,
        deep: 2
    },
    {
        level: 12,
        name: 'advanced',
        elo: 1600,
        deep: 12
    }
];


export type interCoordinates = {
    hor: string,
    vert: string,
}

export type systemCoordinates = {
    x: number,
    y: number
}

export type moveInSystemCoordinate = {
    from: systemCoordinates,
    to: systemCoordinates,
    flag: string
}

export const interCoordinateHorValue = ['a','b','c','d','e','f','g','h'];
export const interCoordinateVertValue = ['8','7','6','5','4','3','2','1'];

export const CastleTypes = {
    SHORT : "O-O",
    LONG : "O-O-O"
} as const;

export type CastleTypes = ValueOf<typeof CastleTypes>;

export const specialSymbolsForNotice = {
    PLUS : '+', // шах
    GRILLE : '#', // шах і мат
    EXCLAMATION : '!', // гарний хід
    QUESTION : '?',  //поганий хід
} as const;

export type specialSymbolsForNotice = ValueOf<typeof specialSymbolsForNotice>;

export const END_GAME = '*'  //завершення гри

const getSystemXCoordinateByHor = (hor: string): number => {
    const x = interCoordinateHorValue.indexOf(hor);

    if (x === -1) {
        throw new Error('not valid hor coordinate');
    }

    return x;
}

const getSystemYCoordinateByVert = (vert: string): number => {
    const y = interCoordinateVertValue.indexOf(vert);

    if (y === -1) {
        throw new Error('not valid hor coordinate');
    }

    return y;
}

export const getInterCoordinatesBySystem = (system: systemCoordinates): interCoordinates  => {
    return {
        hor: interCoordinateHorValue[system.x],
        vert: interCoordinateVertValue[system.y]
    }
}

export const getSystemCoordinatesByInter = (inter: interCoordinates): systemCoordinates => {

    const x = getSystemXCoordinateByHor(inter.hor);
    const y = getSystemYCoordinateByVert(inter.vert);

    return {
        x,
        y
    }
}

export const getSystemCoordinateByInterByString = (coordinate: string) : systemCoordinates => {
    return getSystemCoordinatesByInter({
        hor: coordinate.substring(0,1),
        vert: coordinate.substring(1,2)
    });
}

// export const getMoveCoordinate = (lastCell: Cell, prevCell: Cell): string => {
//     const interCoordinateLastCall = getInterCoordinatesBySystem(lastCell.systemCoordinate);
//     const interCoordinatePrevCall = getInterCoordinatesBySystem(prevCell.systemCoordinate);
//     return interCoordinatePrevCall.hor + interCoordinatePrevCall.vert + '-' + interCoordinateLastCall.hor + interCoordinateLastCall.vert;
// }

export function getShortCastle(): string {
    return CastleTypes.SHORT;
}

export function getLongCastle(): string {
    return CastleTypes.LONG;
}

export const getPruningCoordinateMove = (boardState: BoardState, selectedCell: Cell, target: Cell,
                     selectedFigure: Figure | null, opponentFigure: Figure | null): string => {

    if (!selectedFigure) {
        throw new Error('not current player');
    }

    const horPrev = getInterCoordinatesBySystem(selectedCell.systemCoordinate).hor;

    if (selectedFigure.isPawn()) {
        if (boardState.lastMoveIsEnPassant === true && target.isEnPassantFigure) {
            return horPrev + SEIZE_SIGN + getCoupleCoordinateMove(target);
        }

        return ((opponentFigure !== null) ? horPrev + SEIZE_SIGN : '') + getCoupleCoordinateMove(target) + (
            target.isLastLineForTransforming(selectedFigure.color) ? (EQUAL_SIGN + target?.figure?.noticeSign) : '');
    }

    return target?.figure?.noticeSign + getShortCoordinateMove(target, selectedCell, selectedFigure) +
        (opponentFigure !== null ? SEIZE_SIGN : '') + getCoupleCoordinateMove(target);
}

export const makeCoordinateByLine = (x: number, y: number): string => {
    return  x + ',' + y;
}

export const getCoupleCoordinateMove = (cell: Cell): string => {
    const interCoordinateLastCall = getInterCoordinatesBySystem(cell.systemCoordinate);
    return interCoordinateLastCall.hor + interCoordinateLastCall.vert;
}

const getShortCoordinateMove = (target: Cell, selectedCell: Cell, selectedFigure: Figure): string => {
    let moveByString = '';

    target.board.getFigures(selectedFigure.color).every(figure => {
        if (selectedFigure === figure ) {
            return true;
        }

        if(selectedFigure.name === figure.name && figure.canMove(target, false)) {
            const interCoordinate = getInterCoordinatesBySystem(selectedCell.systemCoordinate)
            if (figure.cell.x === selectedCell.x) {
                moveByString = interCoordinate.vert;
            } else {
                moveByString = interCoordinate.hor;
            }
            return false;
        }
        return true;
    });

    return moveByString;
}

export const getAllFiguresSign = (): string[] => {
    return Object.values(FigureSign).filter(_ => _);
}

export const getFenFigureSignBySymbol = (symbol: string): typeFenFigureSign => {
    const one = Object.values(FenFigureSign).findIndex(_ => _ === symbol);
    const key = Object.keys(FenFigureSign).find((value, index) => {
        return index === one;
    });
    return FenFigureSign[key as keyof typeof FenFigureSign];
}

export const getAllOfficialSymbols = (): string[] => {
    return Object.values(specialSymbolsForNotice);
}

export const oneAnalysisMove = (cellPrev: Cell, cellNext: Cell, moveCoordinate:moveInSystemCoordinate, codeMove: string, board: Board, isBlack: boolean) => {

    if (moveCoordinate.flag === SIGN_EN_PASSANT) {
        // якщо en passant тоді ми видаляємо фігуру не з cellNext а з проміжної клітинки
        const enPassantCell = board.getCell(moveCoordinate.to.x, isBlack ? moveCoordinate.to.y - 1 : moveCoordinate.to.y + 1);
        enPassantCell.addLostFigure();
        enPassantCell.cleanUpFigure();
    } else if (cellNext.figure) {
        cellNext.addLostFigure();
    }

    if (cellPrev.figure) {
        cellNext.setFigure(cellPrev.figure);
    }

    cellPrev.cleanUpFigure();

    if (getAllFiguresSign().indexOf(moveCoordinate.flag) !== -1) {
        // якщо ми вибрали коня або королеву
        if (moveCoordinate.flag === FigureSign.KNIGHT) {
            cellNext.addLostFigure();
            board.addFigureToArray(new Knight(isBlack ? PlayerTypes.BLACK : PlayerTypes.WHITE, cellNext, FigureSides.ADDITIONAL));
        }

        if (moveCoordinate.flag === FigureSign.QUEEN) {
            cellNext.addLostFigure();
            board.addFigureToArray(new Queen(isBlack ? PlayerTypes.BLACK : PlayerTypes.WHITE, cellNext, FigureSides.ADDITIONAL));
        }
    }
}

export const isBlackMove = (counter: number): boolean => {
    return counter % 2 === 0;
}

export const searchMustItemForAnalysisById = (object: moveTree, id: number): moveTree => {

    const result = searchItemForAnalysisById(object, id);

    if (!result) {
        throw new Error('not found item with id=' + id + ' in searchMustItemForAnalysisById');
    }

    return result;
}

export const searchItemForAnalysisById = (object: moveTree, id: number): moveTree | null => {
    if (object.id === id) {
        return object;
    }

    if (!object.children || !object.children.length) {
        return null;
    }

    let result: moveTree | null = null

    object.children.every((value, index, ar) => {
        const item = searchItemForAnalysisById(value, id);
        if (item) {
            result = item;
            return false;
        }
        return true;
    });

    return result;
}

export const searchItemForAnalysisByDeep = (object: moveTree, deep: number): moveTree | null => {
    if (object.deep === deep) {
        return object;
    }

    if (!object.children || !object.children.length) {
        return null;
    }

    let result: moveTree | null = null

    object.children.every((value, index, ar) => {
        const item = searchItemForAnalysisByDeep(value, deep);
        if (item) {
            result = item;
            return false;
        }
        return true;
    });

    return result;
}

export const searchItemForAnalysisByDeepAndId = (object: moveTree, deep: number, id: number): moveTree | null => {
    if (object.deep === deep && object.id === id) {
        return object;
    }

    if (!object.children || !object.children.length) {
        return null;
    }

    let result: moveTree | null = null

    object.children.every((value, index, ar) => {
        const item = searchItemForAnalysisByDeepAndId(value, deep, id);
        if (item) {
            result = item;
            return false;
        }
        return true;
    });

    return result;
}

export const searchItemRecursiveForLast = (object: moveTree): moveTree | null => {

    if (!object.children || !object.children.length || object.children.length > 1 ) {
        return object;
    }

    let result: moveTree | null = null

    object.children.every((value, index, ar) => {
        result = searchItemRecursiveForLast(value);
    });

    return result;
}

export const fillMovesRecursive = (object: moveTree, id: number, moves: string[]): moveTree | null => {

    if (object.id === id) {
        moves.unshift(object.value);
        return object;
    }

    if (!object.children || !object.children.length) {
        return null;
    }

    let result: moveTree | null = null

    object.children.every((value, index, ar) => {
        result = fillMovesRecursive(value, id, moves);

        if (result) {
            moves.unshift(object.value);
            return false;
        }
        return true;
    });
    return result;
}

export const getEnPassantCell = (board: Board, boardState: BoardState): null | Cell => {
    if (boardState.lastMoveIsEnPassant === false || boardState.lastCell === null || boardState.prevCell === null) {
        return null;
    }
    return board.getCell(boardState.lastCell.x, (boardState.lastCell.y + boardState.prevCell.y) / 2);
}

export const getColorPlayerForFen = (color: Player | null): string => {
    return color === PlayerTypes.WHITE || color === null ? WHITE : BLACK;
}

export const getSystemCoordinateMoveByShort = (codeMove: string, board: Board, isBlack: boolean): moveInSystemCoordinate => {

    let noticeSign = '';

    const initSystemMove = {
        from: {
            x: -1,
            y: -1
        },
        to: {
            x: -1,
            y: -1
        },
        flag: ''
    }

    if (getAllOfficialSymbols().indexOf(codeMove.substring(codeMove.length - 1)) !== -1) {
        codeMove = codeMove.substring(0, codeMove.length - 1);
    }

    if (getAllFiguresSign().indexOf(codeMove.substring(codeMove.length - 1)) !== -1 &&
        codeMove.substring(codeMove.length - 2, codeMove.length - 1) === EQUAL_SIGN) {
        initSystemMove.flag = codeMove.substring(codeMove.length - 1);
        codeMove = codeMove.substring(0, codeMove.length - 2);
    }

    // 2. якщо складається із двох символів тоді ходив пішак
    if (codeMove.length === 2) {
        initSystemMove.to = getSystemCoordinatesByInter({
            hor: codeMove.substring(0,1),
            vert: codeMove.substring(1,2)
        });

        // black 2 line, white 5 line
        if (isBlack) {
            initSystemMove.from = {
                x: initSystemMove.to.x,
                y: initSystemMove.to.y === 3 ? (board.getCell(initSystemMove.to.x, 2).isEmpty() ? 1 : 2) : initSystemMove.to.y - 1
            }
        } else {
            initSystemMove.from = {
                x: initSystemMove.to.x,
                y: initSystemMove.to.y === 4 ? (board.getCell(initSystemMove.to.x, 5).isEmpty() ? 6 : 5) :  initSystemMove.to.y + 1
            }
        }

        return initSystemMove;
    }

    // 2. якщо код ходу складається із 4 символів а другий символ x тоді або б'є пішак або слон тому треба провірити
    if (codeMove.length === 4 && codeMove.substring(1,2) === SEIZE_SIGN) {
        // розділяємо по x

        let[from, to] = codeMove.split(SEIZE_SIGN);

        initSystemMove.to = getSystemCoordinatesByInter({
            hor: to.substring(0,1),
            vert: to.substring(1,2)
        });

        if (interCoordinateHorValue.indexOf(from) !== -1) {
            initSystemMove.from.x = getSystemXCoordinateByHor(from);
            if ((isBlack && initSystemMove.to.y - 1 >= 0) || (!isBlack && initSystemMove.to.y + 1 <= 8)) {
                initSystemMove.from.y = isBlack ? initSystemMove.to.y - 1 : initSystemMove.to.y + 1;

                // якщо на клітинці з якої ходили знаходився пішак тоді повертаємо координати (ходив пішак) по іншому ходив офіцер
                if (board.getCell(initSystemMove.from.x, initSystemMove.from.y).figure?.isPawn()) {
                    if (board.getCell(initSystemMove.to.x, initSystemMove.to.y).isEmpty()) {
                        initSystemMove.flag = SIGN_EN_PASSANT;
                    }
                    return initSystemMove;
                }
            }
        }

        // якщо ходив офіцер тоді flag ставимо букву b а код ходу зменшуємо на символ b
        noticeSign = from;
    }

    // 3. якщо код ходу складається із 3 символів тоді це простий хід фігурою
    if (codeMove.length === 3) {
        noticeSign = codeMove.substring(0,1);
        initSystemMove.to = getSystemCoordinatesByInter({
            hor: codeMove.substring(1,2),
            vert: codeMove.substring(2,3),
        });
    }

    // 4. якщо складається із 4 символів код ходу і без x тоді це хід фігури
    // 4.1 якщо складається із 5 символів код ходу і з x тоді це хід фігури що бє фігуру
    if ((codeMove.length === 4 && codeMove.indexOf(SEIZE_SIGN) === -1) ||
        (codeMove.length === 5 && codeMove.indexOf(SEIZE_SIGN) !== -1)) {
        noticeSign = codeMove.substring(0,1);
        const codeSymbol = codeMove.substring(1,2);

        if (interCoordinateHorValue.indexOf(codeSymbol) === -1) {
            initSystemMove.from.y = getSystemYCoordinateByVert(codeSymbol);
        } else {
            initSystemMove.from.x = getSystemXCoordinateByHor(codeSymbol);
        }

        initSystemMove.to = getSystemCoordinatesByInter({
            hor: codeMove.substring(codeMove.indexOf(SEIZE_SIGN) === -1 ? 2 : 3, codeMove.indexOf(SEIZE_SIGN) === -1 ? 3 : 4),
            vert: codeMove.substring(codeMove.indexOf(SEIZE_SIGN) === -1 ? 3 : 4, codeMove.indexOf(SEIZE_SIGN) === -1 ? 4 : 5)
        });
    }

    // 5. якщо складається із 5 символів код ходу і без x тоді це хід фігури але всі коородинати відомі
    if (codeMove.length === 5 && codeMove.indexOf(SEIZE_SIGN) === -1) {
        noticeSign = codeMove.substring(0,1);
        initSystemMove.from.x = getSystemXCoordinateByHor(codeMove.substring(1,2));
        initSystemMove.from.y = getSystemYCoordinateByVert(codeMove.substring(2,3));

        initSystemMove.to = getSystemCoordinatesByInter({
            hor: codeMove.substring(3,4),
            vert: codeMove.substring(4,5)
        });

        return initSystemMove;
    }

    // 6. якщо складається із 6 символів код ходу і він з x тоді це хід фігури із збиттям але всі коородинати відомі
    if (codeMove.length === 6 && codeMove.indexOf(SEIZE_SIGN) !== -1) {
        noticeSign = codeMove.substring(0,1);
        initSystemMove.from.x = getSystemXCoordinateByHor(codeMove.substring(1,2));
        initSystemMove.from.y = getSystemYCoordinateByVert(codeMove.substring(2,3));

        initSystemMove.to = getSystemCoordinatesByInter({
            hor: codeMove.substring(4,5),
            vert: codeMove.substring(5,6)
        });

        return initSystemMove;
    }

    // console.log('prev initSystemMove', JSON.parse(JSON.stringify(initSystemMove)));

    const selectFigure = board.getFigures(isBlack ? PlayerTypes.BLACK : PlayerTypes.WHITE).find(figure => {
        if(figure.noticeSign !== noticeSign) {
            return false;
        }

        const targetCell = board.getCell(initSystemMove.to.x, initSystemMove.to.y);

        return (((initSystemMove.from.x !== -1 && figure.getCell().x === initSystemMove.from.x) ||
            (initSystemMove.from.y !== -1 && figure.getCell().y === initSystemMove.from.y) ||
            (initSystemMove.from.y === -1 && initSystemMove.from.x === -1)) && figure.canMove(targetCell)
            && board.willBeNotKingUnderAttack(figure.getCell(), targetCell , isBlack ? PlayerTypes.BLACK : PlayerTypes.WHITE));
    });

    if (!selectFigure) {
        console.log('noticeSign=',noticeSign);
        console.log('isBlack=', isBlack);
        console.log(initSystemMove);
        throw new Error('I cannot identify the figure that was walking');
    }

    initSystemMove.from.x = selectFigure.getCell().x;
    initSystemMove.from.y = selectFigure.getCell().y;

    return initSystemMove;
}


