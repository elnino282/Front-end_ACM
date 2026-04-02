import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import {
    SaleListParamsSchema,
    SaleSchema,
    SaleCreateRequestSchema,
    SaleUpdateRequestSchema,
} from '../model/schemas';
import type {
    SaleListParams,
    Sale,
    SaleCreateRequest,
    SaleUpdateRequest,
} from '../model/types';

export const saleApi = {
    // ═══════════════════════════════════════════════════════════════
    // FARMER SALES ENDPOINTS
    // ═══════════════════════════════════════════════════════════════

    /** GET /api/v1/farmer/sales - List farmer's sales */
    listFarmerSales: async (params?: SaleListParams): Promise<PageResponse<Sale>> => {
        const validatedParams = params ? SaleListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get('/api/v1/farmer/sales', { params: validatedParams });
        return parsePageResponse(response.data, SaleSchema);
    },

    /** POST /api/v1/farmer/sales - Create sale (Farmer) */
    create: async (data: SaleCreateRequest): Promise<Sale> => {
        const validatedPayload = SaleCreateRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/farmer/sales', validatedPayload);
        return parseApiResponse(response.data, SaleSchema);
    },

    /** PUT /api/v1/farmer/sales/{id} - Update sale (Farmer) */
    update: async (id: number, data: SaleUpdateRequest): Promise<Sale> => {
        const validatedPayload = SaleUpdateRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/farmer/sales/${id}`, validatedPayload);
        return parseApiResponse(response.data, SaleSchema);
    },

    /** DELETE /api/v1/farmer/sales/{id} - Delete sale (Farmer) */
    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/api/v1/farmer/sales/${id}`);
    },

    // ═══════════════════════════════════════════════════════════════
    // BUYER SALES ENDPOINTS
    // ═══════════════════════════════════════════════════════════════

    /** GET /api/v1/buyer/sales - List buyer's sales view */
    listBuyerSales: async (params?: SaleListParams): Promise<PageResponse<Sale>> => {
        const validatedParams = params ? SaleListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get('/api/v1/buyer/sales', { params: validatedParams });
        return parsePageResponse(response.data, SaleSchema);
    },
};
