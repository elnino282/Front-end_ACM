/**
 * Farm Query Key Factory
 * Provides type-safe, consistent query keys for React Query
 */

import type { FarmListParams } from './types';

export const farmKeys = {
    all: ['farms'] as const,
    lists: () => [...farmKeys.all, 'list'] as const,
    list: (params?: FarmListParams) => [...farmKeys.lists(), params ?? {}] as const,
    details: () => [...farmKeys.all, 'detail'] as const,
    detail: (id: number) => [...farmKeys.details(), id] as const,
} as const;
