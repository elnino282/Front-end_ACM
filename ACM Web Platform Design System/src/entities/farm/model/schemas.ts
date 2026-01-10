import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// FARM LIST REQUEST (query params)
// ═══════════════════════════════════════════════════════════════

export const FarmListParamsSchema = z.object({
    keyword: z.string().nullable().optional(),
    active: z.boolean().nullable().optional(),
    page: z.number().int().min(0).default(0),
    size: z.number().int().min(1).default(20),
});

export type FarmListParams = z.infer<typeof FarmListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// FARM RESPONSE (list item)
// Matches API doc section 5.1 - Simple farm response for list view
// ═══════════════════════════════════════════════════════════════

export const FarmSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    provinceId: z.number().int().nullable().optional(),
    wardId: z.number().int().nullable().optional(),
    provinceName: z.string().nullable().optional(),
    wardName: z.string().nullable().optional(),
    area: z.union([z.string(), z.number()]).nullable().optional(),
    active: z.boolean(),
});

export type Farm = z.infer<typeof FarmSchema>;

export const FarmResponseSchema = z.object({
    content: z.array(FarmSchema),
    page: z.number().int(),
    size: z.number().int(),
    totalElements: z.number().int(),
    totalPages: z.number().int(),
});

export type FarmResponse = z.infer<typeof FarmResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// FARM DETAIL RESPONSE
// Matches API doc section 5.2 - Detailed farm response with owner info
// ═══════════════════════════════════════════════════════════════

// Simple Plot schema for nested data in FarmDetailResponse
const PlotResponseSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    area: z.union([z.string(), z.number()]).nullable().optional(),
    status: z.string().optional(),
});

export const FarmDetailResponseSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    provinceId: z.number().int().nullable().optional(),
    wardId: z.number().int().nullable().optional(),
    provinceName: z.string().nullable().optional(),
    wardName: z.string().nullable().optional(),
    area: z.union([z.string(), z.number()]).nullable().optional(),
    active: z.boolean(),
    ownerUsername: z.string(),
    plots: z.array(PlotResponseSchema).optional(),
    totalPlots: z.number().int().optional(),
    activePlots: z.number().int().optional(),
});

export type FarmDetailResponse = z.infer<typeof FarmDetailResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// FARM CREATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const FarmCreateRequestSchema = z.object({
    name: z.string().min(1, "Farm name is required").max(255, "Farm name must not exceed 255 characters"),
    provinceId: z.number().int().positive("Province is required"),
    wardId: z.number().int().positive("Ward is required"),
    area: z.union([z.string(), z.number()])
        .nullable()
        .optional()
        .refine(
            (val) => {
                if (val === null || val === undefined) return true;
                const num = typeof val === 'string' ? parseFloat(val) : val;
                return !isNaN(num) && num > 0;
            },
            { message: "Area must be greater than 0" }
        ),
});

export type FarmCreateRequest = z.infer<typeof FarmCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// FARM UPDATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const FarmUpdateRequestSchema = z.object({
    name: z.string().min(1, "Farm name is required").max(255, "Farm name must not exceed 255 characters").optional(),
    provinceId: z.number().int().positive().nullable().optional(),
    wardId: z.number().int().positive().nullable().optional(),
    area: z.union([z.string(), z.number()])
        .nullable()
        .optional()
        .refine(
            (val) => {
                if (val === null || val === undefined) return true;
                const num = typeof val === 'string' ? parseFloat(val) : val;
                return !isNaN(num) && num > 0;
            },
            { message: "Area must be greater than 0" }
        ),
    active: z.boolean().optional(),
});

export type FarmUpdateRequest = z.infer<typeof FarmUpdateRequestSchema>;

