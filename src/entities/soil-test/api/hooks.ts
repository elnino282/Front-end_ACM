import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { dashboardKeys } from '@/entities/dashboard/model/keys';
import { soilTestApi } from './client';
import { soilTestKeys } from '../model/keys';
import type {
  CreateSoilTestRequest,
  SoilTestListQuery,
  SoilTestResponse,
} from '../model/types';

export const useSeasonSoilTests = (
  seasonId: number,
  params?: SoilTestListQuery,
  options?: Omit<UseQueryOptions<SoilTestResponse[], Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: soilTestKeys.listBySeason(seasonId, params),
    queryFn: () => soilTestApi.listBySeason(seasonId, params),
    enabled: seasonId > 0,
    staleTime: 60 * 1000,
    ...options,
  });

export const useCreateSoilTest = (
  seasonId: number,
  options?: UseMutationOptions<SoilTestResponse, Error, CreateSoilTestRequest>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useMutation({
    mutationFn: (payload) => soilTestApi.create(seasonId, payload),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: soilTestKeys.listBySeasonBase(seasonId),
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
