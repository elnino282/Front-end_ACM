// ═══════════════════════════════════════════════════════════════
// SOIL TYPE QUERY KEYS
// ═══════════════════════════════════════════════════════════════

export const soilTypeKeys = {
    all: ['soil-types'] as const,
    lists: () => [...soilTypeKeys.all, 'list'] as const,
    list: () => [...soilTypeKeys.lists()] as const,
};
