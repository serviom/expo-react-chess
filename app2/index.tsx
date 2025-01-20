import {StyleSheet, View, Text} from "react-native";
import React from "react";

const HomePage = () => (
    <View style={styles.container}><Text>Home page</Text></View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});

export default HomePage;