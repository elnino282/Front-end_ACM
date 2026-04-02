import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { cropKeys } from '../model/keys';
import { cropApi } from './client';
import type {
    CropListParams,
    Crop,
    CropRequest,
} from '../model/types';

// Context types for optimistic updates
type CreateCropContext = {
    previousCrops: [readonly unknown[], Crop[] | undefined][];
};
type UpdateCropContext = {
    previousDetail: Crop | undefined;
    previousLists: [readonly unknown[], Crop[] | undefined][];
};
type DeleteCropContext = {
    previousCrops: [readonly unknown[], Crop[] | undefined][];
};

// ═══════════════════════════════════════════════════════════════
// CROP REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to fetch list of crops with optional keyword filtering
 */
export const useCrops = (
    params?: CropListParams,
    options?: Omit<UseQueryOptions<Crop[], Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: cropKeys.list(params),
    queryFn: () => cropApi.list(params),
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch a single crop by ID
 */
export const useCropById = (
    id: number,
    options?: Omit<UseQueryOptions<Crop, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: cropKeys.detail(id),
    queryFn: () => cropApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to create a new crop with optimistic updates
 */
export const useCreateCrop = (
    options?: Omit<UseMutationOptions<Crop, Error, CropRequest, CreateCropContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Crop, Error, CropRequest, CreateCropContext>({
        mutationFn: cropApi.create,
        onMutate: async (newCrop) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: cropKeys.lists() });

            // Snapshot previous value
            const previousCrops = queryClient.getQueriesData<Crop[]>({
                queryKey: cropKeys.lists(),
            });

            // Optimistically add new crop to all matching queries
            queryClient.setQueriesData<Crop[]>(
                { queryKey: cropKeys.lists() },
                (old) => old ? [
                    { ...newCrop, id: Date.now() } as Crop,
                    ...old,
                ] : old
            );

            return { previousCrops };
        },
        onError: (_err, _newCrop, context) => {
            // Rollback on error
            if (context?.previousCrops) {
                context.previousCrops.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            // Always refetch after mutation settles
            queryClient.invalidateQueries({ queryKey: cropKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to update an existing crop with optimistic updates
 */
export const useUpdateCrop = (
    options?: Omit<UseMutationOptions<Crop, Error, { id: number; data: CropRequest }, UpdateCropContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Crop, Error, { id: number; data: CropRequest }, UpdateCropContext>({
        mutationFn: ({ id, data }) => cropApi.update(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: cropKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: cropKeys.lists() });

            // Snapshot previous values
            const previousDetail = queryClient.getQueryData<Crop>(cropKeys.detail(id));
            const previousLists = queryClient.getQueriesData<Crop[]>({
                queryKey: cropKeys.lists(),
            });

            // Optimistically update detail
            if (previousDetail) {
                queryClient.setQueryData<Crop>(cropKeys.detail(id), {
                    ...previousDetail,
                    ...data,
                });
            }

            // Optimistically update lists
            queryClient.setQueriesData<Crop[]>(
                { queryKey: cropKeys.lists() },
                (old) => old?.map((item) =>
                    item.id === id ? { ...item, ...data } : item
                )
            );

            return { previousDetail, previousLists };
        },
        onError: (_err, { id }, context) => {
            // Rollback on error
            if (context?.previousDetail) {
                queryClient.setQueryData(cropKeys.detail(id), context.previousDetail);
            }
            if (context?.previousLists) {
                context.previousLists.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: cropKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: cropKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to delete a crop with optimistic updates
 */
export const useDeleteCrop = (
    options?: Omit<UseMutationOptions<void, Error, number, DeleteCropContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number, DeleteCropContext>({
        mutationFn: cropApi.delete,
        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: cropKeys.lists() });

            // Snapshot previous value
            const previousCrops = queryClient.getQueriesData<Crop[]>({
                queryKey: cropKeys.lists(),
            });

            // Optimistically remove crop from lists
            queryClient.setQueriesData<Crop[]>(
                { queryKey: cropKeys.lists() },
                (old) => old?.filter((item) => item.id !== id)
            );

            return { previousCrops };
        },
        onError: (_err, _id, context) => {
            // Rollback on error
            if (context?.previousCrops) {
                context.previousCrops.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: cropKeys.lists() });
        },
        ...options,
    });
};
