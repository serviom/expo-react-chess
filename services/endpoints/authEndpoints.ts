import { api } from '../api';
import { IAuthResponse } from '@/shared/types';

export const authEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<IAuthResponse, { email: string; password: string }>({
            query: (credentials) => ({
                url: '/auth/signIn',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: (params) => {
                console.log('Logout params:', params);
                return {
                    url: '/auth/logout',
                    method: 'POST',
                    body: params,
                };
            },
        }),
        getUserProfile: builder.query({
            query: ({}) => `/auth/user-profile`,
        }),
    }),
    overrideExisting: false,
});

export const { useSignInMutation, useLogoutMutation, useGetUserProfileQuery } = authEndpoints;