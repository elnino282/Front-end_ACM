import type { AddressListParams } from './types';

export const addressKeys = {
  all: ['buyer-addresses'] as const,
  lists: () => [...addressKeys.all, 'list'] as const,
  list: (params?: AddressListParams) => [...addressKeys.lists(), params] as const,
  details: () => [...addressKeys.all, 'detail'] as const,
  detail: (id: string) => [...addressKeys.details(), id] as const,
};
