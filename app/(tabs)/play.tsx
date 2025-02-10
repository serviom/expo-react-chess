import {ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import React from 'react';
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import Chess from "../../components/Chess";

const PlayScreen = ()=> {

    return (
        <ThemeChangeProvider>
            <Chess />
        </ThemeChangeProvider>
    );
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
    },
});

export default PlayScreen;
