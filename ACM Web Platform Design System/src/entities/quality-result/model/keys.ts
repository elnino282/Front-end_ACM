export const qualityResultKeys = {
    all: ['quality-result'] as const,
    lists: () => [...qualityResultKeys.all, 'list'] as const,
    listByHarvest: (harvestId: number) => [...qualityResultKeys.lists(), 'byHarvest', harvestId] as const,
    details: () => [...qualityResultKeys.all, 'detail'] as const,
    detail: (id: number) => [...qualityResultKeys.details(), id] as const,
};
