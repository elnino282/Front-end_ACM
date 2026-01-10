import { z } from "zod";
import { DateSchema } from "@/shared/api/types";

// ═══════════════════════════════════════════════════════════════
// EXPENSE LIST PARAMS
// ═══════════════════════════════════════════════════════════════

export const ExpenseListParamsSchema = z.object({
  from: DateSchema.optional(),
  to: DateSchema.optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
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
  amount: z.number().nullable().optional(),
  note: z.string().nullable().optional(),
  expenseDate: DateSchema,
  createdAt: z.string().nullable().optional(),
  // Legacy fields (kept for backward compatibility)
  itemName: z.string().max(255).nullable().optional(),
  unitPrice: z.number().nullable().optional(),
  quantity: z.number().int().nullable().optional(),
  totalCost: z.number().nullable().optional(),
});

export type Expense = z.infer<typeof ExpenseSchema>;

// ═══════════════════════════════════════════════════════════════
// EXPENSE CREATE REQUEST (BR175/BR176 compliant)
// ═══════════════════════════════════════════════════════════════

export const ExpenseCreateRequestSchema = z.object({
  // BR175: Mandatory fields
  amount: z.number().positive("Amount must be greater than 0"),
  expenseDate: DateSchema,
  category: z.string().min(1, "Category is required"),
  plotId: z.number().int().positive("Plot ID is required"),
  // BR175: Optional fields
  taskId: z.number().int().positive().optional().nullable(),
  note: z.string().max(1000).optional().nullable(),
  // Legacy fields (for backward compatibility)
  itemName: z.string().max(255).optional().nullable(),
  unitPrice: z.number().positive().optional().nullable(),
  quantity: z.number().int().min(1).optional().nullable(),
});

export type ExpenseCreateRequest = z.infer<typeof ExpenseCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// EXPENSE UPDATE REQUEST (BR179/BR180 compliant)
// ═══════════════════════════════════════════════════════════════

export const ExpenseUpdateRequestSchema = z.object({
  // BR179: Mandatory fields
  amount: z.number().positive("Amount must be greater than 0"),
  expenseDate: DateSchema,
  category: z.string().min(1, "Category is required"),
  seasonId: z.number().int().positive("Season ID is required"),
  plotId: z.number().int().positive("Plot ID is required"),
  // BR179: Optional fields
  taskId: z.number().int().positive().optional().nullable(),
  note: z.string().max(1000).optional().nullable(),
  // Legacy fields (for backward compatibility)
  itemName: z.string().max(255).optional().nullable(),
  unitPrice: z.number().positive().optional().nullable(),
  quantity: z.number().int().min(1).optional().nullable(),
});

export type ExpenseUpdateRequest = z.infer<typeof ExpenseUpdateRequestSchema>;
