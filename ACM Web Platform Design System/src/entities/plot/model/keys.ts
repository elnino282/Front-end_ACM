/**
 * Plot Query Key Factory
 * Provides type-safe, consistent query keys for React Query
 */

import type { PlotListParams } from './types';

export const plotKeys = {
    all: ['plots'] as const,
    lists: () => [...plotKeys.all, 'list'] as const,
    listAll: () => [...plotKeys.lists(), 'all'] as const,
    byFarm: (farmId: number, params?: PlotListParams) =>
        (params
            ? [...plotKeys.lists(), 'farm', farmId, params]
            : [...plotKeys.lists(), 'farm', farmId]) as const,
    details: () => [...plotKeys.all, 'detail'] as const,
    detail: (id: number) => [...plotKeys.details(), id] as const,
} as const;
