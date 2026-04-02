import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// VARIETY RESPONSE
// ═══════════════════════════════════════════════════════════════

export const VarietySchema = z.object({
    id: z.number().int().positive(),
    cropId: z.number().int().positive(),
    name: z.string(),
    description: z.string().optional().nullable(),
});

export type Variety = z.infer<typeof VarietySchema>;

// ═══════════════════════════════════════════════════════════════
// VARIETY REQUEST (create/update)
// ═══════════════════════════════════════════════════════════════

export const VarietyRequestSchema = z.object({
    cropId: z.number().int().positive('Crop ID is required'),
    name: z.string().min(1, 'Variety name is required'),
    description: z.string().optional(),
});

export type VarietyRequest = z.infer<typeof VarietyRequestSchema>;
