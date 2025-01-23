export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthResponse {
    user: IResponseUserAuth;
    tokens: ITokens
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
    ProfileSettings = '/profile/(tabs)/settings',
    ProfileInfo = '/profile/(tabs)/info',
    About = '/about',
    Home = '/home',
    Screen = '/screen',
}

