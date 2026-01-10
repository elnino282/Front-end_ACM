import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// PLOT STATUS RESPONSE
// ═══════════════════════════════════════════════════════════════

export const PlotStatusSchema = z.object({
    id: z.number().int().positive(),
    statusName: z.string(),
    description: z.string().optional(),
});

export type PlotStatus = z.infer<typeof PlotStatusSchema>;

// API returns array directly
export const PlotStatusArrayResponseSchema = z.array(PlotStatusSchema);

export type PlotStatusArrayResponse = z.infer<typeof PlotStatusArrayResponseSchema>;
