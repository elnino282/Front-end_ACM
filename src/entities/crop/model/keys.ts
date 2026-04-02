// ═══════════════════════════════════════════════════════════════
// CROP QUERY KEY FACTORY
// ═══════════════════════════════════════════════════════════════

import type { CropListParams } from './types';

export const cropKeys = {
    all: ['crop'] as const,
    lists: () => [...cropKeys.all, 'list'] as const,
    list: (params?: CropListParams) => [...cropKeys.lists(), params] as const,
    details: () => [...cropKeys.all, 'detail'] as const,
    detail: (id: number) => [...cropKeys.details(), id] as const,
};
