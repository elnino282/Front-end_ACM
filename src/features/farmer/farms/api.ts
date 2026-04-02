import httpClient from '@/shared/api/http';
import { Farm, CreateFarmRequest, Plot, CreatePlotRequest, Province, Ward } from './types';
import { ApiResponse } from '@/shared/api/types'; // Assuming standard ApiResponse type exists, otherwise I'll define it locally or use any

// Fallback ApiResponse if not imported correctly
interface ApiResponseData<T> {
    result: T;
    code: number;
    message: string;
}

export const farmApi = {
    getMyFarms: async (): Promise<Farm[]> => {
        const response = await httpClient.get<ApiResponseData<any>>('/api/v1/farms');
        const result = response.data.result;
        if (Array.isArray(result)) {
            return result;
        }
        return result?.items || result?.content || [];
    },

    createFarm: async (data: CreateFarmRequest): Promise<Farm> => {
        const response = await httpClient.post<ApiResponseData<Farm>>('/api/v1/farms', data);
        return response.data.result;
    },

    getFarmDetail: async (farmId: number): Promise<Farm> => {
        const response = await httpClient.get<ApiResponseData<Farm>>(`/api/v1/farms/${farmId}`);
        return response.data.result;
    },

    getPlotsByFarm: async (farmId: number): Promise<Plot[]> => {
        const response = await httpClient.get<ApiResponseData<Plot[]>>(`/api/v1/farms/${farmId}/plots`);
        return response.data.result;
    },

    createPlot: async (farmId: number, data: CreatePlotRequest): Promise<Plot> => {
        const response = await httpClient.post<ApiResponseData<Plot>>(`/api/v1/farms/${farmId}/plots`, data);
        return response.data.result;
    }
};

export const locationApi = {
    getProvinces: async (): Promise<Province[]> => {
        const response = await httpClient.get<Province[]>('/api/v1/locations/provinces');
        return response.data;
    },

    getWards: async (provinceId: number): Promise<Ward[]> => {
        const response = await httpClient.get<Ward[]>(`/api/v1/locations/wards`, {
            params: { provinceId }
        });
        return response.data;
    }
};



