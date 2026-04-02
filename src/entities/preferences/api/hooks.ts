import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { preferencesApi } from './client';
import { preferencesKeys } from '../model/keys';
import type { Preferences, PreferencesUpdateRequest } from '../model/types';

export const DEFAULT_PREFERENCES: Preferences = {
    currency: 'VND',
    weightUnit: 'KG',
    locale: 'vi-VN',
};

export const getPreferencesQueryOptions = () => ({
    queryKey: preferencesKeys.me(),
    queryFn: preferencesApi.getMe,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
});

export const usePreferencesMe = (
    options?: Omit<UseQueryOptions<Preferences, Error>, 'queryKey' | 'queryFn'>
) => {
    const { isAuthenticated } = useAuth();

    return useQuery({
        ...getPreferencesQueryOptions(),
        enabled: isAuthenticated,
        placeholderData: DEFAULT_PREFERENCES,
        ...options,
    });
};

type UpdateContext = { previous: Preferences | undefined };

export const useUpdatePreferences = (
    options?: UseMutationOptions<Preferences, Error, PreferencesUpdateRequest, UpdateContext>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: preferencesKeys.update(),
        mutationFn: preferencesApi.updateMe,
        onMutate: async (data) => {
            await queryClient.cancelQueries({ queryKey: preferencesKeys.me() });
            const previous = queryClient.getQueryData<Preferences>(preferencesKeys.me());
            const optimistic = {
                ...(previous ?? DEFAULT_PREFERENCES),
                ...data,
            };
            queryClient.setQueryData(preferencesKeys.me(), optimistic);
            return { previous };
        },
        onError: (_error, _data, context) => {
            if (context?.previous) {
                queryClient.setQueryData(preferencesKeys.me(), context.previous);
            }
        },
        onSuccess: (result) => {
            queryClient.setQueryData(preferencesKeys.me(), result);
        },
        ...options,
    });
};
