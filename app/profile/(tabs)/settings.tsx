import { Text, View, StyleSheet } from 'react-native';
import useAuthCheck from "@/hooks/useAuthCheck";

export default function SettingsScreen() {
    useAuthCheck();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Settings screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});