import { z } from 'zod';
import { DateSchema } from '@/shared/api/types';

// ═══════════════════════════════════════════════════════════════
// SEASON STATUS ENUM
// ═══════════════════════════════════════════════════════════════

export const SeasonStatusEnum = z.enum([
    'PLANNED',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED',
    'ARCHIVED',
]);

export type SeasonStatus = z.infer<typeof SeasonStatusEnum>;

// ═══════════════════════════════════════════════════════════════
// SEASON LIST PARAMS
// ═══════════════════════════════════════════════════════════════

export const SeasonListParamsSchema = z.object({
    farmId: z.number().int().optional(),
    plotId: z.number().int().optional(),
    cropId: z.number().int().optional(),
    status: SeasonStatusEnum.optional(),
    from: DateSchema.optional(),
    to: DateSchema.optional(),
    page: z.number().int().min(0).default(0),
    size: z.number().int().min(1).default(20),
});

export type SeasonListParams = z.infer<typeof SeasonListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// SEASON RESPONSE
// ═══════════════════════════════════════════════════════════════

export const SeasonSchema = z.object({
    id: z.number().int().positive(),
    farmId: z.number().int().optional(),
    farmName: z.string().optional().nullable(),
    plotId: z.number().int().positive(),
    plotName: z.string().optional().nullable(),
    cropId: z.number().int().positive(),
    cropName: z.string().optional().nullable(),
    varietyId: z.number().int().optional().nullable(),
    varietyName: z.string().optional().nullable(),
    seasonName: z.string(),
    // Use string() to be permissive about date formats (e.g. YYYY-MM-DD vs ISO8601)
    startDate: z.string(),
    plannedHarvestDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    status: SeasonStatusEnum.optional(),
    initialPlantCount: z.number().int().min(0).optional(),
    currentPlantCount: z.number().int().min(0).optional(),
    expectedYieldKg: z.number().optional().nullable(),
    actualYieldKg: z.number().optional().nullable(),
    notes: z.string().optional().nullable(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Season = z.infer<typeof SeasonSchema>;


// ═══════════════════════════════════════════════════════════════
// SEASON DETAIL RESPONSE (extended)
// ═══════════════════════════════════════════════════════════════

export const SeasonDetailResponseSchema = SeasonSchema.extend({
    cropName: z.string().optional().nullable(),
    varietyName: z.string().optional().nullable(),
    plotName: z.string().optional().nullable(),
});

export type SeasonDetailResponse = z.infer<typeof SeasonDetailResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// SEASON CREATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const SeasonCreateRequestSchema = z.object({
    plotId: z.number().int().positive('Plot ID is required'),
    cropId: z.number().int().positive('Crop ID is required'),
    varietyId: z.number().int().optional(),
    seasonName: z.string().min(1, 'Season name is required'),
    startDate: DateSchema,
    plannedHarvestDate: DateSchema.optional(),
    endDate: DateSchema.optional(),
    initialPlantCount: z.number().int().min(1, 'Initial plant count must be at least 1'),
    expectedYieldKg: z.number().optional(),
    notes: z.string().optional(),
});

export type SeasonCreateRequest = z.infer<typeof SeasonCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// SEASON UPDATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const SeasonUpdateRequestSchema = z.object({
    seasonName: z.string().min(1, 'Season name is required'),
    startDate: DateSchema,
    varietyId: z.number().int().optional(),
    plannedHarvestDate: DateSchema.optional(),
    endDate: DateSchema.optional(),
    currentPlantCount: z.number().int().min(1, 'Current plant count must be at least 1'),
    expectedYieldKg: z.number().optional(),
    actualYieldKg: z.number().optional(),
    notes: z.string().optional(),
});

export type SeasonUpdateRequest = z.infer<typeof SeasonUpdateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// SEASON STATUS UPDATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const SeasonStatusUpdateRequestSchema = z.object({
    status: SeasonStatusEnum,
    actualStartDate: DateSchema.optional(),
    actualEndDate: DateSchema.optional(),
    reason: z.string().optional(),
});

export type SeasonStatusUpdateRequest = z.infer<typeof SeasonStatusUpdateRequestSchema>;

// ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?
// SEASON STATUS TRANSITION REQUESTS
// ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?

export const SeasonStartRequestSchema = z.object({
    actualStartDate: DateSchema.optional(),
});

export type SeasonStartRequest = z.infer<typeof SeasonStartRequestSchema>;

export const SeasonCompleteRequestSchema = z.object({
    endDate: DateSchema,
    actualYieldKg: z.number().min(0).optional(),
    forceComplete: z.boolean().optional(),
});

export type SeasonCompleteRequest = z.infer<typeof SeasonCompleteRequestSchema>;

export const SeasonCancelRequestSchema = z.object({
    forceCancel: z.boolean().optional(),
    reason: z.string().optional(),
});

export type SeasonCancelRequest = z.infer<typeof SeasonCancelRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// MY SEASON RESPONSE (minimal for dropdown)
// ═══════════════════════════════════════════════════════════════

export const MySeasonSchema = z.object({
    seasonId: z.number().int().positive(),
    seasonName: z.string(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    status: z.string().optional().nullable(),
});

export type MySeason = z.infer<typeof MySeasonSchema>;

