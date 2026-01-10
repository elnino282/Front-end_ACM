import { z } from 'zod';
import { DateSchema } from '@/shared/api/types';

// ═══════════════════════════════════════════════════════════════
// LOG TYPES CONSTANT (must match backend LogType enum)
// ═══════════════════════════════════════════════════════════════

export const LOG_TYPES = [
    { value: 'TRANSPLANT', label: 'Transplant', color: 'bg-green-100 text-green-800' },
    { value: 'FERTILIZE', label: 'Fertilize', color: 'bg-blue-100 text-blue-800' },
    { value: 'PEST', label: 'Pest', color: 'bg-red-100 text-red-800' },
    { value: 'SPRAY', label: 'Spray', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'IRRIGATE', label: 'Irrigate', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'WEED', label: 'Weed', color: 'bg-orange-100 text-orange-800' },
    { value: 'HARVEST', label: 'Harvest', color: 'bg-purple-100 text-purple-800' },
    { value: 'WEATHER', label: 'Weather', color: 'bg-gray-100 text-gray-800' },
    { value: 'GROWTH', label: 'Growth', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'OTHER', label: 'Other', color: 'bg-slate-100 text-slate-800' },
] as const;

export const LogTypeSchema = z.enum([
    'TRANSPLANT', 'FERTILIZE', 'PEST', 'SPRAY', 'IRRIGATE', 
    'WEED', 'HARVEST', 'WEATHER', 'GROWTH', 'OTHER'
]);

export type LogType = z.infer<typeof LogTypeSchema>;

// ═══════════════════════════════════════════════════════════════
// SEASON MINIMAL (for dropdown)
// ═══════════════════════════════════════════════════════════════

export const SeasonMinimalSchema = z.object({
    seasonId: z.number().int().positive(),
    seasonName: z.string(),
    startDate: DateSchema.nullable().optional(),
    endDate: DateSchema.nullable().optional(),
    plannedHarvestDate: DateSchema.nullable().optional(),
});

export type SeasonMinimal = z.infer<typeof SeasonMinimalSchema>;

// ═══════════════════════════════════════════════════════════════
// FIELD LOG LIST PARAMS
// ═══════════════════════════════════════════════════════════════

export const FieldLogListParamsSchema = z.object({
    from: DateSchema.optional(),
    to: DateSchema.optional(),
    type: z.string().optional(),
    q: z.string().optional(),
    page: z.number().int().min(0).default(0),
    size: z.number().int().min(1).default(20),
});

export type FieldLogListParams = z.infer<typeof FieldLogListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// FIELD LOG RESPONSE
// ═══════════════════════════════════════════════════════════════

export const FieldLogSchema = z.object({
    id: z.number().int().positive(),
    seasonId: z.number().int().positive().nullable().optional(),
    seasonName: z.string().nullable().optional(),
    logDate: DateSchema,
    logType: z.string().max(100),
    notes: z.string().max(4000).nullable().optional(),
    createdAt: z.string().nullable().optional(),
});

export type FieldLog = z.infer<typeof FieldLogSchema>;

// ═══════════════════════════════════════════════════════════════
// FIELD LOG CREATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const FieldLogCreateRequestSchema = z.object({
    seasonId: z.number().int().positive().optional(), // Added in client.ts
    logDate: DateSchema,
    logType: z.string().min(1, 'Log type is required').max(100),
    notes: z.string().max(4000).optional(),
});

export type FieldLogCreateRequest = z.infer<typeof FieldLogCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// FIELD LOG UPDATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const FieldLogUpdateRequestSchema = z.object({
    logDate: DateSchema,
    logType: z.string().min(1, 'Log type is required').max(100),
    notes: z.string().max(4000).optional(),
});

export type FieldLogUpdateRequest = z.infer<typeof FieldLogUpdateRequestSchema>;

