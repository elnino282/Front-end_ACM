import {
    useQuery,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { varietyKeys } from '../model/keys';
import { varietyApi } from './client';
import type {
    Variety,
} from '../model/types';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// VARIETY REACT QUERY HOOKS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

/**
 * Hook to fetch varieties for a specific crop
 */
export const useVarietiesByCrop = (
    cropId: number,
    options?: Omit<UseQueryOptions<Variety[], Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: varietyKeys.listByCrop(cropId),
    queryFn: () => varietyApi.listByCrop(cropId),
    enabled: cropId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch a single variety by ID
 */
export const useVarietyById = (
    id: number,
    options?: Omit<UseQueryOptions<Variety, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: varietyKeys.detail(id),
    queryFn: () => varietyApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});
