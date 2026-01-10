import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { dashboardApi } from './client';
import { dashboardKeys } from '../model/keys';
import type {
    DashboardOverview,
    TodayTask,
    PlotStatus,
    LowStockAlert,
    TodayTasksPage,
    TodayTasksParams,
    UpcomingTasksParams,
    LowStockParams,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// DASHBOARD REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Hook for dashboard overview data
 */
export function useDashboardOverview(
    seasonId?: number,
    options?: Omit<UseQueryOptions<DashboardOverview, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: dashboardKeys.overview(seasonId),
        queryFn: () => dashboardApi.getOverview(seasonId),
        staleTime: 30 * 1000, // 30 seconds
        ...options,
    });
}

/**
 * Hook for today's tasks
 */
export function useTodayTasks(
    params?: TodayTasksParams,
    options?: Omit<UseQueryOptions<TodayTasksPage, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: dashboardKeys.todayTasks({
            seasonId: params?.seasonId,
            page: params?.page,
            size: params?.size,
        }),
        queryFn: () => dashboardApi.getTodayTasks(params),
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook for upcoming tasks
 */
export function useUpcomingTasks(
    params?: UpcomingTasksParams,
    options?: Omit<UseQueryOptions<TodayTask[], Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: dashboardKeys.upcomingTasks({
            days: params?.days ?? 7,
            seasonId: params?.seasonId,
        }),
        queryFn: () => dashboardApi.getUpcomingTasks(params),
        staleTime: 30 * 1000,
        ...options,
    });
}

/**
 * Hook for plot status
 */
export function usePlotStatus(
    seasonId?: number,
    options?: Omit<UseQueryOptions<PlotStatus[], Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: dashboardKeys.plotStatus(seasonId),
        queryFn: () => dashboardApi.getPlotStatus(seasonId),
        staleTime: 60 * 1000, // 1 minute
        ...options,
    });
}

/**
 * Hook for low stock alerts
 */
export function useLowStock(
    params?: LowStockParams,
    options?: Omit<UseQueryOptions<LowStockAlert[], Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: dashboardKeys.lowStock(params?.limit),
        queryFn: () => dashboardApi.getLowStock(params),
        staleTime: 60 * 1000, // 1 minute
        ...options,
    });
}
