import { z } from "zod";
import { DateSchema } from "@/shared/api/types";

export const ProductWarehouseOverviewSchema = z.object({
  totalLots: z.number().int(),
  totalOnHandQuantity: z.number(),
  inStockLots: z.number().int(),
  depletedLots: z.number().int(),
});

export type ProductWarehouseOverview = z.infer<typeof ProductWarehouseOverviewSchema>;

export const ProductWarehouseLotSchema = z.object({
  id: z.number().int().positive(),
  lotCode: z.string(),
  productId: z.number().int().nullable().optional(),
  productName: z.string(),
  productVariant: z.string().nullable().optional(),
  seasonId: z.number().int().nullable().optional(),
  seasonName: z.string().nullable().optional(),
  farmId: z.number().int().nullable().optional(),
  farmName: z.string().nullable().optional(),
  plotId: z.number().int().nullable().optional(),
  plotName: z.string().nullable().optional(),
  harvestId: z.number().int().nullable().optional(),
  warehouseId: z.number().int().nullable().optional(),
  warehouseName: z.string().nullable().optional(),
  locationId: z.number().int().nullable().optional(),
  locationLabel: z.string().nullable().optional(),
  harvestedAt: DateSchema,
  receivedAt: z.string(),
  unit: z.string(),
  initialQuantity: z.number(),
  onHandQuantity: z.number(),
  grade: z.string().nullable().optional(),
  qualityStatus: z.string().nullable().optional(),
  traceabilityData: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  createdBy: z.number().nullable().optional(),
  createdByName: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

export type ProductWarehouseLot = z.infer<typeof ProductWarehouseLotSchema>;

export const ProductWarehouseTransactionSchema = z.object({
  id: z.number().int().positive(),
  lotId: z.number().int().nullable().optional(),
  lotCode: z.string().nullable().optional(),
  transactionType: z.string().nullable().optional(),
  quantity: z.number(),
  unit: z.string().nullable().optional(),
  resultingOnHand: z.number().nullable().optional(),
  referenceType: z.string().nullable().optional(),
  referenceId: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  createdBy: z.number().nullable().optional(),
  createdByName: z.string().nullable().optional(),
  createdAt: z.string(),
});

export type ProductWarehouseTransaction = z.infer<
  typeof ProductWarehouseTransactionSchema
>;

export const ProductWarehouseTraceabilitySchema = z.object({
  lotId: z.number().int().positive(),
  lotCode: z.string(),
  productName: z.string(),
  productVariant: z.string().nullable().optional(),
  seasonId: z.number().int().nullable().optional(),
  seasonName: z.string().nullable().optional(),
  farmId: z.number().int().nullable().optional(),
  farmName: z.string().nullable().optional(),
  plotId: z.number().int().nullable().optional(),
  plotName: z.string().nullable().optional(),
  harvestId: z.number().int().nullable().optional(),
  harvestedAt: DateSchema,
  receivedAt: z.string(),
  initialQuantity: z.number(),
  onHandQuantity: z.number(),
  unit: z.string(),
  recordedBy: z.number().nullable().optional(),
  recordedByName: z.string().nullable().optional(),
  traceabilityData: z.string().nullable().optional(),
  transactions: z.array(ProductWarehouseTransactionSchema),
});

export type ProductWarehouseTraceability = z.infer<
  typeof ProductWarehouseTraceabilitySchema
>;

export const ProductWarehouseLotsParamsSchema = z.object({
  warehouseId: z.number().int().positive().optional(),
  locationId: z.number().int().positive().optional(),
  seasonId: z.number().int().positive().optional(),
  farmId: z.number().int().positive().optional(),
  plotId: z.number().int().positive().optional(),
  harvestedFrom: DateSchema.optional(),
  harvestedTo: DateSchema.optional(),
  status: z.string().optional(),
  q: z.string().optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
});

export type ProductWarehouseLotsParams = z.infer<
  typeof ProductWarehouseLotsParamsSchema
>;

export const ProductWarehouseTransactionsParamsSchema = z.object({
  lotId: z.number().int().positive().optional(),
  type: z.string().optional(),
  from: DateSchema.optional(),
  to: DateSchema.optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
});

export type ProductWarehouseTransactionsParams = z.infer<
  typeof ProductWarehouseTransactionsParamsSchema
>;

export const AdjustProductWarehouseLotRequestSchema = z.object({
  quantityDelta: z.number(),
  note: z.string().min(1),
});

export type AdjustProductWarehouseLotRequest = z.infer<
  typeof AdjustProductWarehouseLotRequestSchema
>;

export const StockOutProductWarehouseLotRequestSchema = z.object({
  quantity: z.number().positive(),
  note: z.string().optional(),
});

export type StockOutProductWarehouseLotRequest = z.infer<
  typeof StockOutProductWarehouseLotRequestSchema
>;

export const CreateProductWarehouseLotRequestSchema = z.object({
  lotCode: z.string().optional(),
  productId: z.number().int().positive().optional(),
  productName: z.string().min(1),
  productVariant: z.string().optional(),
  seasonId: z.number().int().positive().optional(),
  farmId: z.number().int().positive(),
  plotId: z.number().int().positive(),
  harvestId: z.number().int().positive().optional(),
  warehouseId: z.number().int().positive(),
  locationId: z.number().int().positive().optional(),
  harvestedAt: DateSchema,
  receivedAt: z.string().optional(),
  unit: z.string().min(1),
  initialQuantity: z.number().positive(),
  grade: z.string().optional(),
  qualityStatus: z.string().optional(),
  traceabilityData: z.string().optional(),
  note: z.string().optional(),
  status: z.string().optional(),
});

export type CreateProductWarehouseLotRequest = z.infer<
  typeof CreateProductWarehouseLotRequestSchema
>;

export const UpdateProductWarehouseLotRequestSchema = z.object({
  productName: z.string().optional(),
  productVariant: z.string().optional(),
  locationId: z.number().int().positive().optional(),
  grade: z.string().optional(),
  qualityStatus: z.string().optional(),
  traceabilityData: z.string().optional(),
  note: z.string().optional(),
  status: z.string().optional(),
});

export type UpdateProductWarehouseLotRequest = z.infer<
  typeof UpdateProductWarehouseLotRequestSchema
>;

