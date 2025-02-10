import React, {FC, memo, useContext, useEffect, useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, GestureResponderEvent} from 'react-native';
import {ChessContext} from "@/initChessContext";
import {ImageBackground} from "expo-image";
import {interCoordinateHorValue, interCoordinateVertValue, makeCoordinateByLine} from "@/utils/board";
import {
  BASE_AVAIBLE_CIRCLE,
  BASE_CELL_SIZE,
  BASE_FIGURES_FILE_HEIGHT,
  BASE_FIGURES_FILE_WIDTH, BASE_FONT_SIZE_LINE_NUMBER,
} from "@/constants";
import {FigureNameEn} from "@/models/figures/Figure";
import {Player} from "@/types";

interface CellProps {
  selected: boolean;
  click: (event: GestureResponderEvent) => void
  rowIndex: number;
  colIndex: number;
  isEnPassantFigure: boolean;
  available: boolean;
  isFigure: boolean;
  figureNameEn?: FigureNameEn;
  figureColor?: Player;
  cellColor: Player;
  isHighlightLast: boolean;
  isHighlightPrev: boolean;
}

const CellComponent: FC<CellProps> = ({ isHighlightLast, isHighlightPrev, cellColor, figureNameEn, figureColor, selected, click, rowIndex, colIndex, isEnPassantFigure, available, isFigure } : CellProps) => {
  const { mode, rotate, cellSize } = useContext(ChessContext);

  const styles = useMemo(() => StyleSheet.create({
    white_mode3: {
      marginTop: -420 * cellSize / BASE_CELL_SIZE
    },
    black_mode3: {
      marginTop: -518 * cellSize / BASE_CELL_SIZE
    },
    white_mode2: {
      marginTop: -206 * cellSize / BASE_CELL_SIZE
    },
    black_mode2: {
      marginTop: -288 * cellSize / BASE_CELL_SIZE
    },
    white_mode1: {
      marginTop: -6 * cellSize / BASE_CELL_SIZE
    },
    black_mode1: {
      marginTop: -84 * cellSize / BASE_CELL_SIZE
    },
    king: {
      transform: [{ translateX: -2 * cellSize / BASE_CELL_SIZE }]
    },
    knight: {
      transform: [{ translateX: -396 * cellSize / BASE_CELL_SIZE }]
    },
    pawn: {
      transform: [{ translateX: -494 * cellSize / BASE_CELL_SIZE }]
    },
    queen: {
      transform: [{ translateX: -100 * cellSize / BASE_CELL_SIZE }]
    },
    rook: {
      transform: [{ translateX: -200 * cellSize / BASE_CELL_SIZE }]
    },
    bishop: {
      transform: [{ translateX: -298 * cellSize / BASE_CELL_SIZE }]
    },
    cell: {
      width: cellSize,
      height: cellSize,
      justifyContent: 'center',
      alignItems: 'center',
    },
    black: {
      backgroundColor: 'deepskyblue', // Колір для чорних клітинок
    },
    white: {
      backgroundColor: '#eed4ac', // Колір для білих клітинок
    },
    selected: {
      backgroundColor: 'yellow', // Колір для вибраної клітинки
    },
    highlightPrev: {
      backgroundColor: 'lightsalmon', // Колір для підсвітки попередньої клітинки
    },
    highlightLast: {
      backgroundColor: 'salmon', // Колір для підсвітки останньої клітинки
    },
    available: {
      width: BASE_AVAIBLE_CIRCLE * cellSize / BASE_CELL_SIZE,
      height: BASE_AVAIBLE_CIRCLE * cellSize / BASE_CELL_SIZE,
      borderRadius: 10,
      backgroundColor: 'rgba(0, 255, 0, 0.5)', // Круглий індикатор доступної клітинки
    },
    figure: {
      // @ts-ignore
      contentFit: 'cover',
      width: BASE_FIGURES_FILE_WIDTH * cellSize / BASE_CELL_SIZE, // Ширина зображення
      height: BASE_FIGURES_FILE_HEIGHT * cellSize / BASE_CELL_SIZE, // Висота зображення
      backgroundRepeat: 'no-repeat',
    },
    image_container: {
      width: cellSize,
      height: cellSize,
      overflow: 'hidden', // Аналог overflow: hidden
      alignItems: 'center', // Аналог align-items: center
      justifyContent: 'center', // Аналог justify-content: center
    },
    rotate180: {
      transform: [{ rotate: '180deg' }],
    },
    horizontalNumber: {
      color: 'white',
      position: 'absolute',
      bottom: '1%',
      right: '5%',
      fontSize: BASE_FONT_SIZE_LINE_NUMBER * cellSize / BASE_CELL_SIZE
    },
    verticalNumber: {
      color: 'white',
      position: 'absolute',
      top: '1%',
      left: '5%',
      fontSize: BASE_FONT_SIZE_LINE_NUMBER * cellSize / BASE_CELL_SIZE
    }
  }), [cellSize]);

  const cellStyle = useMemo(() => {
    return [
      styles.cell,
      styles[cellColor],
      rotate && styles.rotate180,
      selected && styles.selected,
      isHighlightPrev && styles.highlightPrev, // Підсвітка попередньої клітинки
      isHighlightLast && styles.highlightLast, // Підсвітка останньої клітинки
      available && (isFigure || isEnPassantFigure ) && { backgroundColor: 'green' }, // Зелений фон, якщо клітинка доступна
    ];
  }, [cellColor, selected, available, isFigure, isEnPassantFigure, rotate, isHighlightPrev, isHighlightLast]);

  const showVerticalNumberCell = useMemo(() => {
    if ((!rotate && rowIndex === 0) || (rotate && rowIndex === 7)) {
      return <Text style={styles.verticalNumber}>{interCoordinateVertValue[colIndex]}</Text>;
    }
    return undefined;
  }, [rotate, rowIndex, colIndex, styles.verticalNumber]);

  const showHorizontalNumberCell = useMemo(() => {
    if ((!rotate && colIndex === 7) || (rotate && colIndex === 0)) {
      return <Text style={styles.horizontalNumber}>{interCoordinateHorValue[rowIndex]}</Text>;
    }
    return undefined;
  }, [rotate, colIndex, rowIndex, styles.horizontalNumber]);

  function getSeconds() {
    const now = new Date();
    return now.getSeconds();
  }

  return (
      <TouchableOpacity
          style={cellStyle}
          onPress={click}
          activeOpacity={0.7}
      >
        <View style={styles.image_container}>
          <Text>{getSeconds()}</Text>
          {/* Відображення доступної клітинки (без фігури) */}
          {available && !isFigure && <View style={styles.available} />}
          {!isFigure && showHorizontalNumberCell }
          {!isFigure && showVerticalNumberCell}
          {isFigure && (
                <ImageBackground
                    style={styles.image_container}
                    source={require('@/assets/figures.svg')}
                    imageStyle={[
                      styles.figure,
                      styles[figureNameEn as keyof typeof styles],
                      styles[`${figureColor}_mode${mode}` as keyof typeof styles],
                    ]}>
                    {showHorizontalNumberCell}
                    {showVerticalNumberCell}
                </ImageBackground>
          )}
        </View>
      </TouchableOpacity>
  );
};

export default memo(CellComponent);



