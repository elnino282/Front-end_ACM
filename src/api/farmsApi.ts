import { httpClient } from '../shared/api/httpClient';

export interface Farm {
  id: number;
  farmName: string;
  provinceId: number;
  wardId: number;
  area?: number;
  active: boolean;
}

export interface Plot {
  id: number;
  plotName: string;
  farmId: number;
  area?: number;
  soilType?: string;
  status?: string;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

export const farmsApi = {
  async getMyFarms(): Promise<Farm[]> {
    const response = await httpClient.get<ApiResponse<Farm[]>>('/api/v1/farms');
    return response.data.result;
  },

  async getPlotsByFarm(farmId: number): Promise<Plot[]> {
    // Note: This endpoint may need to be added to the backend
    // For now, we can use a placeholder or search all farms
    const response = await httpClient.get<ApiResponse<Plot[]>>(`/api/v1/farms/${farmId}/plots`);
    return response.data.result;
  },
};
