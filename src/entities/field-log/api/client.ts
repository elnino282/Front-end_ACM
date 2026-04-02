import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
    FieldLogListParamsSchema,
    FieldLogSchema,
    FieldLogCreateRequestSchema,
    FieldLogUpdateRequestSchema,
    SeasonMinimalSchema,
} from '../model/schemas';
import type {
    FieldLogListParams,
    FieldLog,
    FieldLogCreateRequest,
    FieldLogUpdateRequest,
    SeasonMinimal,
} from '../model/types';

export const fieldLogApi = {
    /**
     * List field logs for a season.
     * GET /api/v1/field-logs?seasonId=&type=&q=&from=&to=&page=&size=
     */
    listBySeason: async (seasonId: number, params?: FieldLogListParams): Promise<PageResponse<FieldLog>> => {
        const validatedParams = params ? FieldLogListParamsSchema.parse(params) : {};
        const response = await httpClient.get('/api/v1/field-logs', { 
            params: { seasonId, ...validatedParams } 
        });
        return parsePageResponse(response.data, FieldLogSchema);
    },

    /**
     * Get field log by ID.
     * GET /api/v1/field-logs/{id}
     */
    getById: async (id: number): Promise<FieldLog> => {
        const response = await httpClient.get(`/api/v1/field-logs/${id}`);
        return parseApiResponse(response.data, FieldLogSchema);
    },

    /**
     * Create field log.
     * POST /api/v1/field-logs (body: {seasonId, logDate, logType, notes})
     */
    create: async (seasonId: number, data: FieldLogCreateRequest): Promise<FieldLog> => {
        const validatedPayload = FieldLogCreateRequestSchema.parse({ ...data, seasonId });
        const response = await httpClient.post('/api/v1/field-logs', validatedPayload);
        return parseApiResponse(response.data, FieldLogSchema);
    },

    /**
     * Update field log.
     * PUT /api/v1/field-logs/{id} (body: {logDate, logType, notes})
     */
    update: async (id: number, data: FieldLogUpdateRequest): Promise<FieldLog> => {
        const validatedPayload = FieldLogUpdateRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/field-logs/${id}`, validatedPayload);
        return parseApiResponse(response.data, FieldLogSchema);
    },

    /**
     * Delete field log.
     * DELETE /api/v1/field-logs/{id}
     */
    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/api/v1/field-logs/${id}`);
    },

    /**
     * Get user's seasons for dropdown.
     * GET /api/v1/seasons/my
     */
    getUserSeasons: async (): Promise<SeasonMinimal[]> => {
        const response = await httpClient.get('/api/v1/seasons/my');
        const data = response.data;
        // Handle ApiResponse wrapper
        const result = data?.result ?? data?.data ?? data;
        return z.array(SeasonMinimalSchema).parse(result);
    },
};


