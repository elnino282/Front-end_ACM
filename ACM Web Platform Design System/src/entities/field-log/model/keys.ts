import type { FieldLogListParams } from './types';

export const fieldLogKeys = {
    all: ['field-log'] as const,
    lists: () => [...fieldLogKeys.all, 'list'] as const,
    listBySeasonBase: (seasonId: number) =>
        [...fieldLogKeys.lists(), 'bySeason', seasonId] as const,
    listBySeason: (seasonId: number, params?: FieldLogListParams) =>
        [...fieldLogKeys.lists(), 'bySeason', seasonId, params] as const,
    details: () => [...fieldLogKeys.all, 'detail'] as const,
    detail: (id: number) => [...fieldLogKeys.details(), id] as const,
};
