import React, {FC} from 'react';
import BoardComponent from "./BoardComponent";
import Notice from "./Notice";
import {Text, View} from "react-native";
// import {ISelectOption} from "../ui-kit/Select";
import Control from "@/components/Control/Control";


const Chess: FC = () => {

    function getSeconds() {
        const now = new Date();
        return now.getSeconds();
    }

    return (
        <View style={{ width: "100%", height: "100%" }}>
            <View>
                <Text>{getSeconds()}</Text>
            </View>
            <View style={{ width: "100%" }}>
                <Notice />
            </View>
            <View>
                {/*<PopupBoxSelectFigureComponent*/}
                {/*    isOpenedSelectFigure={isOpenedSelectFigure}*/}
                {/*    setIsOpenedSelectFigure={setIsOpenedSelectFigure}*/}
                {/*    targetCell={myState.current?.targetCell}*/}
                {/*    setFigure={setFigure}*/}
                {/*/>*/}
                <View>
                    <BoardComponent />
                </View>
                <View>
                    <Control/>
                </View>
                <View>
                    {/*<LostFigures*/}
                    {/*    title="Чорні фігури"*/}
                    {/*    figures={board.lostBlackFigures}*/}
                    {/*/>*/}
                    {/*<LostFigures*/}
                    {/*    title="Білі фігури"*/}
                    {/*    figures={board.lostWhiteFigures}*/}
                    {/*/>*/}
                </View>
            </View>
        </View>
    );
};

export default Chess;