import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import {
  DashboardFdnOverviewSchema,
  DashboardFieldHistorySchema,
  DashboardFieldMapResponseSchema,
  DashboardFieldRecommendationSchema,
} from '../model/schemas';
import type {
  DashboardAssistantParams,
  DashboardAssistantRecommendations,
  DashboardFdnOverview,
  DashboardFieldHistoryResponse,
  DashboardFdnOverviewParams,
  DashboardFieldMapParams,
  DashboardFieldMetricsResponse,
  DashboardFieldMapResponse,
  DashboardFieldRecommendationResponse,
} from '../model/fdn';

export const dashboardFdnApi = {
  getOverview: async (
    params: DashboardFdnOverviewParams = {}
  ): Promise<DashboardFdnOverview> => {
    const response = await httpClient.get('/api/v1/dashboard/sustainability/overview', {
      params: {
        scope: params.scope ?? 'field',
        seasonId: params.seasonId,
        fieldId: params.fieldId,
        farmId: params.farmId,
      },
    });
    return parseApiResponse(response.data, DashboardFdnOverviewSchema);
  },

  getFieldMap: async (
    params: DashboardFieldMapParams = {}
  ): Promise<DashboardFieldMapResponse> => {
    const response = await httpClient.get('/api/v1/fields/map', {
      params: {
        seasonId: params.seasonId,
        farmId: params.farmId,
        crop: params.crop,
        alertLevel: params.alertLevel,
      },
    });
    return parseApiResponse(response.data, DashboardFieldMapResponseSchema);
  },

  getFieldMetrics: async (
    fieldId: number,
    seasonId?: number
  ): Promise<DashboardFieldMetricsResponse> => {
    const response = await httpClient.get(`/api/v1/fields/${fieldId}/sustainability-metrics`, {
      params: { seasonId },
    });
    return parseApiResponse(response.data, DashboardFdnOverviewSchema);
  },

  getFieldHistory: async (fieldId: number): Promise<DashboardFieldHistoryResponse> => {
    const response = await httpClient.get(`/api/v1/fields/${fieldId}/fdn-history`);
    return parseApiResponse(response.data, DashboardFieldHistorySchema);
  },

  getFieldRecommendations: async (
    fieldId: number,
    seasonId?: number
  ): Promise<DashboardFieldRecommendationResponse> => {
    const response = await httpClient.get(`/api/v1/fields/${fieldId}/recommendations`, {
      params: { seasonId },
    });
    return parseApiResponse(response.data, DashboardFieldRecommendationSchema);
  },

  getAssistantRecommendations: async (
    params: DashboardAssistantParams = {}
  ): Promise<DashboardAssistantRecommendations> => {
    const overview = await dashboardFdnApi.getOverview({
      scope: 'field',
      seasonId: params.seasonId,
      fieldId: params.fieldId,
    });
    return {
      fdn: {
        total: overview.fdn.total,
        mineral: overview.fdn.mineral,
        level: overview.fdn.level,
      },
      confidence: overview.confidence,
      recommendations: overview.recommendations,
    };
  },
};
