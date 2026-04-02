import { z } from 'zod';
import { DateSchema } from '@/shared/api/types';

// ═══════════════════════════════════════════════════════════════
// SALE STATUS ENUM
// ═══════════════════════════════════════════════════════════════

export const SaleStatusEnum = z.enum([
    'PENDING',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED',
]);

export type SaleStatus = z.infer<typeof SaleStatusEnum>;

// ═══════════════════════════════════════════════════════════════
// SALE LIST PARAMS
// ═══════════════════════════════════════════════════════════════

export const SaleListParamsSchema = z.object({
    from: DateSchema.optional(),
    to: DateSchema.optional(),
    status: SaleStatusEnum.optional(),
    page: z.number().int().min(0).default(0),
    size: z.number().int().min(1).default(20),
});

export type SaleListParams = z.infer<typeof SaleListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// SALE RESPONSE
// ═══════════════════════════════════════════════════════════════

export const SaleSchema = z.object({
    id: z.number().int().positive(),
    farmerId: z.number().int().positive().optional(),
    buyerId: z.number().int().optional().nullable(),
    harvestId: z.number().int().positive().optional(),
    saleDate: DateSchema,
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    totalAmount: z.number().optional(),
    status: SaleStatusEnum.optional(),
    notes: z.string().optional().nullable(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

export type Sale = z.infer<typeof SaleSchema>;

// ═══════════════════════════════════════════════════════════════
// SALE CREATE REQUEST (Farmer)
// ═══════════════════════════════════════════════════════════════

export const SaleCreateRequestSchema = z.object({
    harvestId: z.number().int().positive('Harvest ID is required'),
    buyerId: z.number().int().optional(),
    saleDate: DateSchema,
    quantity: z.number().positive('Quantity must be positive'),
    unitPrice: z.number().positive('Unit price must be positive'),
    notes: z.string().optional(),
});

export type SaleCreateRequest = z.infer<typeof SaleCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// SALE UPDATE REQUEST (Farmer)
// ═══════════════════════════════════════════════════════════════

export const SaleUpdateRequestSchema = z.object({
    buyerId: z.number().int().optional(),
    saleDate: DateSchema,
    quantity: z.number().positive('Quantity must be positive'),
    unitPrice: z.number().positive('Unit price must be positive'),
    status: SaleStatusEnum.optional(),
    notes: z.string().optional(),
});

export type SaleUpdateRequest = z.infer<typeof SaleUpdateRequestSchema>;
