import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
    SupplierSchema,
    SupplyItemSchema,
    SupplyLotSchema,
    StockInRequestSchema,
    StockInResponseSchema,
} from '../model/schemas';
import type {
    Supplier,
    SupplyItem,
    SupplyLot,
    StockInRequest,
    StockInResponse,
    SuppliersParams,
    SupplyItemsParams,
    SupplyLotsParams,
} from '../model/types';

export const suppliesApi = {
    /**
     * GET /api/v1/supplies/suppliers
     * Get paginated list of suppliers
     */
    getSuppliers: async (params?: SuppliersParams): Promise<PageResponse<Supplier>> => {
        const queryParams: Record<string, unknown> = {};
        if (params?.q) queryParams.q = params.q;
        if (params?.page !== undefined) queryParams.page = params.page;
        if (params?.size !== undefined) queryParams.size = params.size;

        const response = await httpClient.get('/api/v1/supplies/suppliers', { params: queryParams });
        return parsePageResponse(response.data, SupplierSchema);
    },

    /**
     * GET /api/v1/supplies/items
     * Get paginated list of supply items
     */
    getSupplyItems: async (params?: SupplyItemsParams): Promise<PageResponse<SupplyItem>> => {
        const queryParams: Record<string, unknown> = {};
        if (params?.q) queryParams.q = params.q;
        if (params?.restricted !== undefined) queryParams.restricted = params.restricted;
        if (params?.page !== undefined) queryParams.page = params.page;
        if (params?.size !== undefined) queryParams.size = params.size;

        const response = await httpClient.get('/api/v1/supplies/items', { params: queryParams });
        return parsePageResponse(response.data, SupplyItemSchema);
    },

    /**
     * GET /api/v1/supplies/lots
     * Get paginated list of supply lots
     */
    getSupplyLots: async (params?: SupplyLotsParams): Promise<PageResponse<SupplyLot>> => {
        const queryParams: Record<string, unknown> = {};
        if (params?.itemId) queryParams.itemId = params.itemId;
        if (params?.supplierId) queryParams.supplierId = params.supplierId;
        if (params?.status) queryParams.status = params.status;
        if (params?.q) queryParams.q = params.q;
        if (params?.page !== undefined) queryParams.page = params.page;
        if (params?.size !== undefined) queryParams.size = params.size;

        const response = await httpClient.get('/api/v1/supplies/lots', { params: queryParams });
        return parsePageResponse(response.data, SupplyLotSchema);
    },

    /**
     * GET /api/v1/supplies/suppliers (all, no pagination)
     * For dropdowns
     */
    getAllSuppliers: async (): Promise<Supplier[]> => {
        const response = await httpClient.get('/api/v1/supplies/suppliers', { 
            params: { page: 0, size: 1000 } 
        });
        const pageResponse = parsePageResponse(response.data, SupplierSchema);
        return pageResponse.items;
    },

    /**
     * GET /api/v1/supplies/items (all, no pagination)
     * For dropdowns
     */
    getAllSupplyItems: async (): Promise<SupplyItem[]> => {
        const response = await httpClient.get('/api/v1/supplies/items', { 
            params: { page: 0, size: 1000 } 
        });
        const pageResponse = parsePageResponse(response.data, SupplyItemSchema);
        return pageResponse.items;
    },

    /**
     * POST /api/v1/supplies/stock-in
     * Record Stock IN operation
     */
    stockIn: async (data: StockInRequest): Promise<StockInResponse> => {
        const validatedPayload = StockInRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/supplies/stock-in', validatedPayload);
        return parseApiResponse(response.data, StockInResponseSchema);
    },
};
