import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { dashboardKeys } from '@/entities/dashboard/model/keys';
import { irrigationWaterAnalysisApi } from './client';
import { irrigationWaterAnalysisKeys } from '../model/keys';
import type {
  CreateIrrigationWaterAnalysisRequest,
  IrrigationWaterAnalysisListQuery,
  IrrigationWaterAnalysisResponse,
} from '../model/types';

export const useSeasonIrrigationWaterAnalyses = (
  seasonId: number,
  params?: IrrigationWaterAnalysisListQuery,
  options?: Omit<UseQueryOptions<IrrigationWaterAnalysisResponse[], Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: irrigationWaterAnalysisKeys.listBySeason(seasonId, params),
    queryFn: () => irrigationWaterAnalysisApi.listBySeason(seasonId, params),
    enabled: seasonId > 0,
    staleTime: 60 * 1000,
    ...options,
  });

export const useCreateIrrigationWaterAnalysis = (
  seasonId: number,
  options?: UseMutationOptions<IrrigationWaterAnalysisResponse, Error, CreateIrrigationWaterAnalysisRequest>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useMutation({
    mutationFn: (payload) => irrigationWaterAnalysisApi.create(seasonId, payload),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: irrigationWaterAnalysisKeys.listBySeasonBase(seasonId),
        exact: false,
      });

      queryClient.invalidateQueries({ queryKey: [...dashboardKeys.all, 'sustainability-overview'], exact: false });
      queryClient.invalidateQueries({ queryKey: [...dashboardKeys.all, 'field-map'], exact: false });
      queryClient.invalidateQueries({ queryKey: [...dashboardKeys.all, 'field-metrics'], exact: false });
      queryClient.invalidateQueries({ queryKey: [...dashboardKeys.all, 'field-history'], exact: false });
      queryClient.invalidateQueries({ queryKey: [...dashboardKeys.all, 'field-recommendations'], exact: false });
      queryClient.invalidateQueries({ queryKey: [...dashboardKeys.all, 'assistant-recommendations'], exact: false });

      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
