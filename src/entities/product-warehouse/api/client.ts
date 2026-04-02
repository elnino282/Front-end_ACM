import httpClient from "@/shared/api/http";
import {
  parseApiResponse,
  parsePageResponse,
  type PageResponse,
} from "@/shared/api/types";
import {
  AdjustProductWarehouseLotRequestSchema,
  CreateProductWarehouseLotRequestSchema,
  ProductWarehouseLotSchema,
  ProductWarehouseOverviewSchema,
  ProductWarehouseTraceabilitySchema,
  ProductWarehouseTransactionSchema,
  ProductWarehouseLotsParamsSchema,
  ProductWarehouseTransactionsParamsSchema,
  StockOutProductWarehouseLotRequestSchema,
  UpdateProductWarehouseLotRequestSchema,
} from "../model/schemas";
import type {
  AdjustProductWarehouseLotRequest,
  CreateProductWarehouseLotRequest,
  ProductWarehouseLot,
  ProductWarehouseLotsParams,
  ProductWarehouseOverview,
  ProductWarehouseTraceability,
  ProductWarehouseTransaction,
  ProductWarehouseTransactionsParams,
  StockOutProductWarehouseLotRequest,
  UpdateProductWarehouseLotRequest,
} from "../model/types";

export const productWarehouseApi = {
  getOverview: async (): Promise<ProductWarehouseOverview> => {
    const response = await httpClient.get("/api/v1/product-warehouses/overview");
    return parseApiResponse(response.data, ProductWarehouseOverviewSchema);
  },

  getLots: async (
    params?: ProductWarehouseLotsParams,
  ): Promise<PageResponse<ProductWarehouseLot>> => {
    const validated = params
      ? ProductWarehouseLotsParamsSchema.parse(params)
      : undefined;
    const response = await httpClient.get("/api/v1/product-warehouses/lots", {
      params: validated,
    });
    return parsePageResponse(response.data, ProductWarehouseLotSchema);
  },

  getLotById: async (id: number): Promise<ProductWarehouseLot> => {
    const response = await httpClient.get(`/api/v1/product-warehouses/lots/${id}`);
    return parseApiResponse(response.data, ProductWarehouseLotSchema);
  },

  createLot: async (
    data: CreateProductWarehouseLotRequest,
  ): Promise<ProductWarehouseLot> => {
    const payload = CreateProductWarehouseLotRequestSchema.parse(data);
    const response = await httpClient.post("/api/v1/product-warehouses/lots", payload);
    return parseApiResponse(response.data, ProductWarehouseLotSchema);
  },

  updateLot: async (
    id: number,
    data: UpdateProductWarehouseLotRequest,
  ): Promise<ProductWarehouseLot> => {
    const payload = UpdateProductWarehouseLotRequestSchema.parse(data);
    const response = await httpClient.patch(
      `/api/v1/product-warehouses/lots/${id}`,
      payload,
    );
    return parseApiResponse(response.data, ProductWarehouseLotSchema);
  },

  adjustLot: async (
    id: number,
    data: AdjustProductWarehouseLotRequest,
  ): Promise<ProductWarehouseLot> => {
    const payload = AdjustProductWarehouseLotRequestSchema.parse(data);
    const response = await httpClient.post(
      `/api/v1/product-warehouses/lots/${id}/adjust`,
      payload,
    );
    return parseApiResponse(response.data, ProductWarehouseLotSchema);
  },

  stockOutLot: async (
    id: number,
    data: StockOutProductWarehouseLotRequest,
  ): Promise<ProductWarehouseLot> => {
    const payload = StockOutProductWarehouseLotRequestSchema.parse(data);
    const response = await httpClient.post(
      `/api/v1/product-warehouses/lots/${id}/stock-out`,
      payload,
    );
    return parseApiResponse(response.data, ProductWarehouseLotSchema);
  },

  getTransactions: async (
    params?: ProductWarehouseTransactionsParams,
  ): Promise<PageResponse<ProductWarehouseTransaction>> => {
    const validated = params
      ? ProductWarehouseTransactionsParamsSchema.parse(params)
      : undefined;
    const response = await httpClient.get(
      "/api/v1/product-warehouses/transactions",
      { params: validated },
    );
    return parsePageResponse(response.data, ProductWarehouseTransactionSchema);
  },

  getTraceability: async (lotId: number): Promise<ProductWarehouseTraceability> => {
    const response = await httpClient.get(
      `/api/v1/product-warehouses/lots/${lotId}/traceability`,
    );
    return parseApiResponse(response.data, ProductWarehouseTraceabilitySchema);
  },
};

