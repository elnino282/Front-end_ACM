import { z } from 'zod';
import {
    DashboardOverviewSchema,
    TodayTaskSchema,
    PlotStatusSchema,
    LowStockAlertSchema,
    TodayTasksPageSchema,
    SeasonContextSchema,
    CountsSchema,
    KpisSchema,
    ExpensesSchema,
    HarvestSchema,
    AlertsSchema,
} from './schemas';

// ═══════════════════════════════════════════════════════════════
// DASHBOARD TYPES
// Inferred from Zod schemas
// ═══════════════════════════════════════════════════════════════

export type SeasonContext = z.infer<typeof SeasonContextSchema>;
export type Counts = z.infer<typeof CountsSchema>;
export type Kpis = z.infer<typeof KpisSchema>;
export type Expenses = z.infer<typeof ExpensesSchema>;
export type Harvest = z.infer<typeof HarvestSchema>;
export type Alerts = z.infer<typeof AlertsSchema>;

export type DashboardOverview = z.infer<typeof DashboardOverviewSchema>;
export type TodayTask = z.infer<typeof TodayTaskSchema>;
export type PlotStatus = z.infer<typeof PlotStatusSchema>;
export type LowStockAlert = z.infer<typeof LowStockAlertSchema>;
export type TodayTasksPage = z.infer<typeof TodayTasksPageSchema>;

// Dashboard overview params
export interface DashboardOverviewParams {
    seasonId?: number;
}

// Today tasks params
export interface TodayTasksParams {
    seasonId?: number;
    page?: number;
    size?: number;
    sort?: string;
}

// Upcoming tasks params
export interface UpcomingTasksParams {
    days?: number;
    seasonId?: number;
}

// Low stock params
export interface LowStockParams {
    limit?: number;
}
