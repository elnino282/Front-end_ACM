import { z } from 'zod';
import { DateSchema } from '@/shared/api/types';

// ═══════════════════════════════════════════════════════════════
// HARVEST LIST PARAMS
// ═══════════════════════════════════════════════════════════════

export const HarvestListParamsSchema = z.object({
    seasonId: z.number().int().positive().optional(),
    from: DateSchema.optional(),
    to: DateSchema.optional(),
    page: z.number().int().min(0).default(0),
    size: z.number().int().min(1).default(20),
});

export type HarvestListParams = z.infer<typeof HarvestListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// HARVEST RESPONSE
// ═══════════════════════════════════════════════════════════════

export const HarvestSchema = z.object({
    id: z.number().int().positive(),
    seasonId: z.number().int().positive().nullable().optional(),
    seasonName: z.string().nullable().optional(),
    harvestDate: DateSchema,
    quantity: z.number().positive(),
    unit: z.number().positive().optional(),
    grade: z.string().nullable().optional(),
    revenue: z.number().nullable().optional(),
    note: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
});

export type Harvest = z.infer<typeof HarvestSchema>;

// ═══════════════════════════════════════════════════════════════
// HARVEST SUMMARY (KPI)
// ═══════════════════════════════════════════════════════════════

export const HarvestSummarySchema = z.object({
    totalHarvestedKg: z.number(),
    lotsCount: z.number().int(),
    totalRevenue: z.number(),
    yieldVsPlanPercent: z.number().nullable(),
    expectedYieldKg: z.number().nullable(),
    actualYieldKg: z.number().nullable(),
});

export type HarvestSummary = z.infer<typeof HarvestSummarySchema>;

// ═══════════════════════════════════════════════════════════════
// HARVEST CREATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const HarvestCreateRequestSchema = z.object({
    harvestDate: DateSchema,
    quantity: z.number().positive('Quantity must be positive'),
    unit: z.number().positive('Unit/price must be positive'),
    grade: z.string().optional(),
    note: z.string().optional(),
});

export type HarvestCreateRequest = z.infer<typeof HarvestCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// HARVEST UPDATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const HarvestUpdateRequestSchema = HarvestCreateRequestSchema;

export type HarvestUpdateRequest = z.infer<typeof HarvestUpdateRequestSchema>;
