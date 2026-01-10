import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import {
    HarvestListParamsSchema,
    HarvestSchema,
    HarvestSummarySchema,
    HarvestCreateRequestSchema,
    HarvestUpdateRequestSchema,
} from '../model/schemas';
import type {
    HarvestListParams,
    Harvest,
    HarvestSummary,
    HarvestCreateRequest,
    HarvestUpdateRequest,
} from '../model/types';

export const harvestApi = {
    /**
     * List all farmer harvests, optionally filtered by seasonId
     * GET /api/v1/harvests?seasonId=&from=&to=&page=&size=
     */
    listAll: async (params?: HarvestListParams): Promise<PageResponse<Harvest>> => {
        const validatedParams = params ? HarvestListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get('/api/v1/harvests', { params: validatedParams });
        return parsePageResponse(response.data, HarvestSchema);
    },

    /**
     * Get harvest summary/KPI, optionally filtered by seasonId
     * GET /api/v1/harvests/summary?seasonId=
     */
    getSummary: async (seasonId?: number): Promise<HarvestSummary> => {
        const params = seasonId ? { seasonId } : undefined;
        const response = await httpClient.get('/api/v1/harvests/summary', { params });
        return parseApiResponse(response.data, HarvestSummarySchema);
    },

    /**
     * Legacy: List harvests for a specific season
     * GET /api/v1/seasons/{seasonId}/harvests
     */
    listBySeason: async (seasonId: number, params?: HarvestListParams): Promise<PageResponse<Harvest>> => {
        const validatedParams = params ? HarvestListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get(`/api/v1/seasons/${seasonId}/harvests`, { params: validatedParams });
        return parsePageResponse(response.data, HarvestSchema);
    },

    getById: async (id: number): Promise<Harvest> => {
        const response = await httpClient.get(`/api/v1/harvests/${id}`);
        return parseApiResponse(response.data, HarvestSchema);
    },

    create: async (seasonId: number, data: HarvestCreateRequest): Promise<Harvest> => {
        const validatedPayload = HarvestCreateRequestSchema.parse(data);
        const response = await httpClient.post(`/api/v1/seasons/${seasonId}/harvests`, validatedPayload);
        return parseApiResponse(response.data, HarvestSchema);
    },

    update: async (id: number, data: HarvestUpdateRequest): Promise<Harvest> => {
        const validatedPayload = HarvestUpdateRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/harvests/${id}`, validatedPayload);
        return parseApiResponse(response.data, HarvestSchema);
    },

    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/api/v1/harvests/${id}`);
    },
};
