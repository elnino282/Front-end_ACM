import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { dashboardKeys } from '../model/keys';
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
import { dashboardFdnApi } from './fdn-client';

export function useDashboardFdnOverview(
  params: DashboardFdnOverviewParams = {},
  options?: Omit<UseQueryOptions<DashboardFdnOverview, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.sustainabilityOverview(params),
    queryFn: () => dashboardFdnApi.getOverview(params),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useDashboardFieldMap(
  params: DashboardFieldMapParams = {},
  options?: Omit<UseQueryOptions<DashboardFieldMapResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: dashboardKeys.fieldMap(params),
    queryFn: () => dashboardFdnApi.getFieldMap(params),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useFieldRecommendations(
  fieldId?: number,
  seasonId?: number,
  options?: Omit<
    UseQueryOptions<DashboardFieldRecommendationResponse, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: dashboardKeys.fieldRecommendations(fieldId, seasonId),
    queryFn: () => {
      if (!fieldId) {
        throw new Error('fieldId is required');
      }
      return dashboardFdnApi.getFieldRecommendations(fieldId, seasonId);
    },
    enabled: Boolean(fieldId) && (options?.enabled ?? true),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useFieldMetrics(
  fieldId?: number,
  seasonId?: number,
  options?: Omit<
    UseQueryOptions<DashboardFieldMetricsResponse, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: dashboardKeys.fieldMetrics(fieldId, seasonId),
    queryFn: () => {
      if (!fieldId) {
        throw new Error('fieldId is required');
      }
      return dashboardFdnApi.getFieldMetrics(fieldId, seasonId);
    },
    enabled: Boolean(fieldId) && (options?.enabled ?? true),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useFieldHistory(
  fieldId?: number,
  options?: Omit<
    UseQueryOptions<DashboardFieldHistoryResponse, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: dashboardKeys.fieldHistory(fieldId),
    queryFn: () => {
      if (!fieldId) {
        throw new Error('fieldId is required');
      }
      return dashboardFdnApi.getFieldHistory(fieldId);
    },
    enabled: Boolean(fieldId) && (options?.enabled ?? true),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useDashboardAssistantRecommendations(
  params: DashboardAssistantParams = {},
  options?: Omit<
    UseQueryOptions<DashboardAssistantRecommendations, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: dashboardKeys.assistantRecommendations({
      seasonId: params.seasonId,
      fieldId: params.fieldId,
    }),
    queryFn: () => dashboardFdnApi.getAssistantRecommendations(params),
    staleTime: 60 * 1000,
    ...options,
  });
}
