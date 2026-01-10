import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// WAREHOUSE
// ═══════════════════════════════════════════════════════════════

export const WarehouseSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    type: z.string().nullable().optional(),
    farmId: z.number().int().nullable().optional(),
    farmName: z.string().nullable().optional(),
    provinceId: z.number().int().nullable().optional(),
    wardId: z.number().int().nullable().optional(),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;

// ═══════════════════════════════════════════════════════════════
// STOCK LOCATION
// ═══════════════════════════════════════════════════════════════

export const StockLocationSchema = z.object({
    id: z.number().int(),
    warehouseId: z.number().int().nullable().optional(),
    zone: z.string().nullable().optional(),
    aisle: z.string().nullable().optional(),
    shelf: z.string().nullable().optional(),
    bin: z.string().nullable().optional(),
    label: z.string().nullable().optional(),
});

export type StockLocation = z.infer<typeof StockLocationSchema>;

// ═══════════════════════════════════════════════════════════════
// ON-HAND ROW
// ═══════════════════════════════════════════════════════════════

export const OnHandRowSchema = z.object({
    warehouseId: z.number().int(),
    warehouseName: z.string().nullable().optional(),
    locationId: z.number().int().nullable().optional(),
    locationLabel: z.string().nullable().optional(),
    supplyLotId: z.number().int(),
    batchCode: z.string().nullable().optional(),
    supplyItemName: z.string().nullable().optional(),
    unit: z.string().nullable().optional(),
    expiryDate: z.string().nullable().optional(), // ISO date string
    lotStatus: z.string().nullable().optional(),
    onHandQuantity: z.number(),
});

export type OnHandRow = z.infer<typeof OnHandRowSchema>;

// ═══════════════════════════════════════════════════════════════
// STOCK MOVEMENT REQUEST
// ═══════════════════════════════════════════════════════════════

export const StockMovementRequestSchema = z.object({
    supplyLotId: z.number().int().positive('Supply lot ID is required'),
    warehouseId: z.number().int().positive('Warehouse ID is required'),
    locationId: z.number().int().optional().nullable(),
    movementType: z.string().min(1, 'Movement type is required'),
    quantity: z.number().positive('Quantity must be greater than 0'),
    seasonId: z.number().int().optional().nullable(),
    taskId: z.number().int().optional().nullable(),
    note: z.string().optional().nullable(),
});

export type StockMovementRequest = z.infer<typeof StockMovementRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// STOCK MOVEMENT RESPONSE
// ═══════════════════════════════════════════════════════════════

export const StockMovementSchema = z.object({
    id: z.number().int(),
    supplyLotId: z.number().int().nullable().optional(),
    batchCode: z.string().nullable().optional(),
    supplyItemName: z.string().nullable().optional(),
    unit: z.string().nullable().optional(),
    warehouseId: z.number().int().nullable().optional(),
    warehouseName: z.string().nullable().optional(),
    locationId: z.number().int().nullable().optional(),
    locationLabel: z.string().nullable().optional(),
    movementType: z.string(),
    quantity: z.number(),
    // CRITICAL: Use string without datetime() to handle various formats from backend
    movementDate: z.string().nullable().optional(),
    seasonId: z.number().int().nullable().optional(),
    seasonName: z.string().nullable().optional(),
    taskId: z.number().int().nullable().optional(),
    taskTitle: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
});

export type StockMovement = z.infer<typeof StockMovementSchema>;

// ═══════════════════════════════════════════════════════════════
// ON-HAND QUERY PARAMS
// ═══════════════════════════════════════════════════════════════

export const OnHandParamsSchema = z.object({
    warehouseId: z.number().int().positive('Warehouse ID is required'),
    locationId: z.number().int().optional().nullable(),
    lotId: z.number().int().optional().nullable(),
    q: z.string().optional().nullable(),
    page: z.number().int().optional(),
    size: z.number().int().optional(),
});

export type OnHandParams = z.infer<typeof OnHandParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// MOVEMENTS QUERY PARAMS
// ═══════════════════════════════════════════════════════════════

export const MovementsParamsSchema = z.object({
    warehouseId: z.number().int().positive('Warehouse ID is required'),
    type: z.string().optional().nullable(),
    from: z.string().optional().nullable(), // ISO date string
    to: z.string().optional().nullable(), // ISO date string
    page: z.number().int().optional(),
    size: z.number().int().optional(),
});

export type MovementsParams = z.infer<typeof MovementsParamsSchema>;
