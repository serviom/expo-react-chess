import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { api } from '../services/api';
import {useDispatch} from "react-redux";

const storeToolkit = configureStore({
    reducer: {
        auth: authReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware), // Додаємо middleware для роботи з RTK Query
});

export type RootState = ReturnType<typeof storeToolkit.getState>;

export type AppDispatch = typeof storeToolkit.dispatch;

export const useAppDispatch = () => useDispatch<typeof storeToolkit.dispatch>();

export default storeToolkit;