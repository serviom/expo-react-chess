import {AuthActionEnum, SetIsUserAction, SetErrorAction, SetIsLoadingAction, SetUserAction} from "./types";
import {IUser} from "../../../models/IUser";
import {AppDispatch} from "../../index";
import UserService from "../../../api/UserService";

export const AuthActionCreators = {
    setUser: (user: IUser): SetUserAction => ({type: AuthActionEnum.SET_USER, payload: user}),
    setIsUser: (auth: boolean): SetIsUserAction => ({type: AuthActionEnum.SET_IS_USER, payload: auth}),
    setIsLoading: (isLoading: boolean): SetIsLoadingAction => ({type: AuthActionEnum.SET_IS_LOADING, payload: isLoading}),
    setError: (error: string): SetErrorAction => ({type: AuthActionEnum.SET_ERROR, payload: error}),
    login: (username: string, password: string) => async (dispatch: AppDispatch) => {
        try {
            dispatch(AuthActionCreators.setIsLoading(true));
            setTimeout(async () => {
                const response = await UserService.getUsers()
                const mockUser = response.data.find(user => user.username === username && user.password === password);
                if (mockUser) {
                    localStorage.setItem('auth', 'true');
                    localStorage.setItem('username', mockUser.username);
                    dispatch(AuthActionCreators.setUser(mockUser));
                    dispatch(AuthActionCreators.setIsUser(true))
                } else {
                    dispatch(AuthActionCreators.setError('Некорректный логин или пароль'));
                }
                dispatch(AuthActionCreators.setIsLoading(false));
            }, 1000)
        } catch (e) {
            dispatch(AuthActionCreators.setError('Произошла ошибка при логине'))
        }
    },
    logout: () => async (dispatch: AppDispatch) => {
        localStorage.removeItem('auth')
        localStorage.removeItem('username')
        dispatch(AuthActionCreators.setUser({} as IUser));
        dispatch(AuthActionCreators.setIsUser(false))
    }
}