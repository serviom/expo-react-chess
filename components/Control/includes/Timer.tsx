import React, {FC, useContext, useEffect, useRef, useState} from "react";
import {Text, View} from "react-native";
import {PlayerTypes} from "@/constants";
import {useControl} from "@/providers/ControlProvider";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";
import {BLACK_WON, WHITE_WON} from "@/models/Board";
import {endGame, setFinish} from "@/features/control/controlSlice";
import {useModal} from "@/providers/ModalProvider";


interface TimerProps  {

}

const matchTime = 300 * 1000; // seconds * 1000
const stepTime = 50; // ms

const Timer: FC<TimerProps> = ({} : TimerProps) => {

    const [blackTime, setBlackTime] = useState<number>(matchTime);
    const [whiteTime, setWhiteTime] = useState<number>(matchTime);

    const startMoveTime = useRef<number>(0);
    const spentTimeForMove = useRef<number>(0);

    const timer = useRef<null | ReturnType<typeof setInterval>>(null)
    const {currentPlayer} = useControl();

    const {start, analyze, finish} = useSelector((state: RootState) => state.control)
    const dispatch = useAppDispatch();
    const {openModal} = useModal();

    useEffect(() => {
        if (!currentPlayer && !start) {
            return;
        }

        if (currentPlayer) {
            if (timer.current) {
                clearInterval(timer.current)
            }
            startTimer();
        }

        return () => {
            if (timer?.current !== null) {
                clearTimeout(timer.current);
            }
            timer.current = null;
        };

    }, [currentPlayer, start]);

    function decrementBlackTimer() {
        setBlackTime(prev => prev - stepTime);
    }

    function decrementWhiteTimer() {
        setWhiteTime(prev => prev - stepTime);
    }

    function startTimer() {
        const callback = currentPlayer === PlayerTypes.WHITE ? decrementWhiteTimer : decrementBlackTimer
        timer.current = setInterval(callback, stepTime)
    }

    useEffect(() => {
        if(!analyze && start) {
            if (whiteTime <= 0 || blackTime <= 0) {
                timeOver();
                if (timer.current) {
                    clearInterval(timer.current)
                }
            }
        }
    }, [whiteTime, blackTime]);

    function clearTimeValues() {
        startMoveTime.current = 0;
        spentTimeForMove.current = 0;
        setWhiteTime(matchTime);
        setBlackTime(matchTime);
    }

    useEffect(() => {
        if (!start) {
            if (timer.current) {
                clearInterval(timer.current)
            }
            clearTimeValues();
        }

        if (start) {
            if (timer.current) {
                clearInterval(timer.current)
            }
            clearTimeValues();
            startTimer();
        }

    }, [start]);

    const timeOver = () => {
        const msg = currentPlayer === PlayerTypes.WHITE ? BLACK_WON : WHITE_WON;
        if (!finish) {
            openModal(msg);
        }
        dispatch(endGame());
    }



    return (
        start > 0 &&
            <View>
                <Text>{`Чорні - ${Math.round(blackTime/1000)} сек.`}</Text>
                <Text>{`Білі - ${Math.round(whiteTime/1000)} сек. `}</Text>
            </View>
    )
}

export default Timer;