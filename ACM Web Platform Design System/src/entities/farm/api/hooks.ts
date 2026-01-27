import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { farmKeys } from '../model/keys';
import { farmApi } from './client';
import type {
    FarmListParams,
    FarmResponse,
    FarmDetailResponse,
    FarmCreateRequest,
    FarmUpdateRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// FARM REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to fetch list of farms with optional filtering/pagination
 */
export const useFarms = (
    params?: FarmListParams,
    options?: Omit<UseQueryOptions<FarmResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    console.log('[useFarms Entity Hook] Called with params:', params);
    console.log('[useFarms Entity Hook] Query key:', farmKeys.list(params));

    const result = useQuery({
        queryKey: farmKeys.list(params),
        queryFn: async () => {
            console.log('[useFarms Entity Hook] queryFn executing...');
            try {
                const data = await farmApi.list(params);
                console.log('[useFarms Entity Hook] API response:', data);
                return data;
            } catch (err) {
                console.error('[useFarms Entity Hook] API error:', err);
                throw err;
            }
        },
        staleTime: 5 * 60 * 1000,
        ...options,
    });

    console.log('[useFarms Entity Hook] Query state:', {
        status: result.status,
        isLoading: result.isLoading,
        isError: result.isError,
        data: result.data,
        error: result.error,
    });

    return result;
};

/**
 * Hook to fetch a single farm by ID
 */
export const useFarmById = (
    id: number,
    options?: Omit<UseQueryOptions<FarmDetailResponse, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: farmKeys.detail(id),
    queryFn: () => farmApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to create a new farm
 */
export const useCreateFarm = (
    options?: Omit<UseMutationOptions<FarmDetailResponse, Error, FarmCreateRequest>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: async (variables) => {
            console.log('[useCreateFarm Entity Hook] Mutation started with variables:', variables);
            try {
                const result = await farmApi.create(variables);
                console.log('[useCreateFarm Entity Hook] Mutation success:', result);
                return result;
            } catch (error) {
                console.error('[useCreateFarm Entity Hook] Mutation error:', error);
                throw error;
            }
        },
        onSuccess: (data, variables, context) => {
            console.log('[useCreateFarm Entity Hook] onSuccess called, invalidating queries');
            // Always invalidate cache first
            queryClient.invalidateQueries({
                queryKey: farmKeys.lists(),
                exact: false,
                refetchType: 'active'
            });
            console.log('[useCreateFarm Entity Hook] Queries invalidated, calling feature callback');
            // Then call the feature layer's callback if provided
            options?.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            console.error('[useCreateFarm Entity Hook] onError called:', error);
            // Call the feature layer's error callback if provided
            options?.onError?.(error, variables, context);
        },
    });
};

/**
 * Hook to update an existing farm
 */
export const useUpdateFarm = (
    options?: Omit<UseMutationOptions<FarmDetailResponse, Error, { id: number; data: FarmUpdateRequest }>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: ({ id, data }) => farmApi.update(id, data),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: farmKeys.detail(variables.id) });
            // Invalidate all farm list queries regardless of parameters
            queryClient.invalidateQueries({
                queryKey: farmKeys.lists(),
                exact: false,
                refetchType: 'active'
            });
            // Then call the feature layer's callback if provided
            options?.onSuccess?.(data, variables, context);
        },
    });
};

/**
 * Hook to delete/deactivate a farm
 */
export const useDeleteFarm = (
    options?: Omit<UseMutationOptions<void, Error, { id: number; name: string }>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        ...options,
        mutationFn: (params) => {
            console.log('[useDeleteFarm Entity] Deleting farm with params:', params);
            console.log('[useDeleteFarm Entity] Farm ID:', params.id);
            return farmApi.delete(params.id);
        },
        onSuccess: (data, variables, context) => {
            // Always invalidate cache first
            queryClient.invalidateQueries({
                queryKey: farmKeys.lists(),
                exact: false,
                refetchType: 'active'
            });
            // Then call the feature layer's callback if provided
            // variables contains { id, name } passed to mutate()
            options?.onSuccess?.(data, variables, context);
        },
    });
};
