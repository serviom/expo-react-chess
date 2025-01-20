import {CreateThemeOptions} from "@rneui/themed/dist/config/ThemeProvider";
// interface PlatformColors {
//     primary: string;
//     secondary: string;
//     grey: string;
//     searchBg: string;
//     success: string;
//     error: string;
//     warning: string;
// }
// export interface Colors {
//     readonly primary: string;
//     readonly secondary: string;
//     readonly background: string;
//     readonly white: string;
//     readonly black: string;
//     readonly grey0: string;
//     readonly grey1: string;
//     readonly grey2: string;
//     readonly grey3: string;
//     readonly grey4: string;
//     readonly grey5: string;
//     readonly greyOutline: string;
//     readonly searchBg: string;
//     readonly success: string;
//     readonly warning: string;
//     readonly error: string;
//     readonly disabled: string;
//     readonly divider: string;
//     readonly platform: {
//         ios: PlatformColors;
//         android: PlatformColors;
//         web: PlatformColors;
//         default: PlatformColors;
//     };
// }
// export declare const lightColors: Colors;
// export declare const darkColors: Colors;
// export {};




const themeOptions: CreateThemeOptions = {
    lightColors: {
        primary: '#2089dc', //#2089dc
        secondary: '#ca71eb',
        background: '#ffffff',
        white: '#ffffff',
        black: '#242424',
        grey0: '#393e42',
        grey1: '#43484d',
        grey2: '#5e6977',
        grey3: '#86939e',
        grey4: '#bdc6cf',
        grey5: '#e1e8ee',
        greyOutline: '#bbb',
        searchBg: '#303337',
        success: '#52c41a',
        error: '#ff190c',
        warning: '#faad14',
        disabled: 'hsl(208, 8%, 90%)'
        // platform: {
        //     android: {
        //         primary: '#e7e7e8'
        //     }
        // }
    },
    darkColors: {
        primary: '#439ce0', //#2089dc
        secondary: '#aa49eb',
        background: '#57595a',
        white: '#ffffff',
        black: '#242424',
        grey0: '#e1e8ee',
        grey1: '#bdc6cf',
        grey2: '#86939e',
        grey3: '#5e6977',
        grey4: '#43484d',
        grey5: '#393e42',
        greyOutline: '#bbb',
        searchBg: '#303337',
        success: '#439946',
        error: '#bf2c24',
        warning: '#cfbe27',
        disabled: 'hsl(208, 8%, 90%)'
    },
    components: {
        Button: (props, theme) => ({

        }),
        Input: (props, theme) => ({

        }),
    }
};

export default themeOptions;

