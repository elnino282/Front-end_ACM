import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import {
    TaskListParamsSchema,
    TaskSchema,
    TaskCreateRequestSchema,
    TaskUpdateRequestSchema,
    TaskStatusUpdateRequestSchema,
} from '../model/schemas';
import type {
    TaskListParams,
    Task,
    TaskCreateRequest,
    TaskUpdateRequest,
    TaskStatusUpdateRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// TASK API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const taskApi = {
    /**
     * List tasks for a season
     * GET /api/v1/seasons/{seasonId}/tasks
     */
    listBySeason: async (seasonId: number, params?: TaskListParams): Promise<PageResponse<Task>> => {
        const validatedParams = params ? TaskListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get(`/api/v1/seasons/${seasonId}/tasks`, { params: validatedParams });
        return parsePageResponse(response.data, TaskSchema);
    },

    /**
     * List tasks for workspace (user-scoped)
     * GET /api/v1/workspace/tasks
     */
    listWorkspace: async (params?: TaskListParams): Promise<PageResponse<Task>> => {
        const validatedParams = params ? TaskListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get('/api/v1/workspace/tasks', { params: validatedParams });
        return parsePageResponse(response.data, TaskSchema);
    },

    /**
     * Get task detail
     * GET /api/v1/tasks/{id}
     */
    getById: async (id: number): Promise<Task> => {
        const response = await httpClient.get(`/api/v1/tasks/${id}`);
        return parseApiResponse(response.data, TaskSchema);
    },

    /**
     * Create a new task in season
     * POST /api/v1/seasons/{seasonId}/tasks
     */
    create: async (seasonId: number, data: TaskCreateRequest): Promise<Task> => {
        const validatedPayload = TaskCreateRequestSchema.parse(data);
        const response = await httpClient.post(`/api/v1/seasons/${seasonId}/tasks`, validatedPayload);
        return parseApiResponse(response.data, TaskSchema);
    },

    /**
     * Update task details
     * PUT /api/v1/tasks/{id}
     */
    update: async (id: number, data: TaskUpdateRequest): Promise<Task> => {
        const validatedPayload = TaskUpdateRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/tasks/${id}`, validatedPayload);
        return parseApiResponse(response.data, TaskSchema);
    },

    /**
     * Update task status
     * PATCH /api/v1/tasks/{id}/status
     */
    updateStatus: async (id: number, data: TaskStatusUpdateRequest): Promise<Task> => {
        const validatedPayload = TaskStatusUpdateRequestSchema.parse(data);
        const response = await httpClient.patch(`/api/v1/tasks/${id}/status`, validatedPayload);
        return parseApiResponse(response.data, TaskSchema);
    },

    /**
     * Delete task
     * DELETE /api/v1/tasks/{id}
     */
    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/api/v1/tasks/${id}`);
    },
};
