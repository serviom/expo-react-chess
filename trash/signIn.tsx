import { Button, Dimensions, Keyboard, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/style/colors';
import { fontSizes } from '@/style/fontSize';
import { fonts } from '@/style/fonts';
import { moderateScale } from '@/style/scalingUnit';
import { useContext, useEffect, useRef, useState } from 'react';
import { LoginForm } from '@/components/forms/auth/LoginForm';
import { NavigationType } from '@/types';
import { StateType, useAppDispatch } from '@app/features/store';
import { authLogin } from '@app/features/auth/authActions';
import { PlatformTypes } from '@app/types';
import { PushNotificationContext } from '@/PushNofiticationContext';
import { useSelector } from 'react-redux';
import * as Device from 'expo-device';
import { getDeviceInfo } from '@/deviceInfo';

const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);
const window = Dimensions.get('window');

export const signIn = ({ navigation }: { navigation: NavigationType }) => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const expoPushToken = useContext(PushNotificationContext);

    const dispatch = useAppDispatch();

    const { user } = useSelector((state: StateType) => state.auth);

    useEffect(() => {
        if (user) {
            navigation.push('dashboard');
        }
    }, [user]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const onSignup = () => {
        navigation.push('registration');
    };

    const onSubmit = (values: { email: string; password: string }) => {
        return dispatch(
            authLogin({
                ...values,
                platform: Platform.OS as PlatformTypes,
                pushToken: expoPushToken,
                ...getDeviceInfo(),
            }),
        )
            .unwrap()
            .then((json) => {
                navigation.push('dashboard');
                return json;
            });
    };

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <StatusBar backgroundColor={colors.primary} />
                <View style={styles.logoWrapper}>
                    <Text style={styles.logoText}>FreeMeet</Text>
                </View>
                <View style={styles.containerStyle}>
                    <View style={styles.sliderContainerStyle}>
                        <View style={styles.slider}></View>
                    </View>
                </View>
                <View style={styles.wrapper}>
                    <View style={{ flex: 1 }}>
                        <LoginForm onSubmit={onSubmit} />
                        {!isKeyboardVisible ? (
                            <>
                                <View style={{ marginTop: 10 }}>
                                    <Text>Don't have an account yet?</Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Button testID={'btn-signup'} color={'#ccc'} title="Sign up now!" onPress={() => onSignup()} />
                                </View>
                            </>
                        ) : null}
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles: any = StyleSheet.create({
    containerStyle: {
        alignSelf: 'center',
        width: window.width,
        height: window.width / 7,
        overflow: 'hidden',
        transform: [{ rotate: '180deg' }],
        backgroundColor: 'transparent',
        marginTop: 20,
    },
    sliderContainerStyle: {
        borderRadius: window.width,
        width: window.width * 2,
        height: window.width * 2,
        marginLeft: -(window.width / 2),
        position: 'absolute',
        bottom: 0,
        overflow: 'hidden',
    },
    slider: {
        height: window.width / 7,
        width: window.width,
        position: 'absolute',
        bottom: 0,
        marginLeft: window.width / 2,
        backgroundColor: colors.white,
    },
    container: {
        backgroundColor: colors.primary,
        flex: 1,
    },
    backImage: {
        width: SCREEN_WIDTH + 20,
        height: moderateScale(300),
        resizeMode: 'cover',
        position: 'absolute',
        alignSelf: 'center',
    },
    logoWrapper: {
        padding: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    logoText: {
        fontFamily: fonts.SemiBold,
        fontSize: fontSizes.big,
        color: colors.white,
        marginLeft: 10,
        marginTop: 4,
    },
    wrapper: {
        backgroundColor: colors.white,
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'flex-start',
    },
    loginHeadText: {
        color: colors.black,
        fontSize: fontSizes.medium,
        fontFamily: fonts.SemiBold,
        marginRight: 40,
    },
    mobileNumberWrapper: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    subHead: {
        color: colors.grey,
        fontSize: fontSizes.small,
        fontFamily: fonts.Medium,
    },
    countryWrapper: {
        flexDirection: 'row',
        borderBottomWidth: 1.2,
        borderBottomColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    countryFlagWrapper: {
        flexDirection: 'row',
    },
    countryName: {
        marginLeft: 12,
        fontSize: fontSizes.medium,
        fontFamily: fonts.Medium,
        color: colors.black,
    },
    arrowIcon: {
        justifyContent: 'flex-end',
    },
    phoneNumberWrapper: {
        flexDirection: 'row',
        marginTop: 10,
    },
    textInput: {
        padding: 0,
        paddingBottom: 2,
        paddingHorizontal: 4,
        borderBottomWidth: 1.2,
        borderBottomColor: colors.primary,
        fontSize: 16,
        fontFamily: fonts.Medium,
        color: colors.black,
    },
    textInputError: {
        borderBottomColor: colors.red,
    },
    loginContainer: {
        backgroundColor: colors.primary,
        width: 60,
        height: 60,
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 60 / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpTextInputContainer: {
        marginTop: 40,
        flexDirection: 'row',
    },
    otpTextInput: {
        padding: 0,
        height: 50,
        paddingHorizontal: 4,
        borderBottomWidth: 1.2,
        borderBottomColor: colors.primary,
        fontFamily: fonts.Medium,
        color: colors.primary,
        width: SCREEN_WIDTH / 5,
        marginRight: 10,
        fontSize: 24,
        textAlign: 'center',
    },
    otpSubText: {
        fontSize: fontSizes.verySmall,
        fontFamily: fonts.Regular,
    },
    otpSubTextSpan: {
        fontSize: fontSizes.small,
        fontFamily: fonts.Bold,
        color: colors.primary,
    },
});
