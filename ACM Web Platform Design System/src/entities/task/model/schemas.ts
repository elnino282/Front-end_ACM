import { z } from 'zod';
import { DateSchema } from '@/shared/api/types';

const TaskDateSchema = z.preprocess((value) => {
    if (typeof value === 'string') {
        return value.split('T')[0];
    }
    return value;
}, DateSchema);

// ═══════════════════════════════════════════════════════════════
// TASK STATUS ENUM
// ═══════════════════════════════════════════════════════════════

export const TaskStatusEnum = z.enum([
    'PENDING',
    'IN_PROGRESS',
    'DONE',
    'OVERDUE',      // ADDED for overdue detection
    'CANCELLED',
]);

export type TaskStatus = z.infer<typeof TaskStatusEnum>;

// ═══════════════════════════════════════════════════════════════
// TASK LIST PARAMS (for workspace view with filters)
// ═══════════════════════════════════════════════════════════════

export const TaskListParamsSchema = z.object({
    status: TaskStatusEnum.optional(),
    seasonId: z.number().int().positive().optional(),
    q: z.string().optional(),  // search query
    page: z.number().int().min(0).default(0),
    size: z.number().int().min(1).default(20),
    sortBy: z.string().default('createdAt'),
    sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

export type TaskListParams = z.infer<typeof TaskListParamsSchema>;

// ═══════════════════════════════════════════════════════════════
// TASK RESPONSE
// ═══════════════════════════════════════════════════════════════

export const TaskSchema = z.object({
    taskId: z.number().int().positive(),  // matches backend field
    userId: z.number().int().positive().optional(),
    userName: z.string().optional(),
    seasonId: z.number().int().positive().optional().nullable(),
    seasonName: z.string().optional().nullable(),
    title: z.string().max(255),
    description: z.string().max(4000).optional().nullable(),
    plannedDate: TaskDateSchema.optional().nullable(),
    dueDate: TaskDateSchema.optional().nullable(),
    status: TaskStatusEnum,
    actualStartDate: TaskDateSchema.optional().nullable(),
    actualEndDate: TaskDateSchema.optional().nullable(),
    notes: z.string().optional().nullable(),
    createdAt: z.string().optional().nullable(),  // Accept any datetime string or null from backend
});

export type Task = z.infer<typeof TaskSchema>;

// ═══════════════════════════════════════════════════════════════
// TASK CREATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const TaskCreateRequestSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().max(4000).optional(),
    seasonId: z.number().int().positive().optional().nullable(),  // Optional season link
    plannedDate: DateSchema.optional().nullable(),  // Made optional
    dueDate: DateSchema.optional().nullable(),       // Made optional
    notes: z.string().max(4000).optional(),
});

export type TaskCreateRequest = z.infer<typeof TaskCreateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// TASK UPDATE REQUEST
// ═══════════════════════════════════════════════════════════════

export const TaskUpdateRequestSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().max(4000).optional().nullable(),
    seasonId: z.number().int().positive().optional().nullable(),
    plannedDate: DateSchema.optional().nullable(),
    dueDate: DateSchema.optional().nullable(),
    notes: z.string().max(4000).optional().nullable(),
});

export type TaskUpdateRequest = z.infer<typeof TaskUpdateRequestSchema>;

// ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?
// TASK STATUS UPDATE REQUEST
// ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?ƒ?

export const TaskStatusUpdateRequestSchema = z.object({
    status: TaskStatusEnum,
    actualStartDate: DateSchema.optional().nullable(),
    actualEndDate: DateSchema.optional().nullable(),
    notes: z.string().max(4000).optional().nullable(),
});

export type TaskStatusUpdateRequest = z.infer<typeof TaskStatusUpdateRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// TASK START REQUEST
// ═══════════════════════════════════════════════════════════════

export const TaskStartRequestSchema = z.object({
    actualStartDate: DateSchema.optional(),
});

export type TaskStartRequest = z.infer<typeof TaskStartRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// TASK DONE REQUEST
// ═══════════════════════════════════════════════════════════════

export const TaskDoneRequestSchema = z.object({
    actualEndDate: DateSchema.optional(),
});

export type TaskDoneRequest = z.infer<typeof TaskDoneRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// SEASON MINIMAL (for dropdown)
// ═══════════════════════════════════════════════════════════════

export const SeasonMinimalSchema = z.object({
    seasonId: z.number().int().positive(),
    seasonName: z.string(),
});

export type SeasonMinimal = z.infer<typeof SeasonMinimalSchema>;
