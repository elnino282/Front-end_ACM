import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
    CropListParamsSchema,
    CropSchema,
    CropRequestSchema,
} from '../model/schemas';
import type {
    CropListParams,
    Crop,
    CropRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// CROP API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const cropApi = {
    /**
     * List all crops for farmer workspace
     * GET /api/v1/crops
     */
    list: async (params?: CropListParams): Promise<Crop[]> => {
        const validatedParams = params ? CropListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get('/api/v1/crops', { params: validatedParams });
        return parseApiResponse(response.data, z.array(CropSchema));
    },

    /**
     * Get crop detail by ID
     * GET /api/v1/crops/{id}
     */
    getById: async (id: number): Promise<Crop> => {
        const response = await httpClient.get(`/api/v1/crops/${id}`);
        return parseApiResponse(response.data, CropSchema);
    },

    /**
     * Create a new crop definition
     * POST /api/v1/crops
     */
    create: async (data: CropRequest): Promise<Crop> => {
        const validatedPayload = CropRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/crops', validatedPayload);
        return parseApiResponse(response.data, CropSchema);
    },

    /**
     * Update crop information
     * PUT /api/v1/crops/{id}
     */
    update: async (id: number, data: CropRequest): Promise<Crop> => {
        const validatedPayload = CropRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/crops/${id}`, validatedPayload);
        return parseApiResponse(response.data, CropSchema);
    },

    /**
     * Delete crop definition
     * DELETE /api/v1/crops/{id}
     */
    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/api/v1/crops/${id}`);
    },
};
