import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderKeys } from '../model/keys';
import { orderApi } from './client';
import type { OrderListParams, CreateOrderRequest } from '../model/types';

/** Hook: list buyer's orders */
export function useBuyerOrders(params?: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderApi.list(params),
  });
}

/** Hook: get order detail by ID */
export function useBuyerOrderDetail(id: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? ''),
    queryFn: () => orderApi.getById(id!),
    enabled: !!id,
  });
}

/** Hook: create a new order */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
