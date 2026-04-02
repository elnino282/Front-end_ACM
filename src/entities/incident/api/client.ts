import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import {
    IncidentSchema,
    IncidentListParamsSchema,
    IncidentCreateRequestSchema,
    IncidentUpdateRequestSchema,
    IncidentStatusUpdateRequestSchema,
    IncidentSummarySchema,
} from '../model/schemas';
import type {
    Incident,
    IncidentListParams,
    IncidentCreateRequest,
    IncidentUpdateRequest,
    IncidentStatusUpdateRequest,
    IncidentSummary,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// INCIDENT API CLIENT
// ═══════════════════════════════════════════════════════════════

export const incidentApi = {
    /**
     * List incidents with pagination and filters
     * GET /api/v1/incidents?seasonId=&status=&severity=&type=&q=&from=&to=&page=&size=&sort=
     */
    list: async (params: IncidentListParams): Promise<PageResponse<Incident>> => {
        const validatedParams = IncidentListParamsSchema.parse(params);
        const response = await httpClient.get('/api/v1/incidents', { params: validatedParams });
        return parsePageResponse(response.data, IncidentSchema);
    },

    /**
     * Get incident by ID
     * GET /api/v1/incidents/{id}
     */
    getById: async (id: number): Promise<Incident> => {
        const response = await httpClient.get(`/api/v1/incidents/${id}`);
        return parseApiResponse(response.data, IncidentSchema);
    },

    /**
     * Create a new incident
     * POST /api/v1/incidents
     */
    create: async (data: IncidentCreateRequest): Promise<Incident> => {
        const validatedPayload = IncidentCreateRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/incidents', validatedPayload);
        return parseApiResponse(response.data, IncidentSchema);
    },

    /**
     * Update incident details
     * PUT /api/v1/incidents/{id}
     */
    update: async (id: number, data: IncidentUpdateRequest): Promise<Incident> => {
        const validatedPayload = IncidentUpdateRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/incidents/${id}`, validatedPayload);
        return parseApiResponse(response.data, IncidentSchema);
    },

    /**
     * Update incident status
     * PATCH /api/v1/incidents/{id}/status
     */
    updateStatus: async (id: number, data: IncidentStatusUpdateRequest): Promise<Incident> => {
        const validatedPayload = IncidentStatusUpdateRequestSchema.parse(data);
        const response = await httpClient.patch(`/api/v1/incidents/${id}/status`, validatedPayload);
        return parseApiResponse(response.data, IncidentSchema);
    },

    /**
     * Delete incident
     * DELETE /api/v1/incidents/{id}
     */
    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/api/v1/incidents/${id}`);
    },

    /**
     * Get incident summary (counts by status)
     * GET /api/v1/incidents/summary?seasonId=
     */
    getSummary: async (seasonId: number): Promise<IncidentSummary> => {
        const response = await httpClient.get('/api/v1/incidents/summary', { params: { seasonId } });
        return parseApiResponse(response.data, IncidentSummarySchema);
    },

    // ═══════════════════════════════════════════════════════════════
    // LEGACY SUPPORT (for backward compatibility)
    // ═══════════════════════════════════════════════════════════════

    /** @deprecated Use list() with params instead */
    listBySeason: async (seasonId: number): Promise<Incident[]> => {
        const response = await incidentApi.list({ seasonId, page: 0, size: 100 });
        return response.items;
    },
};
