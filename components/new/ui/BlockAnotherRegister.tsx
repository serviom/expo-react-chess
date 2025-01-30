import React from 'react';
import {StyleSheet} from "react-native";
import {ThemedView} from "@/components/ThemedView";
import {Text} from '@rneui/themed';
import {Route} from "@/shared/types";
import BlockEnter from "@/components/new/ui/blockAnotherEnter/blockEnter";

interface BlockAnotherEnterProps {
}

const BlockAnotherEnter: React.FC<BlockAnotherEnterProps> = () => {
    return (
        <ThemedView style={[styles.container]}>
            <BlockEnter href={Route.SignInByGoogle}>
                <Text>
                    Увійти за допомогою Google
                </Text>
            </BlockEnter>
        </ThemedView>
    );
};

export default BlockAnotherEnter;

const styles = StyleSheet.create({
    container: {
        margin: 10,
        width: '100%',
    }
});