import React, {FC, useContext, useState} from 'react';
import {typeFenFigureSign, FenFigureSign} from "../models/figures/Figure";
import {ChessContext} from "./Chess";
import {Cell} from "../models/Cell";


import {PlayerTypes} from "@/constants";

interface PopupBoxSelectFigureProps {
    setFigure: (FigureName: typeFenFigureSign) => void,
    targetCell: Cell | null | undefined,
    isOpenedSelectFigure: boolean,
    setIsOpenedSelectFigure: (wasOpened: any) => void
}

export const PopupBoxSelectFigureComponent: FC<PopupBoxSelectFigureProps> = ({ isOpenedSelectFigure, setIsOpenedSelectFigure, setFigure, targetCell }) => {

    function selected(FigureName: typeFenFigureSign) {
        setIsOpenedSelectFigure(false);
        setFigure(FigureName);
    }

    const {mode} = useContext(ChessContext);

    return (
        <div className={'box' + (isOpenedSelectFigure ? ' pointer-event-auto' : '') }>
            {isOpenedSelectFigure && (
                <div className="boxContent">
                    <div
                        className={['cell', PlayerTypes.WHITE].join(' ')}
                        onClick={() => selected(FenFigureSign.QUEEN)}>
                         <div className={'figure queen ' + targetCell?.figure?.color + ' mode' + mode }></div>
                    </div>
                    <div
                        className={['cell', PlayerTypes.BLACK].join(' ')}
                        onClick={() => selected(FenFigureSign.KNIGHT)}>
                            <div className={'figure knight ' + targetCell?.figure?.color + ' mode' + mode }></div>
                    </div>
                </div>
            )}
        </div>
    );
}
