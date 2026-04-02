import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
  CreateIrrigationWaterAnalysisRequestSchema,
  IrrigationWaterAnalysisListQuerySchema,
  IrrigationWaterAnalysisResponseSchema,
} from '../model/schemas';
import type {
  CreateIrrigationWaterAnalysisRequest,
  IrrigationWaterAnalysisListQuery,
  IrrigationWaterAnalysisResponse,
} from '../model/types';

export const irrigationWaterAnalysisApi = {
  create: async (
    seasonId: number,
    data: CreateIrrigationWaterAnalysisRequest
  ): Promise<IrrigationWaterAnalysisResponse> => {
    const payload = CreateIrrigationWaterAnalysisRequestSchema.parse(data);
    const response = await httpClient.post(
      `/api/v1/seasons/${seasonId}/irrigation-water-analyses`,
      payload
    );
    return parseApiResponse(response.data, IrrigationWaterAnalysisResponseSchema);
  },

  listBySeason: async (
    seasonId: number,
    params?: IrrigationWaterAnalysisListQuery
  ): Promise<IrrigationWaterAnalysisResponse[]> => {
    const query = params ? IrrigationWaterAnalysisListQuerySchema.parse(params) : undefined;
    const response = await httpClient.get(`/api/v1/seasons/${seasonId}/irrigation-water-analyses`, {
      params: query,
    });
    return parseApiResponse(response.data, z.array(IrrigationWaterAnalysisResponseSchema));
  },
};
