// ═══════════════════════════════════════════════════════════════
// PLOT STATUS QUERY KEYS
// ═══════════════════════════════════════════════════════════════

export const plotStatusKeys = {
    all: ['plot-statuses'] as const,
    lists: () => [...plotStatusKeys.all, 'list'] as const,
    list: () => [...plotStatusKeys.lists()] as const,
};
