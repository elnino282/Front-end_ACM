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
};
