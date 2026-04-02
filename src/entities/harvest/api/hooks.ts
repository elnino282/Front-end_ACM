import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import type { PageResponse } from '@/shared/api/types';
import { harvestKeys } from '../model/keys';
import { harvestApi } from './client';
import type {
    HarvestListParams,
    Harvest,
    HarvestSummary,
    HarvestCreateRequest,
    HarvestUpdateRequest,
} from '../model/types';

// Context types for optimistic updates
type CreateHarvestContext = {
    previousHarvests: PageResponse<Harvest> | undefined;
};
type UpdateHarvestContext = {
    previousDetail: Harvest | undefined;
    previousList: PageResponse<Harvest> | undefined;
};
type DeleteHarvestContext = {
    previousHarvests: PageResponse<Harvest> | undefined;
};

/**
 * Hook to fetch all farmer harvests with optional seasonId filter
 * This is the primary hook for the Harvest page "All Seasons" / filtered view
 */
export const useAllFarmerHarvests = (
    params?: HarvestListParams,
    options?: Omit<UseQueryOptions<PageResponse<Harvest>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: harvestKeys.listAll(params),
    queryFn: () => harvestApi.listAll(params),
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch harvest summary/KPI data
 */
export const useHarvestSummary = (
    seasonId?: number,
    options?: Omit<UseQueryOptions<HarvestSummary, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: harvestKeys.summary(seasonId),
    queryFn: () => harvestApi.getSummary(seasonId),
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch paginated list of harvests for a season
 * @deprecated Use useAllFarmerHarvests with seasonId in params instead
 */
export const useHarvestsBySeason = (
    seasonId: number,
    params?: HarvestListParams,
    options?: Omit<UseQueryOptions<PageResponse<Harvest>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: harvestKeys.listBySeason(seasonId, params),
    queryFn: () => harvestApi.listBySeason(seasonId, params),
    enabled: seasonId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch a single harvest by ID
 */
export const useHarvestById = (
    id: number,
    options?: Omit<UseQueryOptions<Harvest, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: harvestKeys.detail(id),
    queryFn: () => harvestApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to create a new harvest with optimistic updates
 */
export const useCreateHarvest = (
    seasonId: number,
    options?: Omit<UseMutationOptions<Harvest, Error, HarvestCreateRequest, CreateHarvestContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Harvest, Error, HarvestCreateRequest, CreateHarvestContext>({
        mutationFn: (data) => harvestApi.create(seasonId, data),
        onMutate: async (newHarvest) => {
            const listKey = harvestKeys.listBySeason(seasonId);
            await queryClient.cancelQueries({ queryKey: listKey });

            const previousHarvests = queryClient.getQueryData<PageResponse<Harvest>>(listKey);

            if (previousHarvests) {
                queryClient.setQueryData<PageResponse<Harvest>>(listKey, {
                    ...previousHarvests,
                    items: [
                        { ...newHarvest, id: Date.now(), seasonId, createdAt: new Date().toISOString() } as Harvest,
                        ...previousHarvests.items,
                    ],
                    totalElements: previousHarvests.totalElements + 1,
                });
            }

            return { previousHarvests };
        },
        onError: (_err, _newHarvest, context) => {
            if (context?.previousHarvests) {
                queryClient.setQueryData(harvestKeys.listBySeason(seasonId), context.previousHarvests);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: harvestKeys.listBySeason(seasonId) });
        },
        ...options,
    });
};

/**
 * Hook to update a harvest with optimistic updates
 */
export const useUpdateHarvest = (
    seasonId: number,
    options?: Omit<UseMutationOptions<Harvest, Error, { id: number; data: HarvestUpdateRequest }, UpdateHarvestContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Harvest, Error, { id: number; data: HarvestUpdateRequest }, UpdateHarvestContext>({
        mutationFn: ({ id, data }) => harvestApi.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: harvestKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: harvestKeys.listBySeason(seasonId) });

            const previousDetail = queryClient.getQueryData<Harvest>(harvestKeys.detail(id));
            const previousList = queryClient.getQueryData<PageResponse<Harvest>>(harvestKeys.listBySeason(seasonId));

            if (previousDetail) {
                queryClient.setQueryData<Harvest>(harvestKeys.detail(id), {
                    ...previousDetail,
                    ...data,
                });
            }

            if (previousList) {
                queryClient.setQueryData<PageResponse<Harvest>>(harvestKeys.listBySeason(seasonId), {
                    ...previousList,
                    items: previousList.items.map((item) =>
                        item.id === id ? { ...item, ...data } : item
                    ),
                });
            }

            return { previousDetail, previousList };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousDetail) {
                queryClient.setQueryData(harvestKeys.detail(id), context.previousDetail);
            }
            if (context?.previousList) {
                queryClient.setQueryData(harvestKeys.listBySeason(seasonId), context.previousList);
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: harvestKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: harvestKeys.listBySeason(seasonId) });
        },
        ...options,
    });
};

/**
 * Hook to delete a harvest with optimistic updates
 */
export const useDeleteHarvest = (
    seasonId: number,
    options?: Omit<UseMutationOptions<void, Error, number, DeleteHarvestContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number, DeleteHarvestContext>({
        mutationFn: harvestApi.delete,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: harvestKeys.listBySeason(seasonId) });

            const previousHarvests = queryClient.getQueryData<PageResponse<Harvest>>(harvestKeys.listBySeason(seasonId));

            if (previousHarvests) {
                queryClient.setQueryData<PageResponse<Harvest>>(harvestKeys.listBySeason(seasonId), {
                    ...previousHarvests,
                    items: previousHarvests.items.filter((item) => item.id !== id),
                    totalElements: Math.max(0, previousHarvests.totalElements - 1),
                });
            }

            return { previousHarvests };
        },
        onError: (_err, _id, context) => {
            if (context?.previousHarvests) {
                queryClient.setQueryData(harvestKeys.listBySeason(seasonId), context.previousHarvests);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: harvestKeys.listBySeason(seasonId) });
        },
        ...options,
    });
};
