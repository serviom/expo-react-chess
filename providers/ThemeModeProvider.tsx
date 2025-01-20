import React from "react";
import baseTheme from "@/themes/baseTheme";
import { createTheme, ThemeProvider } from '@rneui/themed';

export const ThemeModeProvider = ({ children }: { children: React.ReactNode })=> {
    return <ThemeProvider theme={createTheme(baseTheme)}>{children}</ThemeProvider>
}



