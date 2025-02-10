import {FenFigureSign, Figure, FigureNamesEnValues, FigureNamesValues, FigureSides, FigureSign} from "./Figure";
import {Cell} from "../Cell";


import {PlayerTypes} from "@/constants";
import {Player} from "@/types";
// import blackLogo from "../../assets/black-rook.png";
// import whiteLogo from "../../assets/white-rook.png";

export class Rook extends Figure {

  constructor(color: Player, cell: Cell, side: FigureSides = FigureSides.ALL_ROUND) {
    super(color, cell, side);
    // this.logo = color === valuesColors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNamesValues.ROOK;
    this.nameEn = FigureNamesEnValues.ROOK;
    this.noticeSign = FigureSign.ROOK;
    this.noticeFenSign =  FenFigureSign.ROOK;
  }

  canMove(target: Cell, validateColorFigure: Boolean = true): boolean {
    if (!super.canMove(target, validateColorFigure)) {
      return false;
    }

    if (this.cell.isEmptyVertical(target)) {
      return true;
    }

    if (this.cell.isEmptyHorizontal(target)) {
      return true;
    }

    return false
  }
}
