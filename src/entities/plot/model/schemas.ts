import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// PLOT LIST PARAMS (for farm's plots)
// ═══════════════════════════════════════════════════════════════

export const PlotListParamsSchema = z.object({
    page: z.number().int().min(0).default(0),
    size: z.number().int().min(1).default(20),
});

export type PlotListParams = z.infer<typeof PlotListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// PLOT RESPONSE
// ═══════════════════════════════════════════════════════════════

export const PlotSchema = z.object({
    id: z.number().int().positive(),
    userName: z.string().optional(),
    farmId: z.number().int().nullable().optional(),
    farmName: z.string().nullable().optional(),
    plotName: z.string(),
    addressId: z.number().int().nullable().optional(), // Legacy field
    area: z.number().positive().optional(),
    soilType: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    createdAt: z.string().optional(),
});

export type Plot = z.infer<typeof PlotSchema>;

export const PlotResponseSchema = z.object({
    items: z.array(PlotSchema),
    page: z.number().int(),
    size: z.number().int(),
    totalElements: z.number().int(),
    totalPages: z.number().int(),
});

export type PlotResponse = z.infer<typeof PlotResponseSchema>;

// For /api/v1/plots endpoint that returns array directly
export const PlotArrayResponseSchema = z.array(PlotSchema);

export type PlotArrayResponse = z.infer<typeof PlotArrayResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// PLOT REQUEST (create/update)
// ═══════════════════════════════════════════════════════════════

export const PlotRequestSchema = z.object({
    userId: z.number().int().optional(),
    farmId: z.number().int().optional(),
    plotName: z.string().min(1, "Plot name is required"),
    area: z.number().positive("Area must be greater than 0").optional(),
    soilType: z.string().optional(),
    status: z.enum(['IN_USE', 'IDLE', 'AVAILABLE', 'FALLOW', 'MAINTENANCE']).optional(),
});

export type PlotRequest = z.infer<typeof PlotRequestSchema>;
