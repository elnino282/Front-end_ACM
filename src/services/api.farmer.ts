import httpClient from "@/shared/api/http";
import { parseApiResponse } from "@/shared/api/types";
import { z } from "zod";
import {
  CostReportSchema,
  ProfitReportSchema,
  RevenueReportSchema,
  YieldReportSchema,
  type CostReport,
  type ProfitReport,
  type RevenueReport,
  type YieldReport,
} from "./api.admin";

export const farmerReportsApi = {
  getYieldReport: async (seasonId: number): Promise<YieldReport[]> => {
    const response = await httpClient.get("/api/v1/farmer/reports/yield", {
      params: { seasonId },
    });
    return parseApiResponse(response.data, z.array(YieldReportSchema));
  },

  getCostReport: async (seasonId: number): Promise<CostReport[]> => {
    const response = await httpClient.get("/api/v1/farmer/reports/cost", {
      params: { seasonId },
    });
    return parseApiResponse(response.data, z.array(CostReportSchema));
  },

  getRevenueReport: async (seasonId: number): Promise<RevenueReport[]> => {
    const response = await httpClient.get("/api/v1/farmer/reports/revenue", {
      params: { seasonId },
    });
    return parseApiResponse(response.data, z.array(RevenueReportSchema));
  },

  getProfitReport: async (seasonId: number): Promise<ProfitReport[]> => {
    const response = await httpClient.get("/api/v1/farmer/reports/profit", {
      params: { seasonId },
    });
    return parseApiResponse(response.data, z.array(ProfitReportSchema));
  },
};
