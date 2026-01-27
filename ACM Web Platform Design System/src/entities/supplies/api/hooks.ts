import { inventoryKeys } from "@/entities/inventory";
import type { PageResponse } from "@/shared/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { suppliesKeys } from "../model/keys";
import type {
  CreateSupplierRequest,
  StockInRequest,
  StockInResponse,
  Supplier,
  SuppliersParams,
  SupplyItemsParams,
  SupplyLotsParams,
  UpdateSupplierRequest,
} from "../model/types";
import { suppliesApi } from "./client";

// ═══════════════════════════════════════════════════════════════
// Context types for optimistic updates
// ═══════════════════════════════════════════════════════════════
type CreateSupplierContext = {
  previousSuppliers: PageResponse<Supplier> | undefined;
  previousAllSuppliers: Supplier[] | undefined;
};

type UpdateSupplierContext = {
  previousSuppliers: PageResponse<Supplier> | undefined;
  previousAllSuppliers: Supplier[] | undefined;
};

type DeleteSupplierContext = {
  previousSuppliers: PageResponse<Supplier> | undefined;
  previousAllSuppliers: Supplier[] | undefined;
};

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
    queryKey: [...suppliesKeys.all, "all-suppliers"],
    queryFn: () => suppliesApi.getAllSuppliers(),
  });
}

/**
 * Create supplier with optimistic update
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation<
    Supplier,
    Error,
    CreateSupplierRequest,
    CreateSupplierContext
  >({
    mutationFn: (data) => suppliesApi.createSupplier(data),
    onMutate: async (newSupplier) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: suppliesKeys.all });

      // Snapshot previous values
      const previousSuppliers = queryClient.getQueryData<
        PageResponse<Supplier>
      >(suppliesKeys.suppliers());
      const previousAllSuppliers = queryClient.getQueryData<Supplier[]>([
        ...suppliesKeys.all,
        "all-suppliers",
      ]);

      // Optimistic update - add new supplier with temp ID
      if (previousSuppliers) {
        queryClient.setQueryData<PageResponse<Supplier>>(
          suppliesKeys.suppliers(),
          {
            ...previousSuppliers,
            items: [
              { id: Date.now(), ...newSupplier } as Supplier,
              ...previousSuppliers.items,
            ],
            totalElements: previousSuppliers.totalElements + 1,
          },
        );
      }

      if (previousAllSuppliers) {
        queryClient.setQueryData<Supplier[]>(
          [...suppliesKeys.all, "all-suppliers"],
          [
            { id: Date.now(), ...newSupplier } as Supplier,
            ...previousAllSuppliers,
          ],
        );
      }

      return { previousSuppliers, previousAllSuppliers };
    },
    onError: (_err, _newSupplier, context) => {
      // Rollback on error
      if (context?.previousSuppliers) {
        queryClient.setQueryData(
          suppliesKeys.suppliers(),
          context.previousSuppliers,
        );
      }
      if (context?.previousAllSuppliers) {
        queryClient.setQueryData(
          [...suppliesKeys.all, "all-suppliers"],
          context.previousAllSuppliers,
        );
      }
    },
    onSettled: () => {
      // Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: suppliesKeys.all });
    },
  });
}

/**
 * Update supplier with optimistic update
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation<
    Supplier,
    Error,
    { id: number; data: UpdateSupplierRequest },
    UpdateSupplierContext
  >({
    mutationFn: ({ id, data }) => suppliesApi.updateSupplier(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: suppliesKeys.all });

      const previousSuppliers = queryClient.getQueryData<
        PageResponse<Supplier>
      >(suppliesKeys.suppliers());
      const previousAllSuppliers = queryClient.getQueryData<Supplier[]>([
        ...suppliesKeys.all,
        "all-suppliers",
      ]);

      // Optimistic update in paginated list
      if (previousSuppliers) {
        queryClient.setQueryData<PageResponse<Supplier>>(
          suppliesKeys.suppliers(),
          {
            ...previousSuppliers,
            items: previousSuppliers.items.map((supplier) =>
              supplier.id === id ? { ...supplier, ...data } : supplier,
            ),
          },
        );
      }

      // Optimistic update in all suppliers list
      if (previousAllSuppliers) {
        queryClient.setQueryData<Supplier[]>(
          [...suppliesKeys.all, "all-suppliers"],
          previousAllSuppliers.map((supplier) =>
            supplier.id === id ? { ...supplier, ...data } : supplier,
          ),
        );
      }

      return { previousSuppliers, previousAllSuppliers };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSuppliers) {
        queryClient.setQueryData(
          suppliesKeys.suppliers(),
          context.previousSuppliers,
        );
      }
      if (context?.previousAllSuppliers) {
        queryClient.setQueryData(
          [...suppliesKeys.all, "all-suppliers"],
          context.previousAllSuppliers,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: suppliesKeys.all });
    },
  });
}

/**
 * Delete supplier with optimistic update
 */
export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number, DeleteSupplierContext>({
    mutationFn: (id) => suppliesApi.deleteSupplier(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: suppliesKeys.all });

      const previousSuppliers = queryClient.getQueryData<
        PageResponse<Supplier>
      >(suppliesKeys.suppliers());
      const previousAllSuppliers = queryClient.getQueryData<Supplier[]>([
        ...suppliesKeys.all,
        "all-suppliers",
      ]);

      // Optimistic remove from paginated list
      if (previousSuppliers) {
        queryClient.setQueryData<PageResponse<Supplier>>(
          suppliesKeys.suppliers(),
          {
            ...previousSuppliers,
            items: previousSuppliers.items.filter(
              (supplier) => supplier.id !== id,
            ),
            totalElements: Math.max(0, previousSuppliers.totalElements - 1),
          },
        );
      }

      // Optimistic remove from all suppliers list
      if (previousAllSuppliers) {
        queryClient.setQueryData<Supplier[]>(
          [...suppliesKeys.all, "all-suppliers"],
          previousAllSuppliers.filter((supplier) => supplier.id !== id),
        );
      }

      return { previousSuppliers, previousAllSuppliers };
    },
    onError: (_err, _id, context) => {
      if (context?.previousSuppliers) {
        queryClient.setQueryData(
          suppliesKeys.suppliers(),
          context.previousSuppliers,
        );
      }
      if (context?.previousAllSuppliers) {
        queryClient.setQueryData(
          [...suppliesKeys.all, "all-suppliers"],
          context.previousAllSuppliers,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: suppliesKeys.all });
    },
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
    queryKey: [...suppliesKeys.all, "all-items"],
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

/**
 * Stock in with invalidation (no optimistic update needed - creates new records)
 */
export function useStockIn() {
  const queryClient = useQueryClient();

  return useMutation<StockInResponse, Error, StockInRequest>({
    mutationFn: (data) => suppliesApi.stockIn(data),
    onSuccess: () => {
      // Invalidate supplies lots and inventory queries
      queryClient.invalidateQueries({ queryKey: suppliesKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
