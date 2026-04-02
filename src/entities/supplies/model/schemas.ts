import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// SUPPLIER
// ═══════════════════════════════════════════════════════════════

export const SupplierSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  licenseNo: z.string().nullable().optional(),
  contactEmail: z.string().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
});

export type Supplier = z.infer<typeof SupplierSchema>;

// Request schemas for CRUD operations
export const CreateSupplierRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Supplier name is required")
    .max(200, "Name must not exceed 200 characters"),
  licenseNo: z.string().max(100).optional().nullable(),
  contactEmail: z
    .string()
    .email("Invalid email format")
    .max(255)
    .optional()
    .nullable()
    .or(z.literal("")),
  contactPhone: z.string().max(30).optional().nullable(),
});

export type CreateSupplierRequest = z.infer<typeof CreateSupplierRequestSchema>;

export const UpdateSupplierRequestSchema = CreateSupplierRequestSchema;
export type UpdateSupplierRequest = z.infer<typeof UpdateSupplierRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// SUPPLY ITEM
// ═══════════════════════════════════════════════════════════════

export const SupplyItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  activeIngredient: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  restrictedFlag: z.boolean(),
});

export type SupplyItem = z.infer<typeof SupplyItemSchema>;

// ═══════════════════════════════════════════════════════════════
// SUPPLY LOT
// ═══════════════════════════════════════════════════════════════

export const SupplyLotSchema = z.object({
  id: z.number().int(),
  batchCode: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(), // ISO date string YYYY-MM-DD
  status: z.string().nullable().optional(),
  // Supplier info
  supplierId: z.number().int().nullable().optional(),
  supplierName: z.string().nullable().optional(),
  // Supply item info
  supplyItemId: z.number().int().nullable().optional(),
  supplyItemName: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  restrictedFlag: z.boolean().nullable().optional(),
});

export type SupplyLot = z.infer<typeof SupplyLotSchema>;

// ═══════════════════════════════════════════════════════════════
// STOCK IN REQUEST
// ═══════════════════════════════════════════════════════════════

export const StockInRequestSchema = z.object({
  warehouseId: z.number().int().positive("Warehouse ID is required"),
  locationId: z.number().int().optional().nullable(),
  supplierId: z.number().int().positive("Supplier is required"),
  supplyItemId: z.number().int().positive("Supply item is required"),
  batchCode: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(), // YYYY-MM-DD
  quantity: z.number().positive("Quantity must be greater than 0"),
  confirmRestricted: z.boolean().optional(),
  note: z.string().optional().nullable(),
});

export type StockInRequest = z.infer<typeof StockInRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// STOCK IN RESPONSE
// ═══════════════════════════════════════════════════════════════

// Reuse StockMovement schema from inventory
export const StockMovementMinimalSchema = z.object({
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
  movementDate: z.string().nullable().optional(),
  seasonId: z.number().int().nullable().optional(),
  seasonName: z.string().nullable().optional(),
  taskId: z.number().int().nullable().optional(),
  taskTitle: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const StockInResponseSchema = z.object({
  supplyLot: SupplyLotSchema,
  movement: StockMovementMinimalSchema,
});

export type StockInResponse = z.infer<typeof StockInResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// QUERY PARAMS
// ═══════════════════════════════════════════════════════════════

export interface SuppliersParams {
  q?: string;
  page?: number;
  size?: number;
}

export interface SupplyItemsParams {
  q?: string;
  restricted?: boolean;
  page?: number;
  size?: number;
}

export interface SupplyLotsParams {
  itemId?: number;
  supplierId?: number;
  status?: string;
  q?: string;
  page?: number;
  size?: number;
}
