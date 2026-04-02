import { z } from 'zod';

const NumericSchema = z.preprocess((value) => {
    if (value === null || value === undefined || value === '') return value;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
    }
    return value;
}, z.number());

const NullableNumericSchema = z.preprocess((value) => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }
    return value;
}, z.number().nullable());

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

export const SustainabilityScoreSchema = z.object({
    value: NullableNumericSchema,
    label: z.string(),
    components: z.record(z.string(), NullableNumericSchema).default({}),
    weights: z.record(z.string(), NullableNumericSchema).default({}),
});

export const DashboardFdnMetricsSchema = z.object({
    total: NullableNumericSchema,
    mineral: NullableNumericSchema,
    organic: NullableNumericSchema,
    level: z.enum(['low', 'medium', 'high']),
    status: z.enum(['measured', 'estimated', 'missing', 'unavailable']),
    thresholdSource: z.string(),
    lowMaxExclusive: NullableNumericSchema,
    mediumMaxExclusive: NullableNumericSchema,
    mineralHighMin: NullableNumericSchema,
    explanation: z.string(),
});

export const DashboardCurrentSeasonSchema = z.object({
    seasonName: z.string().nullable(),
    cropName: z.string().nullable(),
    dayCount: NullableNumericSchema,
    stage: z.string().nullable(),
});

export const DashboardYieldSummarySchema = z.object({
    estimated: NullableNumericSchema,
    unit: z.string(),
});

export const DashboardInputsBreakdownSchema = z.object({
    mineralFertilizerN: NullableNumericSchema,
    organicFertilizerN: NullableNumericSchema,
    biologicalFixationN: NullableNumericSchema,
    irrigationWaterN: NullableNumericSchema,
    atmosphericDepositionN: NullableNumericSchema,
    seedImportN: NullableNumericSchema,
    soilLegacyN: NullableNumericSchema,
    controlSupplyN: NullableNumericSchema,
});

export const DashboardDataQualitySchema = z.object({
    source: z.string(),
    method: z.string(),
    confidence: NullableNumericSchema,
});

export const DashboardDataQualitySummarySchema = z.object({
    overallConfidence: NullableNumericSchema,
    measuredInputCount: z.number().int(),
    estimatedInputCount: z.number().int(),
    missingInputCount: z.number().int(),
    unavailableInputCount: z.number().int(),
    summary: z.string(),
});

export const DashboardMetricSchema = z.object({
    value: NullableNumericSchema,
    unit: z.string(),
    status: z.enum(['measured', 'estimated', 'missing', 'unavailable']),
    confidence: NullableNumericSchema,
    calculationMode: z.string(),
    assumptions: z.array(z.string()).default([]),
    missingInputs: z.array(z.string()).default([]),
});

export const DashboardHistoryPointSchema = z.object({
    seasonId: z.number(),
    seasonName: z.string(),
    startDate: z.string(),
    fdnTotal: NullableNumericSchema,
    fdnMineral: NullableNumericSchema,
    fdnOrganic: NullableNumericSchema,
    nue: NullableNumericSchema,
    nOutput: NullableNumericSchema,
    yield: NullableNumericSchema,
});

export const DashboardFieldHistorySchema = z.array(DashboardHistoryPointSchema);

export const DashboardFdnOverviewSchema = z.object({
    scope: z.string(),
    entityId: z.string().nullable(),
    seasonId: z.number().nullable(),
    calculationMode: z.string(),
    confidence: NullableNumericSchema,
    sustainableScore: SustainabilityScoreSchema,
    fdn: DashboardFdnMetricsSchema,
    nue: NullableNumericSchema,
    nOutput: NullableNumericSchema,
    nSurplus: NullableNumericSchema,
    currentSeason: DashboardCurrentSeasonSchema.nullable(),
    yield: DashboardYieldSummarySchema,
    inputsBreakdown: DashboardInputsBreakdownSchema,
    unit: z.string(),
    dataQuality: z.array(DashboardDataQualitySchema).default([]),
    dataQualitySummary: DashboardDataQualitySummarySchema.nullable().default(null),
    missingInputs: z.array(z.string()).default([]),
    notes: z.array(z.string()).default([]),
    recommendations: z.array(z.string()).default([]),
    recommendationSource: z.string(),
    sustainableScoreMetric: DashboardMetricSchema,
    fdnTotalMetric: DashboardMetricSchema,
    fdnMineralMetric: DashboardMetricSchema,
    fdnOrganicMetric: DashboardMetricSchema,
    nueMetric: DashboardMetricSchema,
    nOutputMetric: DashboardMetricSchema,
    nSurplusMetric: DashboardMetricSchema,
    estimatedYieldMetric: DashboardMetricSchema,
    historicalTrend: z.array(DashboardHistoryPointSchema).default([]),
});

export const DashboardFieldMapItemSchema = z.object({
    fieldId: z.number(),
    fieldName: z.string(),
    farmId: z.number().nullable(),
    farmName: z.string().nullable(),
    geometry: z.object({
        type: z.string(),
        coordinates: z.any(),
    }).nullable(),
    center: z.object({
        lat: NumericSchema,
        lng: NumericSchema,
    }).nullable(),
    cropName: z.string(),
    seasonName: z.string(),
    fdnLevel: z.enum(['low', 'medium', 'high']).default('medium'),
    fdnTotal: NullableNumericSchema,
    fdnMineral: NullableNumericSchema,
    fdnOrganic: NullableNumericSchema,
    nue: NullableNumericSchema,
    confidence: NullableNumericSchema,
    calculationMode: z.string(),
    thresholdSource: z.string(),
    recommendationSource: z.string(),
    missingInputs: z.array(z.string()).default([]),
    inputsBreakdown: DashboardInputsBreakdownSchema,
    recommendations: z.array(z.string()).default([]),
});

export const DashboardFieldMapResponseSchema = z.object({
    items: z.array(DashboardFieldMapItemSchema).default([]),
});

export const DashboardFieldRecommendationSchema = z.object({
    fieldId: z.number(),
    seasonId: z.number().nullable(),
    fdnTotal: NullableNumericSchema,
    fdnMineral: NullableNumericSchema,
    nue: NullableNumericSchema,
    confidence: NullableNumericSchema,
    fdnLevel: z.enum(['low', 'medium', 'high']),
    thresholdSource: z.string(),
    recommendationSource: z.string(),
    calculationMode: z.string(),
    missingInputs: z.array(z.string()).default([]),
    recommendations: z.array(z.string()).default([]),
});
