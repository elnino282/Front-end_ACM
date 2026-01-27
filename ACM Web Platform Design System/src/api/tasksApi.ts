import { httpClient } from '../shared/api/httpClient';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  CompleteTaskRequest,
  StartTaskRequest,
  TaskSearchParams,
} from '../types/Task';

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

export const tasksApi = {
  async listTasks(params: TaskSearchParams): Promise<PageResponse<Task>> {
    const response = await httpClient.get<ApiResponse<PageResponse<Task>>>('/api/v1/tasks', {
      params,
    });
    return response.data.result;
  },

  async getTask(id: number): Promise<Task> {
    const response = await httpClient.get<ApiResponse<Task>>(`/api/v1/tasks/${id}`);
    return response.data.result;
  },

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await httpClient.post<ApiResponse<Task>>('/api/v1/tasks', data);
    return response.data.result;
  },

  async startTask(id: number, data?: StartTaskRequest): Promise<Task> {
    const response = await httpClient.post<ApiResponse<Task>>(`/api/v1/tasks/${id}/start`, data);
    return response.data.result;
  },

  async completeTask(id: number, data: CompleteTaskRequest): Promise<Task> {
    const response = await httpClient.post<ApiResponse<Task>>(`/api/v1/tasks/${id}/done`, data);
    return response.data.result;
  },

  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    const response = await httpClient.patch<ApiResponse<Task>>(`/api/v1/tasks/${id}`, data);
    return response.data.result;
  },
};
