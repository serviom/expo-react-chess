import React, {useEffect, useState} from "react";
import {View, StyleSheet } from "react-native";
import {darkColors, lightColors, Switch, useThemeMode, Text, makeStyles} from '@rneui/themed';
import {StatusBar} from "expo-status-bar";
import Toast from "react-native-toast-message";
import {ThemedView} from "@/components/ThemedView";



type styleProps = {
    mode: string;
};

export const ThemeChangeProvider = ({ children }: { children?: React.ReactNode })=> {

    const { mode, setMode } = useThemeMode();
    const themeStyles = makeThemeStyles({mode});

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
            {/*,  { backgroundColor: mode === "dark" ? darkColors.background : lightColors.background}*/}
            <ThemedView style={[styles.container]}>
                <ThemedView style={[styles.viewWrapSwitch, styles.innerBlock, styles.topBlock, themeStyles.borderStyle]}>
                    <ThemedView style={styles.viewSwitch}>
                        <Text>Switch Color</Text>
                        <Switch
                            value={mode === "dark"}
                            onValueChange={toggleSwitch}
                        />
                    </ThemedView>
                </ThemedView>
                <ThemedView style={[styles.innerBlock, styles.centerBlock, themeStyles.borderStyle]}>
                    {children}
                </ThemedView>
                <ThemedView style={[styles.innerBlock, styles.bottomBlock, themeStyles.borderStyle ]}>
                    <Text>Bottom Block</Text>
                </ThemedView>
            </ThemedView>
        </>
    );
};

const makeThemeStyles = makeStyles((theme, props: styleProps) => ({
    borderStyle: {
        borderStyle: 'solid',
        borderColor: props.mode === "dark" ? lightColors.background : darkColors.background,
        borderWidth: 1,
    },
}));

const styles = StyleSheet.create({
    viewSwitch: {
        margin: 10,
        justifyContent: 'flex-end',
        textAlign: 'right',
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewWrapSwitch: {
        justifyContent: 'space-between',
        width: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width:'100%',
    },
    innerBlock: {
        width: '100%'
    },
    bottomBlock: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width:'100%',
    },
    centerBlock: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    topBlock: {
        justifyContent: 'flex-end',
    }
});