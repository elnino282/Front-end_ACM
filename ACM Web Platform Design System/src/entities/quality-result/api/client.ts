import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
    QualityResultSchema,
    QualityResultCreateRequestSchema,
    QualityResultUpdateRequestSchema,
} from '../model/schemas';
import type {
    QualityResult,
    QualityResultCreateRequest,
    QualityResultUpdateRequest,
} from '../model/types';

export const qualityResultApi = {
    /** GET /api/v1/harvests/{id}/quality-results - List quality results for a harvest */
    listByHarvest: async (harvestId: number): Promise<QualityResult[]> => {
        const response = await httpClient.get(`/api/v1/harvests/${harvestId}/quality-results`);
        return parseApiResponse(response.data, z.array(QualityResultSchema));
    },

    /** POST /api/v1/harvests/{id}/quality-results - Create quality result */
    create: async (harvestId: number, data: QualityResultCreateRequest): Promise<QualityResult> => {
        const validatedPayload = QualityResultCreateRequestSchema.parse(data);
        const response = await httpClient.post(`/api/v1/harvests/${harvestId}/quality-results`, validatedPayload);
        return parseApiResponse(response.data, QualityResultSchema);
    },

    /** PUT /api/v1/quality-results/{id} - Update quality result */
    update: async (id: number, data: QualityResultUpdateRequest): Promise<QualityResult> => {
        const validatedPayload = QualityResultUpdateRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/quality-results/${id}`, validatedPayload);
        return parseApiResponse(response.data, QualityResultSchema);
    },
};
