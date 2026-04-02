import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
    VarietySchema,
} from '../model/schemas';
import type {
    Variety,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// VARIETY API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const varietyApi = {
    /**
     * List all varieties belonging to a crop
     * GET /api/v1/varieties/by-crop/{cropId}
     * Auth: FARMER
     */
    listByCrop: async (cropId: number): Promise<Variety[]> => {
        const response = await httpClient.get(`/api/v1/varieties/by-crop/${cropId}`);
        return parseApiResponse(response.data, z.array(VarietySchema));
    },

    /**
     * Get a single variety by ID
     * GET /api/v1/varieties/{id}
     * Auth: FARMER
     */
    getById: async (id: number): Promise<Variety> => {
        const response = await httpClient.get(`/api/v1/varieties/${id}`);
        return parseApiResponse(response.data, VarietySchema);
    },

};
