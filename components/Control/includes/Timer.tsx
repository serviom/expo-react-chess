import React, {FC, useContext, useEffect, useRef, useState} from "react";
import {Text, View} from "react-native";
import {PlayerTypes} from "@/constants";
import {getTimeInNumber, roundTime} from "@/utils/date";
import {useControl} from "@/providers/ControlProvider";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/features/store";
import {BLACK_WON, WHITE_WON} from "@/models/Board";
import {setFinish} from "@/features/control/controlSlice";
import {useModal} from "@/providers/ModalProvider";

// interface TimerProps  {
//     finish: boolean;
//     analyze: boolean;
//     spentTimeForMove: number | undefined;
//     start: boolean;
// }

interface TimerProps  {
}

const matchTime = 300 * 1000; // seconds * 1000
const stepTime = 50; // ms

const Timer: FC<TimerProps> = ({} : TimerProps) => {

    const [blackTime, setBlackTime] = useState<number>(matchTime);
    const [whiteTime, setWhiteTime] = useState<number>(matchTime);

    const startMoveTime = useRef<number | undefined>(undefined);
    const spentTimeForMove = useRef<number | undefined>(undefined);

    const fullMatchTimeBlack = useRef<number>(matchTime);
    const fullMatchTimeWhite = useRef<number>(matchTime);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null)
    const {currentPlayer} = useControl();

    const {start, analyze, finish, pause} = useSelector((state: RootState) => state.control)
    const dispatch = useAppDispatch();
    const {openModal} = useModal();

    useEffect(() => {
        if (!currentPlayer) {
            return;
        }

        if (startMoveTime.current !== undefined) {
            spentTimeForMove.current = getTimeInNumber() - startMoveTime.current;
        }

        startMoveTime.current = getTimeInNumber();


        if (!finish && !analyze) {
            if (spentTimeForMove) {
                if (currentPlayer === PlayerTypes.BLACK) {
                    fullMatchTimeBlack.current = fullMatchTimeBlack.current - spentTimeForMove.current;
                    setBlackTime(roundTime(fullMatchTimeBlack.current));
                } else {
                    fullMatchTimeWhite.current = fullMatchTimeWhite.current - spentTimeForMove.current
                    setWhiteTime(roundTime(fullMatchTimeWhite.current));
                }
            }

            if (currentPlayer) {
                startTimer();
            }
        }

        return () => {
            if (timer?.current !== null) {
                clearTimeout(timer.current);
            }
            timer.current = null;
        };

    }, [currentPlayer]);

    function decrementBlackTimer() {
        setBlackTime(prev => prev - stepTime);
    }

    function decrementWhiteTimer() {
        setWhiteTime(prev => prev - stepTime);
    }

    function startTimer() {
        if (timer.current) {
            clearInterval(timer.current)
        }
        const callback = currentPlayer === PlayerTypes.WHITE ? decrementWhiteTimer : decrementBlackTimer
        timer.current = setInterval(callback, stepTime)
    }

    useEffect(() => {
        if(!analyze) {
            if (whiteTime <= 0 || blackTime <= 0) {
                timeOver();
                if (timer.current) {
                    clearInterval(timer.current)
                }
            }
        }
    },[whiteTime, blackTime]);

    useEffect(() => {
        if (finish !== undefined && finish) {
            if (timer.current) {
                clearInterval(timer.current)
            }
        }
    },[finish]);

    const timeOver = () => {
        const msg = currentPlayer === PlayerTypes.WHITE ? BLACK_WON : WHITE_WON;
        if (!finish) {
            openModal(msg);
        }
        dispatch(setFinish(true))
        return;
    }

    return (
            start && (
            <View>
                <Text>Чорні - {blackTime / 1000} сек.</Text>
                <Text>Білі - {whiteTime / 1000} сек. </Text>
            </View>
        )
    )

}

export default Timer;