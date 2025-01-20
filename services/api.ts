import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {getAccessToken} from "@/services/SecureStore";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: apiBaseUrl,
        prepareHeaders: async (headers, { getState: any }) => {
            const token = await getAccessToken() || '';
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({})
});


