import React, {FC, useContext, useState} from 'react';
import {typeFenFigureSign, FenFigureSign} from "../models/figures/Figure";
import {ChessContext} from "./Chess";
import {Cell} from "../models/Cell";


import {PlayerTypes} from "@/constants";

interface PopupBoxSelectFigureProps {
    setFigure: (FigureName: typeFenFigureSign) => void,
    setIsOpenedSelectFigure: (wasOpened: any) => void
}

export const PopupBoxSelectFigureComponent: FC<PopupBoxSelectFigureProps> = ({setIsOpenedSelectFigure, setFigure}) => {

    function selected(FigureName: typeFenFigureSign) {
        setIsOpenedSelectFigure(false);
        setFigure(FigureName);
    }

    const {mode} = useContext(ChessContext);

    return (
        <div id="myPopup" className="popup">
        </div>
    );
}
