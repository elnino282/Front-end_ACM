import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import {
    ProvinceArrayResponseSchema,
    WardArrayResponseSchema,
} from '../model/schemas';
import type {
    ProvinceArrayResponse,
    WardArrayResponse,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// LOCATION API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const locationApi = {
    /**
     * Get all provinces for dropdown selection
     */
    getProvinces: async (): Promise<ProvinceArrayResponse> => {
        const response = await httpClient.get('/api/v1/locations/provinces');
        return parseApiResponse(response.data, ProvinceArrayResponseSchema);
    },

    /**
     * Get wards by province ID for dropdown selection
     */
    getWards: async (provinceId: number): Promise<WardArrayResponse> => {
        const response = await httpClient.get('/api/v1/locations/wards', {
            params: { provinceId },
        });
        return parseApiResponse(response.data, WardArrayResponseSchema);
    },
};
