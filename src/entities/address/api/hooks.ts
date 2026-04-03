import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressKeys } from '../model/keys';
import { addressApi } from './client';
import type { CreateAddressRequest } from '../model/types';

/** Hook: list buyer's addresses */
export function useBuyerAddresses() {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: () => addressApi.list(),
  });
}

/** Hook: get default address */
export function useDefaultAddress() {
  return useQuery({
    queryKey: [...addressKeys.all, 'default'] as const,
    queryFn: () => addressApi.getDefault(),
  });
}

/** Hook: create a new address */
export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAddressRequest) => addressApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
    },
  });
}
