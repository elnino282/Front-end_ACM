import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
  CreateNutrientInputRequestSchema,
  NutrientInputListQuerySchema,
  NutrientInputResponseSchema,
} from '../model/schemas';
import type {
  CreateNutrientInputRequest,
  NutrientInputListQuery,
  NutrientInputResponse,
} from '../model/types';

export const nutrientInputApi = {
  create: async (
    seasonId: number,
    data: CreateNutrientInputRequest
  ): Promise<NutrientInputResponse> => {
    const payload = CreateNutrientInputRequestSchema.parse(data);
    const response = await httpClient.post(`/api/v1/seasons/${seasonId}/nutrient-inputs`, payload);
    return parseApiResponse(response.data, NutrientInputResponseSchema);
  },

  listBySeason: async (
    seasonId: number,
    params?: NutrientInputListQuery
  ): Promise<NutrientInputResponse[]> => {
    const query = params ? NutrientInputListQuerySchema.parse(params) : undefined;
    const response = await httpClient.get(`/api/v1/seasons/${seasonId}/nutrient-inputs`, {
      params: query,
    });
    return parseApiResponse(response.data, z.array(NutrientInputResponseSchema));
  },
};

