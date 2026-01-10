import type { DocumentListParams } from './types';

export const documentKeys = {
    all: ['documents'] as const,
    lists: () => [...documentKeys.all, 'list'] as const,
    list: (params?: DocumentListParams) => [...documentKeys.lists(), params] as const,
    detail: (id: number) => [...documentKeys.all, 'detail', id] as const,
    favorites: () => [...documentKeys.all, 'favorites'] as const,
    recent: () => [...documentKeys.all, 'recent'] as const,
};
