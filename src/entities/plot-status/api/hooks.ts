import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { plotStatusKeys } from '../model/keys';
import { plotStatusApi } from './client';
import type { PlotStatusArrayResponse } from '../model/types';

// ═══════════════════════════════════════════════════════════════
// PLOT STATUS REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to fetch all plot statuses
 */
export const usePlotStatuses = (
    options?: Omit<UseQueryOptions<PlotStatusArrayResponse, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: plotStatusKeys.list(),
    queryFn: plotStatusApi.listAll,
    staleTime: 30 * 60 * 1000, // 30 minutes - plot statuses rarely change
    ...options,
});
