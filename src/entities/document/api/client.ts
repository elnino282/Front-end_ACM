import httpClient from "@/shared/api/http";
import { parseApiResponse } from "@/shared/api/types";
import {
  DocumentMetaSchema,
  DocumentPageResponseSchema,
  DocumentSchema,
} from "../model/schemas";
import type {
  Document,
  DocumentListParams,
  DocumentMeta,
  DocumentPageResponse,
} from "../model/types";

export const documentApi = {
  /**
   * List documents with pagination, filters, and tab support (farmer)
   * GET /api/v1/documents?tab=all|favorites|recent&q=&type=&crop=&stage=&topic=&sort=&page=&size=
   */
  list: async (params?: DocumentListParams): Promise<DocumentPageResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.tab) queryParams.append("tab", params.tab);
    if (params?.q) queryParams.append("q", params.q);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.crop) queryParams.append("crop", params.crop);
    if (params?.stage) queryParams.append("stage", params.stage);
    if (params?.topic) queryParams.append("topic", params.topic);
    if (params?.sort) queryParams.append("sort", params.sort);
    if (params?.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params?.size !== undefined)
      queryParams.append("size", params.size.toString());

    const response = await httpClient.get(
      `/api/v1/documents?${queryParams.toString()}`,
    );
    return parseApiResponse(response.data, DocumentPageResponseSchema);
  },

  /**
   * Get document filter metadata (types, stages, topics, crops)
   * GET /api/v1/documents/meta
   */
  getMeta: async (): Promise<DocumentMeta> => {
    const response = await httpClient.get("/api/v1/documents/meta");
    return parseApiResponse(response.data, DocumentMetaSchema);
  },

  /**
   * Get single document by ID
   * GET /api/v1/documents/{id}
   */
  getById: async (id: number): Promise<Document> => {
    const response = await httpClient.get(`/api/v1/documents/${id}`);
    return parseApiResponse(response.data, DocumentSchema);
  },

  /**
   * Record document open (for Recent tab)
   * POST /api/v1/documents/{id}/open
   */
  recordOpen: async (id: number): Promise<void> => {
    await httpClient.post(`/api/v1/documents/${id}/open`);
  },

  /**
   * Add document to favorites
   * POST /api/v1/documents/{id}/favorite
   */
  addFavorite: async (id: number): Promise<void> => {
    await httpClient.post(`/api/v1/documents/${id}/favorite`);
  },

  /**
   * Remove document from favorites
   * DELETE /api/v1/documents/{id}/favorite
   */
  removeFavorite: async (id: number): Promise<void> => {
    await httpClient.delete(`/api/v1/documents/${id}/favorite`);
  },
};
