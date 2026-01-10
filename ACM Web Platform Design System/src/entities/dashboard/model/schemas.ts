import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// DASHBOARD ZOD SCHEMAS
// Backend DTOs → Frontend validation
// ═══════════════════════════════════════════════════════════════

// Season Context nested schema
export const SeasonContextSchema = z.object({
    seasonId: z.number().nullable(),
    seasonName: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    plannedHarvestDate: z.string().nullable(),
});

// Counts nested schema
export const CountsSchema = z.object({
    activeFarms: z.number(),
    activePlots: z.number(),
    seasonsByStatus: z.record(z.string(), z.number()),
});

// KPIs nested schema
export const KpisSchema = z.object({
    avgYieldTonsPerHa: z.number().nullable(),
    costPerHectare: z.number().nullable(),
    onTimePercent: z.number().nullable(),
});

// Expenses nested schema
export const ExpensesSchema = z.object({
    totalExpense: z.number(),
});

// Harvest nested schema
export const HarvestSchema = z.object({
    totalQuantityKg: z.number(),
    totalRevenue: z.number(),
    expectedYieldKg: z.number().nullable(),
    yieldVsPlanPercent: z.number().nullable(),
});

// Alerts nested schema
export const AlertsSchema = z.object({
    openIncidents: z.number(),
    expiringLots: z.number(),
    lowStockItems: z.number(),
});

// Main Dashboard Overview Response
export const DashboardOverviewSchema = z.object({
    seasonContext: SeasonContextSchema.nullable(),
    counts: CountsSchema,
    kpis: KpisSchema,
    expenses: ExpensesSchema,
    harvest: HarvestSchema,
    alerts: AlertsSchema,
});

// Today Task Response
export const TodayTaskSchema = z.object({
    taskId: z.number(),
    title: z.string(),
    plotName: z.string().nullable(),
    type: z.string().nullable(),
    assigneeName: z.string().nullable(),
    dueDate: z.string().nullable(),
    status: z.string(),
});

// Plot Status Response
export const PlotStatusSchema = z.object({
    plotId: z.number(),
    plotName: z.string(),
    areaHa: z.number().nullable(),
    cropName: z.string().nullable(),
    stage: z.string().nullable(),
    health: z.string(),
});

// Low Stock Alert Response
export const LowStockAlertSchema = z.object({
    supplyLotId: z.number(),
    batchCode: z.string().nullable(),
    itemName: z.string(),
    warehouseName: z.string(),
    locationLabel: z.string().nullable(),
    onHand: z.number(),
    unit: z.string().nullable(),
});

// Page Response for Today Tasks
export const TodayTasksPageSchema = z.object({
    content: z.array(TodayTaskSchema),
    pageable: z.any().optional(),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
    first: z.boolean().optional(),
    last: z.boolean().optional(),
    empty: z.boolean().optional(),
});
