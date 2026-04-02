// ═══════════════════════════════════════════════════════════════
// SEASON QUERY KEY FACTORY
// ═══════════════════════════════════════════════════════════════

import type { SeasonListParams } from './types';

export const seasonKeys = {
    all: ['season'] as const,
    lists: () => [...seasonKeys.all, 'list'] as const,
    list: (params?: SeasonListParams) => [...seasonKeys.lists(), params] as const,
    details: () => [...seasonKeys.all, 'detail'] as const,
    detail: (id: number) => [...seasonKeys.details(), id] as const,
    mySeasons: () => [...seasonKeys.all, 'my'] as const,
};

