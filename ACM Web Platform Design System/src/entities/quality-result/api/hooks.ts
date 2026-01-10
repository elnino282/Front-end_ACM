import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { qualityResultKeys } from '../model/keys';
import { qualityResultApi } from './client';
import type {
    QualityResult,
    QualityResultCreateRequest,
    QualityResultUpdateRequest,
} from '../model/types';

export const useQualityResultsByHarvest = (
    harvestId: number,
    options?: Omit<UseQueryOptions<QualityResult[], Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: qualityResultKeys.listByHarvest(harvestId),
    queryFn: () => qualityResultApi.listByHarvest(harvestId),
    enabled: harvestId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

export const useCreateQualityResult = (
    harvestId: number,
    options?: UseMutationOptions<QualityResult, Error, QualityResultCreateRequest>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => qualityResultApi.create(harvestId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qualityResultKeys.listByHarvest(harvestId) });
        },
        ...options,
    });
};

export const useUpdateQualityResult = (
    harvestId: number,
    options?: UseMutationOptions<QualityResult, Error, { id: number; data: QualityResultUpdateRequest }>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => qualityResultApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qualityResultKeys.listByHarvest(harvestId) });
        },
        ...options,
    });
};
