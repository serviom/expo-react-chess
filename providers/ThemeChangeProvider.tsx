import React, {useEffect, useState} from "react";
import {View, StyleSheet } from "react-native";
import {darkColors, lightColors, Switch, useThemeMode} from '@rneui/themed';
import {mode} from "native-base/lib/typescript/theme/tools";
import {StatusBar} from "expo-status-bar";
import Toast from "react-native-toast-message";

export const ThemeChangeProvider = ({ children }: { children?: React.ReactNode })=> {

    const { mode, setMode } = useThemeMode();

    const toggleSwitch = () => {
        setMode(mode === "dark" ? "light" : "dark");
    };

    useEffect(() => {
        setMode('light');
    }, []);

    return (
        <>
            <StatusBar style={mode} />
            <Toast />
            <View style={[styles.container, { backgroundColor: mode === "dark" ? darkColors.background : lightColors.background}]}>
                <View style={styles.viewSwitch}>
                    <Switch
                        value={mode === "dark"}
                        onValueChange={toggleSwitch}
                    />
                </View>
                {children}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    viewSwitch: {
        margin: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});