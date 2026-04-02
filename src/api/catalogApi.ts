import { httpClient } from '../shared/api/httpClient';

export interface Crop {
  id: number;
  cropName: string;
  description?: string;
}

export interface Variety {
  id: number;
  cropId: number;
  name: string;
  description?: string;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

export const catalogApi = {
  async getCrops(): Promise<Crop[]> {
    const response = await httpClient.get<ApiResponse<Crop[]>>('/api/v1/catalog/crops');
    return response.data.result;
  },

  async getVarietiesByCrop(cropId: number): Promise<Variety[]> {
    const response = await httpClient.get<ApiResponse<Variety[]>>(
      `/api/v1/catalog/crops/${cropId}/varieties`
    );
    return response.data.result;
  },
};
