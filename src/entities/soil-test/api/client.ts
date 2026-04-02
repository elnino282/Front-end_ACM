import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
  CreateSoilTestRequestSchema,
  SoilTestListQuerySchema,
  SoilTestResponseSchema,
} from '../model/schemas';
import type {
  CreateSoilTestRequest,
  SoilTestListQuery,
  SoilTestResponse,
} from '../model/types';

export const soilTestApi = {
  create: async (seasonId: number, data: CreateSoilTestRequest): Promise<SoilTestResponse> => {
    const payload = CreateSoilTestRequestSchema.parse(data);
    const response = await httpClient.post(`/api/v1/seasons/${seasonId}/soil-tests`, payload);
    return parseApiResponse(response.data, SoilTestResponseSchema);
  },

  listBySeason: async (
    seasonId: number,
    params?: SoilTestListQuery
  ): Promise<SoilTestResponse[]> => {
    const query = params ? SoilTestListQuerySchema.parse(params) : undefined;
    const response = await httpClient.get(`/api/v1/seasons/${seasonId}/soil-tests`, {
      params: query,
    });
    return parseApiResponse(response.data, z.array(SoilTestResponseSchema));
  },
};
