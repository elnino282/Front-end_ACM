import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from './client';
import { inventoryKeys } from '../model/keys';
import type {
    CreateWarehouseRequest,
    MovementsParams,
    OnHandParams,
    StockMovementRequest,
    UpdateWarehouseRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// WAREHOUSES
// ═══════════════════════════════════════════════════════════════

export function useMyWarehouses(type?: string) {
    return useQuery({
        queryKey: inventoryKeys.warehouses(type),
        queryFn: () => inventoryApi.getMyWarehouses(type),
    });
}

export function useCreateWarehouse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateWarehouseRequest) => inventoryApi.createWarehouse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
        },
    });
}

export function useUpdateWarehouse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateWarehouseRequest }) =>
            inventoryApi.updateWarehouse(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.warehouses() });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.warehouses('INPUT') });
            queryClient.invalidateQueries({ queryKey: inventoryKeys.warehouses('OUTPUT') });
            queryClient.invalidateQueries({
                queryKey: [...inventoryKeys.all, 'warehouse-detail', variables.id],
            });
        },
    });
}

export function useDeleteWarehouse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => inventoryApi.deleteWarehouse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
        },
    });
}

export function useWarehouseById(id?: number) {
    return useQuery({
        queryKey: [...inventoryKeys.all, 'warehouse-detail', id ?? 0],
        queryFn: () => inventoryApi.getWarehouseById(id!),
        enabled: !!id,
    });
}

// ═══════════════════════════════════════════════════════════════
// LOCATIONS
// ═══════════════════════════════════════════════════════════════

export function useLocations(warehouseId: number | undefined) {
    return useQuery({
        queryKey: inventoryKeys.locations(warehouseId ?? 0),
        queryFn: () => inventoryApi.getLocations(warehouseId!),
        enabled: !!warehouseId,
    });
}

// ═══════════════════════════════════════════════════════════════
// ON-HAND LIST
// ═══════════════════════════════════════════════════════════════

export function useOnHandList(params: OnHandParams | undefined) {
    return useQuery({
        queryKey: inventoryKeys.onHand({
            warehouseId: params?.warehouseId ?? 0,
            locationId: params?.locationId ?? undefined,
            lotId: params?.lotId ?? undefined,
            q: params?.q ?? undefined,
            page: params?.page ?? 0,
            size: params?.size ?? 20,
        }),
        queryFn: () => inventoryApi.getOnHandList(params!),
        enabled: !!params?.warehouseId,
    });
}

// ═══════════════════════════════════════════════════════════════
// MOVEMENTS LIST
// ═══════════════════════════════════════════════════════════════

export function useMovements(params: MovementsParams | undefined) {
    return useQuery({
        queryKey: inventoryKeys.movements({
            warehouseId: params?.warehouseId ?? 0,
            type: params?.type ?? undefined,
            from: params?.from ?? undefined,
            to: params?.to ?? undefined,
            page: params?.page ?? 0,
            size: params?.size ?? 20,
        }),
        queryFn: () => inventoryApi.getMovements(params!),
        enabled: !!params?.warehouseId,
    });
}

// ═══════════════════════════════════════════════════════════════
// RECORD MOVEMENT (Mutation)
// ═══════════════════════════════════════════════════════════════

export function useRecordStockMovement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: StockMovementRequest) => inventoryApi.recordMovement(data),
        onSuccess: () => {
            // Invalidate on-hand and movements queries after creating a movement
            queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
        },
    });
}

// ═══════════════════════════════════════════════════════════════
// LOT ON-HAND (Single lot quantity query)
// ═══════════════════════════════════════════════════════════════

export function useLotOnHand(lotId: number | undefined, warehouseId: number | undefined, locationId?: number) {
    return useQuery({
        queryKey: inventoryKeys.lotOnHand(lotId ?? 0, warehouseId ?? 0, locationId),
        queryFn: () => inventoryApi.getOnHand(lotId!, warehouseId!, locationId),
        enabled: !!lotId && !!warehouseId,
    });
}
