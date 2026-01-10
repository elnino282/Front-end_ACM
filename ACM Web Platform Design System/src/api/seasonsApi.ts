import { httpClient } from '../shared/api/httpClient';
import type {
  Season,
  SeasonDetail,
  CreateSeasonRequest,
  CompleteSeasonRequest,
  CancelSeasonRequest,
  SeasonSearchParams,
} from '../types/Season';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

export const seasonsApi = {
  async searchSeasons(params: SeasonSearchParams): Promise<PageResponse<Season>> {
    const response = await httpClient.get<ApiResponse<PageResponse<Season>>>('/api/v1/seasons', {
      params,
    });
    return response.data.result;
  },

  async getSeason(id: number): Promise<SeasonDetail> {
    const response = await httpClient.get<ApiResponse<SeasonDetail>>(`/api/v1/seasons/${id}`);
    return response.data.result;
  },

  async createSeason(data: CreateSeasonRequest): Promise<SeasonDetail> {
    const response = await httpClient.post<ApiResponse<SeasonDetail>>('/api/v1/seasons', data);
    return response.data.result;
  },

  async startSeason(id: number, data?: { actualStartDate?: string }): Promise<Season> {
    const response = await httpClient.post<ApiResponse<Season>>(`/api/v1/seasons/${id}/start`, data);
    return response.data.result;
  },

  async completeSeason(id: number, data: CompleteSeasonRequest): Promise<Season> {
    const response = await httpClient.post<ApiResponse<Season>>(`/api/v1/seasons/${id}/complete`, data);
    return response.data.result;
  },

  async cancelSeason(id: number, data?: CancelSeasonRequest): Promise<Season> {
    const response = await httpClient.post<ApiResponse<Season>>(`/api/v1/seasons/${id}/cancel`, data);
    return response.data.result;
  },
};
