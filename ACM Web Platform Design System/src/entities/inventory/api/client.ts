import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
    WarehouseSchema,
    StockLocationSchema,
    OnHandRowSchema,
    StockMovementSchema,
    StockMovementRequestSchema,
} from '../model/schemas';
import type {
    Warehouse,
    StockLocation,
    OnHandRow,
    StockMovement,
    StockMovementRequest,
    OnHandParams,
    MovementsParams,
} from '../model/types';

export const inventoryApi = {
    /**
     * GET /api/v1/inventory/warehouses/my
     * Get all warehouses accessible to the current farmer
     */
    getMyWarehouses: async (): Promise<Warehouse[]> => {
        const response = await httpClient.get('/api/v1/inventory/warehouses/my');
        return parseApiResponse(response.data, z.array(WarehouseSchema));
    },

    /**
     * GET /api/v1/inventory/locations?warehouseId=
     * Get stock locations for a warehouse
     */
    getLocations: async (warehouseId: number): Promise<StockLocation[]> => {
        const response = await httpClient.get('/api/v1/inventory/locations', {
            params: { warehouseId }
        });
        return parseApiResponse(response.data, z.array(StockLocationSchema));
    },

    /**
     * GET /api/v1/inventory/on-hand?warehouseId=&locationId=&lotId=&q=&page=&size=
     * Get paginated on-hand inventory rows
     */
    getOnHandList: async (params: OnHandParams): Promise<PageResponse<OnHandRow>> => {
        const queryParams: Record<string, unknown> = { warehouseId: params.warehouseId };
        if (params.locationId) queryParams.locationId = params.locationId;
        if (params.lotId) queryParams.lotId = params.lotId;
        if (params.q) queryParams.q = params.q;
        if (params.page !== undefined) queryParams.page = params.page;
        if (params.size !== undefined) queryParams.size = params.size;

        const response = await httpClient.get('/api/v1/inventory/on-hand', { params: queryParams });
        return parsePageResponse(response.data, OnHandRowSchema);
    },

    /**
     * GET /api/v1/inventory/movements?warehouseId=&type=&from=&to=&page=&size=
     * Get paginated movement history
     */
    getMovements: async (params: MovementsParams): Promise<PageResponse<StockMovement>> => {
        const queryParams: Record<string, unknown> = { warehouseId: params.warehouseId };
        if (params.type) queryParams.type = params.type;
        if (params.from) queryParams.from = params.from;
        if (params.to) queryParams.to = params.to;
        if (params.page !== undefined) queryParams.page = params.page;
        if (params.size !== undefined) queryParams.size = params.size;

        const response = await httpClient.get('/api/v1/inventory/movements', { params: queryParams });
        return parsePageResponse(response.data, StockMovementSchema);
    },

    /**
     * POST /api/v1/inventory/movements
     * Record stock movement (IN/OUT/ADJUST)
     */
    recordMovement: async (data: StockMovementRequest): Promise<StockMovement> => {
        const validatedPayload = StockMovementRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/inventory/movements', validatedPayload);
        return parseApiResponse(response.data, StockMovementSchema);
    },

    /**
     * GET /api/v1/inventory/lots/{lotId}/on-hand
     * Get current on-hand quantity for a supply lot at a warehouse/location
     */
    getOnHand: async (lotId: number, warehouseId: number, locationId?: number): Promise<number> => {
        const params: Record<string, unknown> = { warehouseId };
        if (locationId) params.locationId = locationId;

        const response = await httpClient.get(`/api/v1/inventory/lots/${lotId}/on-hand`, { params });
        return parseApiResponse(response.data, z.number());
    },
};
