import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import type { PageResponse } from '@/shared/api/types';
import { seasonKeys } from '../model/keys';
import { seasonApi } from './client';
import type {
    SeasonListParams,
    Season,
    SeasonDetailResponse,
    SeasonCreateRequest,
    SeasonUpdateRequest,
    SeasonStatusUpdateRequest,
    SeasonStartRequest,
    SeasonCompleteRequest,
    SeasonCancelRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// SEASON REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to fetch paginated list of seasons with optional filters
 */
export const useSeasons = (
    params?: SeasonListParams,
    options?: Omit<UseQueryOptions<PageResponse<Season>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: seasonKeys.list(params),
    queryFn: () => seasonApi.list(params),
    staleTime: 5 * 60 * 1000,
    ...options,
});


/**
 * Hook to fetch seasons filtered by crop ID
 * Used to check if a crop is being used in any seasons
 */
export const useSeasonsByCrop = (
    cropId: number,
    options?: Omit<UseQueryOptions<PageResponse<Season>, Error>, 'queryKey' | 'queryFn'>
) => useSeasons(
    { cropId, page: 0, size: 100 },
    {
        enabled: cropId > 0,
        ...options,
    }
);

/**
 * Hook to fetch a single season by ID
 */
export const useSeasonById = (
    id: number,
    options?: Omit<UseQueryOptions<SeasonDetailResponse, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: seasonKeys.detail(id),
    queryFn: () => seasonApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to create a new season
 */
export const useCreateSeason = (
    options?: UseMutationOptions<SeasonDetailResponse, Error, SeasonCreateRequest>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: seasonApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seasonKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to update an existing season
 */
export const useUpdateSeason = (
    options?: UseMutationOptions<SeasonDetailResponse, Error, { id: number; data: SeasonUpdateRequest }>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => seasonApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: seasonKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: seasonKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to update season status
 */
export const useUpdateSeasonStatus = (
    options?: UseMutationOptions<Season, Error, { id: number; data: SeasonStatusUpdateRequest }>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => seasonApi.updateStatus(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: seasonKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: seasonKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to start a planned season
 */
export const useStartSeason = (
    options?: UseMutationOptions<Season, Error, { id: number; data?: SeasonStartRequest }>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => seasonApi.start(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: seasonKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: seasonKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to complete an active season
 */
export const useCompleteSeason = (
    options?: UseMutationOptions<Season, Error, { id: number; data: SeasonCompleteRequest }>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => seasonApi.complete(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: seasonKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: seasonKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to cancel a season
 */
export const useCancelSeason = (
    options?: UseMutationOptions<Season, Error, { id: number; data?: SeasonCancelRequest }>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => seasonApi.cancel(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: seasonKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: seasonKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to delete a season
 */
export const useDeleteSeason = (
    options?: UseMutationOptions<void, Error, number>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: seasonApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seasonKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to fetch minimal seasons for dropdown selectors
 */
export const useMySeasons = (
    options?: Omit<UseQueryOptions<import('../model/schemas').MySeason[], Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: seasonKeys.mySeasons(),
    queryFn: () => seasonApi.getMySeasons(),
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * BR15: Hook to archive a completed or cancelled season
 */
export const useArchiveSeason = (
    options?: UseMutationOptions<Season, Error, number>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: seasonApi.archive,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: seasonKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: seasonKeys.lists() });
        },
        ...options,
    });
};

/**
 * BR17: Hook to search seasons by keyword
 */
export const useSearchSeasonsByKeyword = (
    keyword: string,
    options?: Omit<UseQueryOptions<Season[], Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: [...seasonKeys.all, 'search', keyword],
    queryFn: () => seasonApi.searchByKeyword(keyword),
    enabled: keyword.length > 0,
    staleTime: 30 * 1000, // 30 seconds for search results
    ...options,
});

