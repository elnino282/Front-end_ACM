import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// SOIL TYPE RESPONSE
// ═══════════════════════════════════════════════════════════════

export const SoilTypeSchema = z.object({
    id: z.number().int().positive(),
    soilName: z.string(),
    description: z.string().optional(),
});

export type SoilType = z.infer<typeof SoilTypeSchema>;

// API returns array directly
export const SoilTypeArrayResponseSchema = z.array(SoilTypeSchema);

export type SoilTypeArrayResponse = z.infer<typeof SoilTypeArrayResponseSchema>;
