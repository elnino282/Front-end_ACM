import type {
  ProductWarehouseLotsParams,
  ProductWarehouseTransactionsParams,
} from "./types";

export const productWarehouseKeys = {
  all: ["product-warehouse"] as const,
  overview: () => [...productWarehouseKeys.all, "overview"] as const,
  lots: () => [...productWarehouseKeys.all, "lots"] as const,
  lotList: (params?: ProductWarehouseLotsParams) =>
    [...productWarehouseKeys.lots(), "list", params] as const,
  lotDetail: (id: number) => [...productWarehouseKeys.lots(), "detail", id] as const,
  transactions: () => [...productWarehouseKeys.all, "transactions"] as const,
  transactionList: (params?: ProductWarehouseTransactionsParams) =>
    [...productWarehouseKeys.transactions(), "list", params] as const,
  traceability: (lotId: number) =>
    [...productWarehouseKeys.lots(), "traceability", lotId] as const,
};

