import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
    SeasonListParamsSchema,
    SeasonSchema,
    SeasonDetailResponseSchema,
    SeasonCreateRequestSchema,
    SeasonUpdateRequestSchema,
    SeasonStatusUpdateRequestSchema,
    SeasonStartRequestSchema,
    SeasonCompleteRequestSchema,
    SeasonCancelRequestSchema,
} from '../model/schemas';
import type {
    SeasonListParams,
    Season,
    SeasonDetailResponse,
    SeasonCreateRequest,
    SeasonUpdateRequest,
    SeasonStatusUpdateRequest,
    SeasonStartRequest,
    SeasonCompleteRequest,
    SeasonCancelRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// SEASON API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const seasonApi = {
    /**
     * Search seasons by various filters
     * GET /api/v1/seasons
     */
    list: async (params?: SeasonListParams): Promise<PageResponse<Season>> => {
        // console.log('[seasonApi.list] Called with params:', params);

        try {
            const validatedParams = params ? SeasonListParamsSchema.parse(params) : undefined;
            const response = await httpClient.get('/api/v1/seasons', { params: validatedParams });

            const data = response.data;
            // console.log('[seasonApi.list] Data received:', data);

            // Robust Handling: Check if result is Array (List format) or Object (Page format)
            if (data?.result && Array.isArray(data.result)) {
                console.warn('[seasonApi.list] Backend returned plain list instead of PageResponse. Adapting...');
                // It's a list response (like Crops), adapt to PageResponse
                const items = z.array(SeasonSchema).parse(data.result);
                return {
                    items,
                    page: 0,
                    size: items.length,
                    totalElements: items.length,
                    totalPages: 1
                };
            }

            // Otherwise, expect standard PageResponse
            return parsePageResponse(response.data, SeasonSchema);
        } catch (error) {
            console.error('[seasonApi.list] Parsing/Network Error:', error);
            throw error;
        }
    },


    /**
     * Get season detail
     * GET /api/v1/seasons/{id}
     */
    getById: async (id: number): Promise<SeasonDetailResponse> => {
        const response = await httpClient.get(`/api/v1/seasons/${id}`);
        return parseApiResponse(response.data, SeasonDetailResponseSchema);
    },

    /**
     * Create a new season
     * POST /api/v1/seasons
     */
    create: async (data: SeasonCreateRequest): Promise<SeasonDetailResponse> => {
        const validatedPayload = SeasonCreateRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/seasons', validatedPayload);
        return parseApiResponse(response.data, SeasonDetailResponseSchema);
    },

    /**
     * Update season details
     * PUT /api/v1/seasons/{id}
     */
    update: async (id: number, data: SeasonUpdateRequest): Promise<SeasonDetailResponse> => {
        const validatedPayload = SeasonUpdateRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/seasons/${id}`, validatedPayload);
        return parseApiResponse(response.data, SeasonDetailResponseSchema);
    },

    /**
     * Update season status (state machine)
     * PATCH /api/v1/seasons/{id}/status
     */
    updateStatus: async (id: number, data: SeasonStatusUpdateRequest): Promise<Season> => {
        const validatedPayload = SeasonStatusUpdateRequestSchema.parse(data);
        const response = await httpClient.patch(`/api/v1/seasons/${id}/status`, validatedPayload);
        return parseApiResponse(response.data, SeasonSchema);
    },

    /**
     * Start a planned season (PLANNED -> ACTIVE)
     * POST /api/v1/seasons/{id}/start
     */
    start: async (id: number, data?: SeasonStartRequest): Promise<Season> => {
        const validatedPayload = data ? SeasonStartRequestSchema.parse(data) : undefined;
        const response = await httpClient.post(`/api/v1/seasons/${id}/start`, validatedPayload);
        return parseApiResponse(response.data, SeasonSchema);
    },

    /**
     * Complete an active season (ACTIVE -> COMPLETED)
     * POST /api/v1/seasons/{id}/complete
     */
    complete: async (id: number, data: SeasonCompleteRequest): Promise<Season> => {
        const validatedPayload = SeasonCompleteRequestSchema.parse(data);
        const response = await httpClient.post(`/api/v1/seasons/${id}/complete`, validatedPayload);
        return parseApiResponse(response.data, SeasonSchema);
    },

    /**
     * Cancel a season (PLANNED/ACTIVE -> CANCELLED)
     * POST /api/v1/seasons/{id}/cancel
     */
    cancel: async (id: number, data?: SeasonCancelRequest): Promise<Season> => {
        const validatedPayload = data ? SeasonCancelRequestSchema.parse(data) : undefined;
        const response = await httpClient.post(`/api/v1/seasons/${id}/cancel`, validatedPayload);
        return parseApiResponse(response.data, SeasonSchema);
    },

    /**
     * Delete season
     * DELETE /api/v1/seasons/{id}
     */
    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/api/v1/seasons/${id}`);
    },

    /**
     * Get my seasons (minimal for dropdown)
     * GET /api/v1/seasons/my
     */
    getMySeasons: async (): Promise<import('../model/schemas').MySeason[]> => {
        const { MySeasonSchema } = await import('../model/schemas');
        const response = await httpClient.get('/api/v1/seasons/my');
        return parseApiResponse(response.data, z.array(MySeasonSchema));
    },

    /**
     * BR15: Archive a completed or cancelled season
     * PATCH /api/v1/seasons/{id}/archive
     */
    archive: async (id: number): Promise<Season> => {
        const response = await httpClient.patch(`/api/v1/seasons/${id}/archive`);
        return parseApiResponse(response.data, SeasonSchema);
    },

    /**
     * BR17: Search seasons by keyword
     * GET /api/v1/seasons/search?q={keyword}
     */
    searchByKeyword: async (keyword: string): Promise<Season[]> => {
        const response = await httpClient.get('/api/v1/seasons/search', {
            params: { q: keyword },
        });
        return parseApiResponse(response.data, z.array(SeasonSchema));
    },
};

