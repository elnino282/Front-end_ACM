import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse } from '@/shared/api/types';
import {
    PlotListParamsSchema,
    PlotArrayResponseSchema,
    PlotSchema,
    PlotRequestSchema,
} from '../model/schemas';
import type {
    PlotListParams,
    PlotResponse,
    PlotArrayResponse,
    Plot,
    PlotRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// PLOT API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const plotApi = {
    /**
     * List all plots for the current authenticated farmer
     */
    listAll: async (): Promise<PlotArrayResponse> => {
        const response = await httpClient.get('/api/v1/plots');
        return parseApiResponse(response.data, PlotArrayResponseSchema);
    },

    /**
     * List plots belonging to a specific farm
     */
    listByFarm: async (farmId: number, params?: PlotListParams): Promise<PlotResponse> => {
        const validatedParams = params ? PlotListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get(`/api/v1/farms/${farmId}/plots`, { params: validatedParams });
        const rawResult = response.data?.result ?? response.data;
        if (Array.isArray(rawResult)) {
            return {
                items: rawResult.map((item: unknown) => PlotSchema.parse(item)),
                page: 0,
                size: rawResult.length,
                totalElements: rawResult.length,
                totalPages: 1,
            };
        }
        return parsePageResponse(response.data, PlotSchema);
    },

    /**
     * Get plot detail by ID
     */
    getById: async (id: number): Promise<Plot> => {
        const response = await httpClient.get(`/api/v1/plots/${id}`);
        return parseApiResponse(response.data, PlotSchema);
    },

    /**
     * Create a new plot (farmer-level)
     */
    create: async (data: PlotRequest): Promise<Plot> => {
        const validatedPayload = PlotRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/plots', validatedPayload);
        return parseApiResponse(response.data, PlotSchema);
    },

    /**
     * Create a new plot within a specific farm
     */
    createInFarm: async (farmId: number, data: PlotRequest): Promise<Plot> => {
        const validatedPayload = PlotRequestSchema.parse(data);
        const response = await httpClient.post(`/api/v1/farms/${farmId}/plots`, validatedPayload);
        return parseApiResponse(response.data, PlotSchema);
    },

    /**
     * Update an existing plot
     */
    update: async (id: number, data: PlotRequest): Promise<Plot> => {
        const validatedPayload = PlotRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/plots/${id}`, validatedPayload);
        return parseApiResponse(response.data, PlotSchema);
    },

    /**
     * Delete/archive a plot
     */
    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/api/v1/plots/${id}`);
    },
};
