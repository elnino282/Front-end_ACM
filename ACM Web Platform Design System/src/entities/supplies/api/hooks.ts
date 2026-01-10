import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliesApi } from './client';
import { suppliesKeys } from '../model/keys';
import { inventoryKeys } from '@/entities/inventory';
import type { SuppliersParams, SupplyItemsParams, SupplyLotsParams, StockInRequest } from '../model/types';

// ═══════════════════════════════════════════════════════════════
// SUPPLIERS
// ═══════════════════════════════════════════════════════════════

export function useSuppliers(params?: SuppliersParams) {
    return useQuery({
        queryKey: suppliesKeys.suppliers(params),
        queryFn: () => suppliesApi.getSuppliers(params),
    });
}

export function useAllSuppliers() {
    return useQuery({
        queryKey: [...suppliesKeys.all, 'all-suppliers'],
        queryFn: () => suppliesApi.getAllSuppliers(),
    });
}

// ═══════════════════════════════════════════════════════════════
// SUPPLY ITEMS
// ═══════════════════════════════════════════════════════════════

export function useSupplyItems(params?: SupplyItemsParams) {
    return useQuery({
        queryKey: suppliesKeys.items(params),
        queryFn: () => suppliesApi.getSupplyItems(params),
    });
}

export function useAllSupplyItems() {
    return useQuery({
        queryKey: [...suppliesKeys.all, 'all-items'],
        queryFn: () => suppliesApi.getAllSupplyItems(),
    });
}

// ═══════════════════════════════════════════════════════════════
// SUPPLY LOTS
// ═══════════════════════════════════════════════════════════════

export function useSupplyLots(params?: SupplyLotsParams) {
    return useQuery({
        queryKey: suppliesKeys.lots(params),
        queryFn: () => suppliesApi.getSupplyLots(params),
    });
}

// ═══════════════════════════════════════════════════════════════
// STOCK IN (Mutation)
// ═══════════════════════════════════════════════════════════════

export function useStockIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: StockInRequest) => suppliesApi.stockIn(data),
        onSuccess: () => {
            // Invalidate supplies lots and inventory queries
            queryClient.invalidateQueries({ queryKey: suppliesKeys.all });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
        },
    });
}
