import { z } from 'zod';
import { DateSchema } from '@/shared/api/types';

// ═══════════════════════════════════════════════════════════════
// QUALITY RESULT RESPONSE
// ═══════════════════════════════════════════════════════════════

export const QualityResultSchema = z.object({
    id: z.number().int().positive(),
    harvestId: z.number().int().positive(),
    assessmentDate: DateSchema,
    moisturePercentage: z.number().min(0).max(100).optional().nullable(),
    grade: z.string().max(50).optional().nullable(),
    notes: z.string().max(4000).optional().nullable(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

export type QualityResult = z.infer<typeof QualityResultSchema>;

// ═══════════════════════════════════════════════════════════════
// QUALITY RESULT CREATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const QualityResultCreateRequestSchema = z.object({
    assessmentDate: DateSchema,
    moisturePercentage: z.number().min(0).max(100).optional(),
    grade: z.string().max(50).optional(),
    notes: z.string().max(4000).optional(),
});

export type QualityResultCreateRequest = z.infer<typeof QualityResultCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// QUALITY RESULT UPDATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const QualityResultUpdateRequestSchema = QualityResultCreateRequestSchema;

export type QualityResultUpdateRequest = z.infer<typeof QualityResultUpdateRequestSchema>;
