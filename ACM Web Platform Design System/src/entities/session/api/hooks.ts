import {
    useMutation,
    useQuery,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { sessionKeys } from '../model/keys';
import { sessionApi } from './client';
import type {
    AuthSignUpRequest,
    AuthSignUpResponse,
    AuthSignInRequest,
    AuthSignInResponse,
    AuthSignOutRequest,
    AuthRefreshRequest,
    AuthRefreshResponse,
    AuthResetPasswordRequest,
    AuthIntrospectResponse,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// SESSION REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

export const useAuthSignUp = (
    options?: UseMutationOptions<AuthSignUpResponse, Error, AuthSignUpRequest>
) => useMutation({
    mutationKey: sessionKeys.signUp(),
    mutationFn: sessionApi.signUp,
    ...options,
});

export const useAuthSignIn = (
    options?: UseMutationOptions<AuthSignInResponse, Error, AuthSignInRequest>
) => useMutation({
    mutationKey: sessionKeys.signIn(),
    mutationFn: sessionApi.signIn,
    ...options,
});

export const useAuthSignOut = (
    options?: UseMutationOptions<void, Error, AuthSignOutRequest>
) => useMutation({
    mutationKey: sessionKeys.signOut(),
    mutationFn: sessionApi.signOut,
    ...options,
});

export const useAuthRefresh = (
    options?: UseMutationOptions<AuthRefreshResponse, Error, AuthRefreshRequest>
) => useMutation({
    mutationKey: sessionKeys.refresh(),
    mutationFn: sessionApi.refresh,
    ...options,
});

export const useAuthResetPassword = (
    options?: UseMutationOptions<void, Error, AuthResetPasswordRequest>
) => useMutation({
    mutationKey: sessionKeys.resetPassword(),
    mutationFn: sessionApi.resetPassword,
    ...options,
});

export const useAuthIntrospect = (
    token: string,
    options?: Omit<UseQueryOptions<AuthIntrospectResponse, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: sessionKeys.introspect(token),
    queryFn: () => sessionApi.introspect({ token }),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    ...options,
});
