import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// PROVINCE RESPONSE
// ═══════════════════════════════════════════════════════════════

export const ProvinceSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    slug: z.string().optional(),
    type: z.string().optional(),
    nameWithType: z.string().optional(),
});

export type Province = z.infer<typeof ProvinceSchema>;

export const ProvinceArrayResponseSchema = z.array(ProvinceSchema);

export type ProvinceArrayResponse = z.infer<typeof ProvinceArrayResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// WARD RESPONSE
// ═══════════════════════════════════════════════════════════════

export const WardSchema = z.object({
    id: z.number().int().positive(),
    name: z.string(),
    slug: z.string().optional(),
    type: z.string().optional(),
    nameWithType: z.string().optional(),
    provinceId: z.number().int().positive().optional(),
});

export type Ward = z.infer<typeof WardSchema>;

export const WardArrayResponseSchema = z.array(WardSchema);

export type WardArrayResponse = z.infer<typeof WardArrayResponseSchema>;
