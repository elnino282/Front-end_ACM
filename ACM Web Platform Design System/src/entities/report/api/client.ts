import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import {
    ReportListParamsSchema,
    ReportSchema,
    ReportDetailSchema,
} from '../model/schemas';
import type {
    ReportListParams,
    Report,
    ReportDetail,
} from '../model/types';

export const reportApi = {
    /** GET /api/v1/reports - List reports (Buyer) */
    list: async (params?: ReportListParams): Promise<PageResponse<Report>> => {
        const validatedParams = params ? ReportListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get('/api/v1/reports', { params: validatedParams });
        return parsePageResponse(response.data, ReportSchema);
    },

    /** GET /api/v1/reports/{id} - Get report detail */
    getById: async (id: number): Promise<ReportDetail> => {
        const response = await httpClient.get(`/api/v1/reports/${id}`);
        return parseApiResponse(response.data, ReportDetailSchema);
    },

};
