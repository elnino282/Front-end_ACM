// ═══════════════════════════════════════════════════════════════
// VARIETY QUERY KEY FACTORY
// ═══════════════════════════════════════════════════════════════

export const varietyKeys = {
    all: ['variety'] as const,
    lists: () => [...varietyKeys.all, 'list'] as const,
    listByCrop: (cropId: number) => [...varietyKeys.lists(), 'byCrop', cropId] as const,
    details: () => [...varietyKeys.all, 'detail'] as const,
    detail: (id: number) => [...varietyKeys.details(), id] as const,
};
