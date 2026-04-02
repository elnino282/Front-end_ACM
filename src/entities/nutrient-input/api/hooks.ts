import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { dashboardKeys } from '@/entities/dashboard/model/keys';
import { nutrientInputApi } from './client';
import { nutrientInputKeys } from '../model/keys';
import type {
  CreateNutrientInputRequest,
  NutrientInputListQuery,
  NutrientInputResponse,
} from '../model/types';

export const useSeasonNutrientInputs = (
  seasonId: number,
  params?: NutrientInputListQuery,
  options?: Omit<UseQueryOptions<NutrientInputResponse[], Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: nutrientInputKeys.listBySeason(seasonId, params),
    queryFn: () => nutrientInputApi.listBySeason(seasonId, params),
    enabled: seasonId > 0,
    staleTime: 60 * 1000,
    ...options,
  });

export const useCreateNutrientInput = (
  seasonId: number,
  options?: UseMutationOptions<NutrientInputResponse, Error, CreateNutrientInputRequest>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};

  return useMutation({
    mutationFn: (payload) => nutrientInputApi.create(seasonId, payload),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: nutrientInputKeys.listBySeasonBase(seasonId),
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: [...dashboardKeys.all, 'sustainability-overview'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [...dashboardKeys.all, 'field-map'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [...dashboardKeys.all, 'field-metrics'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [...dashboardKeys.all, 'field-history'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [...dashboardKeys.all, 'field-recommendations'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [...dashboardKeys.all, 'assistant-recommendations'],
        exact: false,
      });

      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
