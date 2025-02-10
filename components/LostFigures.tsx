import React, {FC, useContext} from 'react';
import {Figure} from "../models/figures/Figure";
import {ChessContext} from "./Chess";
import {StyleSheet, Dimensions, View, Text} from "react-native";

interface LostFiguresProps {
  title: string;
  figures: Figure[]
}

const windowHeight = Dimensions.get('window').height;
const calculatedHeight = windowHeight * 0.5 - 60;

const LostFigures: FC<LostFiguresProps> = ({title, figures}) => {
  const {mode} = useContext(ChessContext);

  return (
    <View>
      <Text>{title}</Text>
      {/*<View className="figures small">*/}
      <View>
        {/*{figures.map(figure =>*/}
        {/*  <div key={figure.id}>*/}
        {/*      <div className={'figure ' + figure.nameEn + ' ' + figure.color + ' mode' + mode}></div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </View>
    </View>
  );
};

export default LostFigures;


const styles = StyleSheet.create({
    lost: {
        width: 200,
        height: calculatedHeight,
        padding: 30,
        marginLeft: 50,
        backgroundColor: 'lightgray'
    },
    small_figures: {
        display: 'flex',
        flexWrap: 'wrap',
    }
});
