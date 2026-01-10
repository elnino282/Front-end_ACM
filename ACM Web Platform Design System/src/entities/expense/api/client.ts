import httpClient from '@/shared/api/http';
import { parseApiResponse, parsePageResponse, type PageResponse } from '@/shared/api/types';
import {
    ExpenseListParamsSchema,
    ExpenseSchema,
    ExpenseCreateRequestSchema,
    ExpenseUpdateRequestSchema,
} from '../model/schemas';
import type {
    ExpenseListParams,
    Expense,
    ExpenseCreateRequest,
    ExpenseUpdateRequest,
} from '../model/types';

export const expenseApi = {
    /**
     * List all farmer expenses across seasons
     * GET /api/v1/expenses (with optional seasonId, q, from, to filters)
     */
    listAll: async (params?: ExpenseListParams & { seasonId?: number; q?: string }): Promise<PageResponse<Expense>> => {
        const validatedParams = params ? ExpenseListParamsSchema.parse(params) : undefined;
        const queryParams = { ...validatedParams, seasonId: params?.seasonId, q: params?.q };
        const response = await httpClient.get('/api/v1/expenses', { params: queryParams });
        return parsePageResponse(response.data, ExpenseSchema);
    },

    /**
     * List expenses for a specific season
     * GET /api/v1/seasons/{seasonId}/expenses
     */
    listBySeason: async (seasonId: number, params?: ExpenseListParams): Promise<PageResponse<Expense>> => {
        const validatedParams = params ? ExpenseListParamsSchema.parse(params) : undefined;
        const response = await httpClient.get(`/api/v1/seasons/${seasonId}/expenses`, { params: validatedParams });
        return parsePageResponse(response.data, ExpenseSchema);
    },

    getById: async (id: number): Promise<Expense> => {
        const response = await httpClient.get(`/api/v1/expenses/${id}`);
        return parseApiResponse(response.data, ExpenseSchema);
    },

    create: async (seasonId: number, data: ExpenseCreateRequest): Promise<Expense> => {
        const validatedPayload = ExpenseCreateRequestSchema.parse(data);
        const response = await httpClient.post(`/api/v1/seasons/${seasonId}/expenses`, validatedPayload);
        return parseApiResponse(response.data, ExpenseSchema);
    },

    update: async (id: number, data: ExpenseUpdateRequest): Promise<Expense> => {
        const validatedPayload = ExpenseUpdateRequestSchema.parse(data);
        const response = await httpClient.put(`/api/v1/expenses/${id}`, validatedPayload);
        return parseApiResponse(response.data, ExpenseSchema);
    },

    delete: async (id: number): Promise<void> => {
        await httpClient.delete(`/api/v1/expenses/${id}`);
    },
};
