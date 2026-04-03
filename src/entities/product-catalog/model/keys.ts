import type { ProductListParams } from './types';

export const productCatalogKeys = {
  all: ['product-catalog'] as const,
  lists: () => [...productCatalogKeys.all, 'list'] as const,
  list: (params?: ProductListParams) => [...productCatalogKeys.lists(), params] as const,
  details: () => [...productCatalogKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productCatalogKeys.details(), slug] as const,
  categories: () => [...productCatalogKeys.all, 'categories'] as const,
};
