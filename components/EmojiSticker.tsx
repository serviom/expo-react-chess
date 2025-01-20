import {type ImageSource} from 'expo-image';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';

type Props = {
    imageSize: number;
    stickerSource: ImageSource;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {

    // @TODO use this code if need 2 and 3 clicks process simultaneously
    // const [tapCount, setTapCount] = useState(0);
    // const [timer, setTimer] = useState(null);
    //
    // // Функція для скидання лічильника натискань після певного часу
    // const resetTapCount = () => {
    //     setTapCount(0);
    // };
    //
    // // Жест для подвійного натискання
    // const doubleTap = Gesture.Tap().onEnd(() => {
    //     if (tapCount === 1) {
    //         // Якщо це друге натискання, вважаємо це як double tap
    //         console.log('Double Tap Detected');
    //         resetTapCount();
    //     } else {
    //         // Якщо перше натискання, збільшуємо лічильник
    //         setTapCount(tapCount + 1);
    //
    //         // Запускаємо таймер, щоб скинути лічильник через 300 мс
    //         if (timer) {
    //             clearTimeout(timer); // Очищаємо попередній таймер
    //         }
    //         setTimer(setTimeout(resetTapCount, 300)); // Скидаємо лічильник через 300 мс
    //     }
    // });
    //
    // // Жест для потрійного натискання
    // const tripleTap = Gesture.Tap().onEnd(() => {
    //     if (tapCount === 2) {
    //         // Якщо це третє натискання, вважаємо це як triple tap
    //         console.log('Triple Tap Detected');
    //         resetTapCount(); // Скидаємо лічильник після triple tap
    //     }
    // });
    // const raceGestures = Gesture.Simultaneous(doubleTap, tripleTap);

    const scaleImage = useSharedValue(imageSize);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const drag = Gesture.Pan().onChange(event => {
        translateX.value += event.changeX;
        translateY.value += event.changeY;
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
            ],
        };
    });

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
            console.log('numberOfTaps(2)')
            if (scaleImage.value !== imageSize * 2) {
                scaleImage.value = scaleImage.value * 2;
            } else {
                scaleImage.value = Math.round(scaleImage.value / 2);
            }
        });

    const tripleTap = Gesture.Tap()
        .numberOfTaps(3)
        .onStart(() => {
            console.log('numberOfTaps(3)')
            if (scaleImage.value !== imageSize * 3) {
                scaleImage.value = scaleImage.value * 3;
            } else {
                scaleImage.value = Math.round(scaleImage.value / 3);
            }
        });

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value),
        };
    });

    const raceGestures = Gesture.Race(doubleTap, tripleTap);

    return (
        <GestureDetector gesture={drag}>
            <Animated.View style={[containerStyle, { top: -350 }]}>
                <GestureDetector gesture={raceGestures}>
                    <Animated.Image
                        source={stickerSource}
                        resizeMode="contain"
                        style={[imageStyle, { width: imageSize, height: imageSize }]}
                    />
                </GestureDetector>
            </Animated.View>
        </GestureDetector>
    );
}

