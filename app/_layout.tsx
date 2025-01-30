import {Slot, SplashScreen, Stack} from "expo-router";
import React, {useEffect} from "react";
import {StatusBar} from "expo-status-bar";
import {ConnectionChecker} from "@/components/ConnectionChecker";
import Toast from 'react-native-toast-message';
import StoreProvider from "@/providers/StoreProvider";
import {Text, View} from "react-native";
import {KeyStoreProvider} from "@/providers/KeyStoreProvider";
import baseTheme from "@/themes/baseTheme";
import { Button, createTheme, ThemeProvider } from '@rneui/themed';

import { useThemeMode } from '@rneui/themed';
import {ThemeModeProvider} from "@/providers/ThemeModeProvider";
import {ThemeChangeProvider} from "@/providers/ThemeChangeProvider";

const RootLayout = () => {
    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 3000);

    const migrateDbIfNeeded = async (db: any) => {
        await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, dialogId VARCHAR KET);
      `);
    };

    function CustomErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Something went wrong:</Text>
                <Text>{error.message}</Text>
                <Button title="Retry" onPress={retry} />
            </View>
        );
    }


    // const theme = createTheme({
    //     lightColors: {
    //         ...Platform.select({
    //             default: lightColors.platform.android,
    //             ios: lightColors.platform.ios,
    //         }),
    //     },
    // });

    return (
        <ThemeModeProvider>
            <StoreProvider>
                <KeyStoreProvider>
                    {/*<PushNotificationProvider>*/}
                        {/*<SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded} useSuspense>*/}
                            {/*<WebSocketProvider>*/}
                            {/*    <Wrap>*/}
                                    {/*<ErrorBoundary FallbackComponent={CustomErrorFallback}>*/}

                                    {/*<ConnectionChecker />*/}
                                    <Stack>
                                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                        <Stack.Screen name="+not-found" />
                                    </Stack>
                                    {/*</ErrorBoundary>*/}
                            {/*    </Wrap>*/}
                            {/*</WebSocketProvider>*/}
                        {/*</SQLiteProvider>*/}
                    {/*</PushNotificationProvider>*/}
                </KeyStoreProvider>
            </StoreProvider>
        </ThemeModeProvider>

    );
};

export default RootLayout;