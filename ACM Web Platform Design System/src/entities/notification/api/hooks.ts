import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { notificationKeys } from '../model/keys';
import { notificationApi } from './client';
import type { Notification } from '../model/types';

export const useFarmerNotifications = (
  options?: Omit<UseQueryOptions<Notification[], Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationApi.list(),
    staleTime: 2 * 60 * 1000,
    ...options,
  });

export const useMarkNotificationRead = (
  options?: UseMutationOptions<Notification, Error, number>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationApi.markRead(id),
    onSuccess: (updated, variables, context) => {
      queryClient.setQueryData(notificationKeys.list(), (old: Notification[] | undefined) => {
        if (!old) return old;
        return old.map((item) => (item.id === updated.id ? updated : item));
      });
      options?.onSuccess?.(updated, variables, context);
    },
    ...options,
  });
};
