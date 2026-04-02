import type { ReportListParams } from './types';

export const reportKeys = {
    all: ['report'] as const,
    lists: () => [...reportKeys.all, 'list'] as const,
    list: (params?: ReportListParams) => [...reportKeys.lists(), params] as const,
    details: () => [...reportKeys.all, 'detail'] as const,
    detail: (id: number) => [...reportKeys.details(), id] as const,
};
