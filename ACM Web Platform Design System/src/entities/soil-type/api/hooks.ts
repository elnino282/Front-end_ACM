import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { soilTypeKeys } from '../model/keys';
import { soilTypeApi } from './client';
import type { SoilTypeArrayResponse } from '../model/types';

// ═══════════════════════════════════════════════════════════════
// SOIL TYPE REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to fetch all soil types
 */
export const useSoilTypes = (
    options?: Omit<UseQueryOptions<SoilTypeArrayResponse, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: soilTypeKeys.list(),
    queryFn: soilTypeApi.listAll,
    staleTime: 30 * 60 * 1000, // 30 minutes - soil types rarely change
    ...options,
});
