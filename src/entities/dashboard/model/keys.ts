// ═══════════════════════════════════════════════════════════════
// DASHBOARD QUERY KEYS
// React Query cache keys for dashboard data
// ═══════════════════════════════════════════════════════════════

export const dashboardKeys = {
    all: ['dashboard'] as const,
    
    overview: (seasonId?: number) => 
        [...dashboardKeys.all, 'overview', { seasonId }] as const,
    
    todayTasks: (params: { seasonId?: number; page?: number; size?: number }) =>
        [...dashboardKeys.all, 'today-tasks', params] as const,
    
    upcomingTasks: (params: { days?: number; seasonId?: number }) =>
        [...dashboardKeys.all, 'upcoming-tasks', params] as const,
    
    plotStatus: (seasonId?: number) =>
        [...dashboardKeys.all, 'plot-status', { seasonId }] as const,
    
    lowStock: (limit?: number) =>
        [...dashboardKeys.all, 'low-stock', { limit }] as const,

    fdnOverview: (seasonId?: number) =>
        [...dashboardKeys.all, 'fdn-overview', { seasonId }] as const,

    sustainabilityOverview: (params: { scope?: string; seasonId?: number; fieldId?: number; farmId?: number }) =>
        [...dashboardKeys.all, 'sustainability-overview', params] as const,

    fieldMap: (params: { seasonId?: number; farmId?: number; crop?: string; alertLevel?: string }) =>
        [...dashboardKeys.all, 'field-map', params] as const,

    fieldRecommendations: (fieldId?: number, seasonId?: number) =>
        [...dashboardKeys.all, 'field-recommendations', { fieldId, seasonId }] as const,

    fieldMetrics: (fieldId?: number, seasonId?: number) =>
        [...dashboardKeys.all, 'field-metrics', { fieldId, seasonId }] as const,

    fieldHistory: (fieldId?: number) =>
        [...dashboardKeys.all, 'field-history', { fieldId }] as const,

    assistantRecommendations: (params: { seasonId?: number; fieldId?: number }) =>
        [...dashboardKeys.all, 'assistant-recommendations', params] as const,
};
