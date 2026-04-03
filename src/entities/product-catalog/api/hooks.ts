import { useQuery } from '@tanstack/react-query';
import { productCatalogKeys } from '../model/keys';
import { productCatalogApi } from './client';
import type { ProductListParams } from '../model/types';

/** Hook: list published products (public) */
export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: productCatalogKeys.list(params),
    queryFn: () => productCatalogApi.list(params),
  });
}

/** Hook: get single product by slug (public) */
export function useProductDetail(slug: string | undefined) {
  return useQuery({
    queryKey: productCatalogKeys.detail(slug ?? ''),
    queryFn: () => productCatalogApi.getBySlug(slug!),
    enabled: !!slug,
  });
}

/** Hook: list categories (public) */
export function useCategories() {
  return useQuery({
    queryKey: productCatalogKeys.categories(),
    queryFn: () => productCatalogApi.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
