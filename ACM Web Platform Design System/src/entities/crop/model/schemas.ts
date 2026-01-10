import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// CROP LIST PARAMS
// ═══════════════════════════════════════════════════════════════

export const CropListParamsSchema = z.object({
    keyword: z.string().optional(),
});

export type CropListParams = z.infer<typeof CropListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// CROP RESPONSE
// ═══════════════════════════════════════════════════════════════

export const CropSchema = z.object({
    id: z.number().int().positive(),
    cropName: z.string(),
    description: z.string().optional().nullable(),
});

export type Crop = z.infer<typeof CropSchema>;

// ═══════════════════════════════════════════════════════════════
// CROP REQUEST (create/update)
// ═══════════════════════════════════════════════════════════════

export const CropRequestSchema = z.object({
    cropName: z.string().min(1, 'Crop name is required'),
    description: z.string().optional(),
});

export type CropRequest = z.infer<typeof CropRequestSchema>;
