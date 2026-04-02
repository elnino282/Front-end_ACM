import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productWarehouseApi } from "./client";
import { productWarehouseKeys } from "../model/keys";
import type {
  AdjustProductWarehouseLotRequest,
  ProductWarehouseLotsParams,
  ProductWarehouseTransactionsParams,
  StockOutProductWarehouseLotRequest,
} from "../model/types";

export function useProductWarehouseOverview() {
  return useQuery({
    queryKey: productWarehouseKeys.overview(),
    queryFn: () => productWarehouseApi.getOverview(),
  });
}

export function useProductWarehouseLots(params?: ProductWarehouseLotsParams) {
  return useQuery({
    queryKey: productWarehouseKeys.lotList(params),
    queryFn: () => productWarehouseApi.getLots(params),
  });
}

export function useProductWarehouseLotDetail(id?: number) {
  return useQuery({
    queryKey: productWarehouseKeys.lotDetail(id ?? 0),
    queryFn: () => productWarehouseApi.getLotById(id!),
    enabled: !!id,
  });
}

export function useProductWarehouseTransactions(
  params?: ProductWarehouseTransactionsParams,
) {
  return useQuery({
    queryKey: productWarehouseKeys.transactionList(params),
    queryFn: () => productWarehouseApi.getTransactions(params),
  });
}

export function useProductWarehouseTraceability(lotId?: number) {
  return useQuery({
    queryKey: productWarehouseKeys.traceability(lotId ?? 0),
    queryFn: () => productWarehouseApi.getTraceability(lotId!),
    enabled: !!lotId,
  });
}

export function useAdjustProductWarehouseLot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lotId,
      data,
    }: {
      lotId: number;
      data: AdjustProductWarehouseLotRequest;
    }) => productWarehouseApi.adjustLot(lotId, data),
    onSuccess: (_, { lotId }) => {
      queryClient.invalidateQueries({ queryKey: productWarehouseKeys.all });
      queryClient.invalidateQueries({ queryKey: productWarehouseKeys.lotDetail(lotId) });
      queryClient.invalidateQueries({
        queryKey: productWarehouseKeys.traceability(lotId),
      });
    },
  });
}

export function useStockOutProductWarehouseLot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lotId,
      data,
    }: {
      lotId: number;
      data: StockOutProductWarehouseLotRequest;
    }) => productWarehouseApi.stockOutLot(lotId, data),
    onSuccess: (_, { lotId }) => {
      queryClient.invalidateQueries({ queryKey: productWarehouseKeys.all });
      queryClient.invalidateQueries({ queryKey: productWarehouseKeys.lotDetail(lotId) });
      queryClient.invalidateQueries({
        queryKey: productWarehouseKeys.traceability(lotId),
      });
    },
  });
}

