import { z } from "zod";
import { DateSchema } from "@/shared/api/types";

const NumericSchema = z.preprocess((value) => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  }
  return value;
}, z.number());

const OptionalNumericSchema = NumericSchema.optional();

export const PaymentStatusSchema = z.enum(["PAID", "PENDING", "UNPAID"]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

const PositiveNumberSchema = NumericSchema.refine((value) => value > 0, {
  message: "Amount must be greater than 0",
});

// ═══════════════════════════════════════════════════════════════
// EXPENSE LIST PARAMS
// ═══════════════════════════════════════════════════════════════

export const ExpenseListParamsSchema = z.object({
  seasonId: z.number().int().optional(),
  plotId: z.number().int().optional(),
  cropId: z.number().int().optional(),
  taskId: z.number().int().optional(),
  vendorId: z.number().int().optional(),
  category: z.string().optional(),
  paymentStatus: PaymentStatusSchema.optional(),
  fromDate: DateSchema.optional(),
  toDate: DateSchema.optional(),
  minAmount: OptionalNumericSchema,
  maxAmount: OptionalNumericSchema,
  q: z.string().optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).default(20),
});

export type ExpenseListParams = z.infer<typeof ExpenseListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// EXPENSE RESPONSE (BR177/BR178 compliant)
// ═══════════════════════════════════════════════════════════════

export const ExpenseSchema = z.object({
  id: z.number().int().positive(),
  // Season info
  seasonId: z.number().int().positive().nullable().optional(),
  seasonName: z.string().nullable().optional(),
  // Plot info (BR176/BR180)
  plotId: z.number().int().positive().nullable().optional(),
  plotName: z.string().nullable().optional(),
  // Task info (BR176/BR180)
  taskId: z.number().int().positive().nullable().optional(),
  taskTitle: z.string().nullable().optional(),
  // User info
  userName: z.string().nullable().optional(),
  // BR175/BR179 fields
  category: z.string().nullable().optional(),
  amount: NumericSchema.nullable().optional(),
  paymentStatus: PaymentStatusSchema.nullable().optional(),
  vendorId: z.number().int().positive().nullable().optional(),
  vendorName: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  expenseDate: DateSchema,
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
  attachmentUrl: z.string().nullable().optional(),
  attachmentName: z.string().nullable().optional(),
  attachmentMime: z.string().nullable().optional(),
  // Legacy fields (kept for backward compatibility)
  itemName: z.string().max(255).nullable().optional(),
  unitPrice: NumericSchema.nullable().optional(),
  quantity: z.number().int().nullable().optional(),
  totalCost: NumericSchema.nullable().optional(),
});

export type Expense = z.infer<typeof ExpenseSchema>;

// ═══════════════════════════════════════════════════════════════
// EXPENSE CREATE REQUEST (BR175/BR176 compliant)
// ═══════════════════════════════════════════════════════════════

export const ExpenseCreateRequestSchema = z.object({
  // BR175: Mandatory fields
  amount: PositiveNumberSchema,
  expenseDate: DateSchema,
  category: z.string().min(1, "Category is required"),
  paymentStatus: PaymentStatusSchema,
  plotId: z.number().int().positive().optional(),
  vendorId: z.number().int().positive().optional().nullable(),
  // BR175: Optional fields
  taskId: z.number().int().positive().optional().nullable(),
  note: z.string().max(1000).optional().nullable(),
  // Legacy fields (for backward compatibility)
  itemName: z.string().max(255).optional().nullable(),
  unitPrice: PositiveNumberSchema.optional().nullable(),
  quantity: z.number().int().min(1).optional().nullable(),
});

export type ExpenseCreateRequest = z.infer<typeof ExpenseCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// EXPENSE UPDATE REQUEST (BR179/BR180 compliant)
// ═══════════════════════════════════════════════════════════════

export const ExpenseUpdateRequestSchema = z.object({
  // BR179: Mandatory fields
  amount: PositiveNumberSchema,
  expenseDate: DateSchema,
  category: z.string().min(1, "Category is required"),
  seasonId: z.number().int().positive("Season ID is required"),
  paymentStatus: PaymentStatusSchema,
  plotId: z.number().int().positive().optional(),
  vendorId: z.number().int().positive().optional().nullable(),
  // BR179: Optional fields
  taskId: z.number().int().positive().optional().nullable(),
  note: z.string().max(1000).optional().nullable(),
  // Legacy fields (for backward compatibility)
  itemName: z.string().max(255).optional().nullable(),
  unitPrice: PositiveNumberSchema.optional().nullable(),
  quantity: z.number().int().min(1).optional().nullable(),
});

export type ExpenseUpdateRequest = z.infer<typeof ExpenseUpdateRequestSchema>;

export type BudgetTracker = z.infer<typeof BudgetTrackerSchema>;
export type ExpenseCategoryAnalytics = z.infer<typeof ExpenseCategoryAnalyticsSchema>;
export type ExpenseTaskAnalytics = z.infer<typeof ExpenseTaskAnalyticsSchema>;
export type ExpenseVendorAnalytics = z.infer<typeof ExpenseVendorAnalyticsSchema>;
export type ExpenseTimeSeries = z.infer<typeof ExpenseTimeSeriesSchema>;

export const BudgetTrackerSchema = z.object({
  budgetAmount: NumericSchema.nullable().optional(),
  total: NumericSchema,
  paid: NumericSchema,
  unpaid: NumericSchema,
  usagePercent: NumericSchema.nullable().optional(),
  remaining: NumericSchema.nullable().optional(),
  receiptCoverage: z.number().nullable().optional(),
});

export const ExpenseCategoryAnalyticsSchema = z.object({
  category: z.string(),
  totalAmount: NumericSchema,
  count: z.number().int().optional(),
});

export const ExpenseTaskAnalyticsSchema = z.object({
  taskId: z.number().int().nullable().optional(),
  taskTitle: z.string().nullable().optional(),
  totalAmount: NumericSchema,
  count: z.number().int().optional(),
});

export const ExpenseVendorAnalyticsSchema = z.object({
  vendorId: z.number().int().nullable().optional(),
  vendorName: z.string().nullable().optional(),
  totalAmount: NumericSchema,
  count: z.number().int().optional(),
});

export const ExpenseTimeSeriesSchema = z.object({
  periodStart: DateSchema,
  label: z.string().nullable().optional(),
  totalAmount: NumericSchema,
  count: z.number().int().optional(),
});
