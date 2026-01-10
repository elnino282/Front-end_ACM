import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import type { PageResponse } from '@/shared/api/types';
import { saleKeys } from '../model/keys';
import { saleApi } from './client';
import type {
    SaleListParams,
    Sale,
    SaleCreateRequest,
    SaleUpdateRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// FARMER SALES HOOKS
// ═══════════════════════════════════════════════════════════════

export const useFarmerSales = (
    params?: SaleListParams,
    options?: Omit<UseQueryOptions<PageResponse<Sale>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: saleKeys.farmerList(params),
    queryFn: () => saleApi.listFarmerSales(params),
    staleTime: 5 * 60 * 1000,
    ...options,
});

// Context types for optimistic updates
type CreateSaleContext = {
    previousSales: [readonly unknown[], PageResponse<Sale> | undefined][];
};
type UpdateSaleContext = {
    previousDetail: Sale | undefined;
    previousLists: [readonly unknown[], PageResponse<Sale> | undefined][];
};
type DeleteSaleContext = {
    previousSales: [readonly unknown[], PageResponse<Sale> | undefined][];
};

/**
 * Hook to create a new sale with optimistic updates
 */
export const useCreateSale = (
    options?: Omit<UseMutationOptions<Sale, Error, SaleCreateRequest, CreateSaleContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Sale, Error, SaleCreateRequest, CreateSaleContext>({
        mutationFn: saleApi.create,
        onMutate: async (newSale) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: saleKeys.farmerLists() });

            // Snapshot previous value
            const previousSales = queryClient.getQueriesData<PageResponse<Sale>>({
                queryKey: saleKeys.farmerLists(),
            });

            // Optimistically add new sale to all matching queries
            queryClient.setQueriesData<PageResponse<Sale>>(
                { queryKey: saleKeys.farmerLists() },
                (old) => old ? {
                    ...old,
                    items: [
                        { ...newSale, id: Date.now(), createdAt: new Date().toISOString() } as Sale,
                        ...old.items,
                    ],
                    totalElements: old.totalElements + 1,
                } : old
            );

            return { previousSales };
        },
        onError: (_err, _newSale, context) => {
            // Rollback on error
            if (context?.previousSales) {
                context.previousSales.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            // Always refetch after mutation settles
            queryClient.invalidateQueries({ queryKey: saleKeys.farmerLists() });
        },
        ...options,
    });
};

/**
 * Hook to update a sale with optimistic updates
 */
export const useUpdateSale = (
    options?: Omit<UseMutationOptions<Sale, Error, { id: number; data: SaleUpdateRequest }, UpdateSaleContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Sale, Error, { id: number; data: SaleUpdateRequest }, UpdateSaleContext>({
        mutationFn: ({ id, data }) => saleApi.update(id, data),
        onMutate: async ({ id, data }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: saleKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: saleKeys.farmerLists() });

            // Snapshot previous values
            const previousDetail = queryClient.getQueryData<Sale>(saleKeys.detail(id));
            const previousLists = queryClient.getQueriesData<PageResponse<Sale>>({
                queryKey: saleKeys.farmerLists(),
            });

            // Optimistically update detail
            if (previousDetail) {
                queryClient.setQueryData<Sale>(saleKeys.detail(id), {
                    ...previousDetail,
                    ...data,
                });
            }

            // Optimistically update lists
            queryClient.setQueriesData<PageResponse<Sale>>(
                { queryKey: saleKeys.farmerLists() },
                (old) => old ? {
                    ...old,
                    items: old.items.map((item: Sale) =>
                        item.id === id ? { ...item, ...data } : item
                    ),
                } : old
            );

            return { previousDetail, previousLists };
        },
        onError: (_err, { id }, context) => {
            // Rollback on error
            if (context?.previousDetail) {
                queryClient.setQueryData(saleKeys.detail(id), context.previousDetail);
            }
            if (context?.previousLists) {
                context.previousLists.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: saleKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: saleKeys.farmerLists() });
        },
        ...options,
    });
};

/**
 * Hook to delete a sale with optimistic updates
 */
export const useDeleteSale = (
    options?: Omit<UseMutationOptions<void, Error, number, DeleteSaleContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number, DeleteSaleContext>({
        mutationFn: saleApi.delete,
        onMutate: async (id) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: saleKeys.farmerLists() });

            // Snapshot previous value
            const previousSales = queryClient.getQueriesData<PageResponse<Sale>>({
                queryKey: saleKeys.farmerLists(),
            });

            // Optimistically remove sale from lists
            queryClient.setQueriesData<PageResponse<Sale>>(
                { queryKey: saleKeys.farmerLists() },
                (old) => old ? {
                    ...old,
                    items: old.items.filter((item: Sale) => item.id !== id),
                    totalElements: Math.max(0, old.totalElements - 1),
                } : old
            );

            return { previousSales };
        },
        onError: (_err, _id, context) => {
            // Rollback on error
            if (context?.previousSales) {
                context.previousSales.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: saleKeys.farmerLists() });
        },
        ...options,
    });
};

// ═══════════════════════════════════════════════════════════════
// BUYER SALES HOOKS
// ═══════════════════════════════════════════════════════════════

export const useBuyerSales = (
    params?: SaleListParams,
    options?: Omit<UseQueryOptions<PageResponse<Sale>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: saleKeys.buyerList(params),
    queryFn: () => saleApi.listBuyerSales(params),
    staleTime: 5 * 60 * 1000,
    ...options,
});
