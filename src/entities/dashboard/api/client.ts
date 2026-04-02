import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
    DashboardOverviewSchema,
    TodayTaskSchema,
    PlotStatusSchema,
    LowStockAlertSchema,
    TodayTasksPageSchema,
} from '../model/schemas';
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
// DASHBOARD API CLIENT
// Pure Axios calls with Zod validation
// ═══════════════════════════════════════════════════════════════

export const dashboardApi = {
    /**
     * GET /api/v1/dashboard/overview
     * Returns all aggregated dashboard metrics
     */
    getOverview: async (seasonId?: number): Promise<DashboardOverview> => {
        const params = seasonId ? { seasonId } : undefined;
        const response = await httpClient.get('/api/v1/dashboard/overview', { params });
        return parseApiResponse(response.data, DashboardOverviewSchema);
    },

    /**
     * GET /api/v1/dashboard/today-tasks
     * Returns paginated list of today's tasks
     */
    getTodayTasks: async (params?: TodayTasksParams): Promise<TodayTasksPage> => {
        const response = await httpClient.get('/api/v1/dashboard/today-tasks', { params });
        return parseApiResponse(response.data, TodayTasksPageSchema);
    },

    /**
     * GET /api/v1/dashboard/upcoming-tasks
     * Returns upcoming tasks within specified days
     */
    getUpcomingTasks: async (params?: UpcomingTasksParams): Promise<TodayTask[]> => {
        const response = await httpClient.get('/api/v1/dashboard/upcoming-tasks', { params });
        return parseApiResponse(response.data, z.array(TodayTaskSchema));
    },

    /**
     * GET /api/v1/dashboard/plot-status
     * Returns plot status list for the Plot Status Map panel
     */
    getPlotStatus: async (seasonId?: number): Promise<PlotStatus[]> => {
        const params = seasonId ? { seasonId } : undefined;
        const response = await httpClient.get('/api/v1/dashboard/plot-status', { params });
        return parseApiResponse(response.data, z.array(PlotStatusSchema));
    },

    /**
     * GET /api/v1/dashboard/low-stock
     * Returns low stock alert items
     */
    getLowStock: async (params?: LowStockParams): Promise<LowStockAlert[]> => {
        const response = await httpClient.get('/api/v1/dashboard/low-stock', { params });
        return parseApiResponse(response.data, z.array(LowStockAlertSchema));
    },
};
