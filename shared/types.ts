export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthResponse {
    user: IResponseUserAuth;
    tokens: ITokens
}

export interface IForgotPasswordResponse extends IStatusResponse {
    redirectUrl: string;
}

export interface IResetPasswordResponse extends IStatusResponse {
    redirectUrl: string;
}

export interface IStatusResponse {
    status: number;
}

export enum Role {
    Admin = 'admin',
    Moderator = 'moderator',
    Customer = 'customer',
}

export interface IResponseUserAuth {
    id: string;
    role: Role;
    secondName?: string;
    name: string;
    username: string;
    email: string;
    permissions: string[];
    organizationId: string;
}

export enum Route {
    Logout = '/logout',
    SignUp = '/signUp',
    SignIn = '/signIn',
    SignInByGoogle = '/signInByGoogle',
    ForgotPassword = '/forgotPassword',
    ProfileSettings = '/profile/(tabs)/settings',
    ProfileInfo = '/profile/(tabs)/info',
    About = '/about',
    Home = '/home',
    Screen = '/screen',
}

