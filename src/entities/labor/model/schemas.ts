import { z } from "zod";
import { DateSchema } from "@/shared/api/types";

const DateTimeSchema = z.string().nullable().optional();

export const EmployeeDirectorySchema = z.object({
  userId: z.number().int().positive(),
  username: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});

export type EmployeeDirectory = z.infer<typeof EmployeeDirectorySchema>;

export const SeasonEmployeeSchema = z.object({
  id: z.number().int().positive(),
  seasonId: z.number().int().positive().nullable().optional(),
  seasonName: z.string().nullable().optional(),
  employeeUserId: z.number().int().positive(),
  employeeUsername: z.string().nullable().optional(),
  employeeName: z.string().nullable().optional(),
  employeeEmail: z.string().nullable().optional(),
  wagePerTask: z.number().nullable().optional(),
  active: z.boolean().nullable().optional(),
  createdAt: DateTimeSchema,
});

export type SeasonEmployee = z.infer<typeof SeasonEmployeeSchema>;

export const TaskProgressLogSchema = z.object({
  id: z.number().int().positive(),
  taskId: z.number().int().positive().nullable().optional(),
  taskTitle: z.string().nullable().optional(),
  seasonId: z.number().int().positive().nullable().optional(),
  seasonName: z.string().nullable().optional(),
  employeeUserId: z.number().int().positive().nullable().optional(),
  employeeName: z.string().nullable().optional(),
  progressPercent: z.number().int().min(0).max(100),
  note: z.string().nullable().optional(),
  evidenceUrl: z.string().nullable().optional(),
  loggedAt: DateTimeSchema,
});

export type TaskProgressLog = z.infer<typeof TaskProgressLogSchema>;

export const PayrollRecordSchema = z.object({
  id: z.number().int().positive(),
  seasonId: z.number().int().positive().nullable().optional(),
  seasonName: z.string().nullable().optional(),
  employeeUserId: z.number().int().positive().nullable().optional(),
  employeeName: z.string().nullable().optional(),
  periodStart: DateSchema.nullable().optional(),
  periodEnd: DateSchema.nullable().optional(),
  totalAssignedTasks: z.number().int().min(0),
  totalCompletedTasks: z.number().int().min(0),
  wagePerTask: z.number().nullable().optional(),
  totalAmount: z.number().nullable().optional(),
  generatedAt: DateTimeSchema,
  note: z.string().nullable().optional(),
});

export type PayrollRecord = z.infer<typeof PayrollRecordSchema>;

export const AddSeasonEmployeeRequestSchema = z.object({
  employeeUserId: z.number().int().positive(),
  wagePerTask: z.number().min(0).optional(),
});

export type AddSeasonEmployeeRequest = z.infer<typeof AddSeasonEmployeeRequestSchema>;

export const UpdateSeasonEmployeeRequestSchema = z.object({
  wagePerTask: z.number().min(0).optional(),
  active: z.boolean().optional(),
});

export type UpdateSeasonEmployeeRequest = z.infer<typeof UpdateSeasonEmployeeRequestSchema>;

export const AssignTaskEmployeeRequestSchema = z.object({
  employeeUserId: z.number().int().positive(),
});

export type AssignTaskEmployeeRequest = z.infer<typeof AssignTaskEmployeeRequestSchema>;

export const EmployeeTaskProgressRequestSchema = z.object({
  progressPercent: z.number().int().min(0).max(100),
  note: z.string().max(4000).optional(),
  evidenceUrl: z.string().max(1000).optional(),
});

export type EmployeeTaskProgressRequest = z.infer<typeof EmployeeTaskProgressRequestSchema>;

export const PayrollRecalculateRequestSchema = z.object({
  employeeUserId: z.number().int().positive().optional(),
  periodStart: DateSchema.optional(),
  periodEnd: DateSchema.optional(),
});

export type PayrollRecalculateRequest = z.infer<typeof PayrollRecalculateRequestSchema>;

