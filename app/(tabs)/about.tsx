import {StyleSheet, View} from 'react-native';
import {useSelector} from "react-redux";
import {RootState} from "@/features/store";
import {useRouter} from "expo-router";
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";
import React from 'react';
import { Text } from '@rneui/themed';
const AboutScreen = () => {

    return (
        <ThemeChangeProvider>
            <View>
                <Text>About screen</Text>
            </View>
        </ThemeChangeProvider>
    );
}

export default AboutScreen;
