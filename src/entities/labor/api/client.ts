import { TaskSchema } from "@/entities/task";
import httpClient from "@/shared/api/http";
import { parseApiResponse, parsePageResponse, type PageResponse } from "@/shared/api/types";
import { z } from "zod";
import {
  AddSeasonEmployeeRequestSchema,
  AssignTaskEmployeeRequestSchema,
  EmployeeTaskProgressRequestSchema,
  EmployeeDirectorySchema,
  PayrollRecordSchema,
  PayrollRecalculateRequestSchema,
  SeasonEmployeeSchema,
  TaskProgressLogSchema,
  UpdateSeasonEmployeeRequestSchema,
} from "../model/schemas";
import type {
  AddSeasonEmployeeRequest,
  AssignTaskEmployeeRequest,
  EmployeeTaskProgressRequest,
  EmployeeDirectory,
  PayrollRecord,
  PayrollRecalculateRequest,
  SeasonEmployee,
  TaskProgressLog,
  UpdateSeasonEmployeeRequest,
} from "../model/types";
import type { Task } from "@/entities/task";

export const laborApi = {
  listEmployeeDirectory: async (params?: {
    keyword?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<EmployeeDirectory>> => {
    const response = await httpClient.get("/api/v1/farmer/labor/employees/directory", { params });
    return parsePageResponse(response.data, EmployeeDirectorySchema);
  },

  listSeasonEmployees: async (
    seasonId: number,
    params?: { keyword?: string; page?: number; size?: number }
  ): Promise<PageResponse<SeasonEmployee>> => {
    const response = await httpClient.get(`/api/v1/farmer/labor/seasons/${seasonId}/employees`, { params });
    return parsePageResponse(response.data, SeasonEmployeeSchema);
  },

  addSeasonEmployee: async (seasonId: number, data: AddSeasonEmployeeRequest): Promise<SeasonEmployee> => {
    const payload = AddSeasonEmployeeRequestSchema.parse(data);
    const response = await httpClient.post(`/api/v1/farmer/labor/seasons/${seasonId}/employees`, payload);
    return parseApiResponse(response.data, SeasonEmployeeSchema);
  },

  updateSeasonEmployee: async (
    seasonId: number,
    employeeUserId: number,
    data: UpdateSeasonEmployeeRequest
  ): Promise<SeasonEmployee> => {
    const payload = UpdateSeasonEmployeeRequestSchema.parse(data);
    const response = await httpClient.patch(
      `/api/v1/farmer/labor/seasons/${seasonId}/employees/${employeeUserId}`,
      payload
    );
    return parseApiResponse(response.data, SeasonEmployeeSchema);
  },

  removeSeasonEmployee: async (seasonId: number, employeeUserId: number): Promise<void> => {
    await httpClient.delete(`/api/v1/farmer/labor/seasons/${seasonId}/employees/${employeeUserId}`);
  },

  assignTaskToEmployee: async (taskId: number, data: AssignTaskEmployeeRequest): Promise<Task> => {
    const payload = AssignTaskEmployeeRequestSchema.parse(data);
    const response = await httpClient.patch(`/api/v1/farmer/labor/tasks/${taskId}/assign`, payload);
    return parseApiResponse(response.data, TaskSchema);
  },

  listSeasonProgress: async (
    seasonId: number,
    params?: { employeeUserId?: number; taskId?: number; page?: number; size?: number }
  ): Promise<PageResponse<TaskProgressLog>> => {
    const response = await httpClient.get(`/api/v1/farmer/labor/seasons/${seasonId}/progress`, { params });
    return parsePageResponse(response.data, TaskProgressLogSchema);
  },

  listSeasonPayroll: async (
    seasonId: number,
    params?: { employeeUserId?: number; page?: number; size?: number }
  ): Promise<PageResponse<PayrollRecord>> => {
    const response = await httpClient.get(`/api/v1/farmer/labor/seasons/${seasonId}/payroll`, { params });
    return parsePageResponse(response.data, PayrollRecordSchema);
  },

  recalculateSeasonPayroll: async (
    seasonId: number,
    data?: PayrollRecalculateRequest
  ): Promise<PayrollRecord[]> => {
    const payload = data ? PayrollRecalculateRequestSchema.parse(data) : {};
    const response = await httpClient.post(`/api/v1/farmer/labor/seasons/${seasonId}/payroll/recalculate`, payload);
    return parseApiResponse(response.data, z.array(PayrollRecordSchema));
  },

  listMyTasks: async (params?: {
    status?: string;
    seasonId?: number;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Task>> => {
    const response = await httpClient.get("/api/v1/employee/tasks", { params });
    return parsePageResponse(response.data, TaskSchema);
  },

  acceptTask: async (taskId: number): Promise<Task> => {
    const response = await httpClient.patch(`/api/v1/employee/tasks/${taskId}/accept`);
    return parseApiResponse(response.data, TaskSchema);
  },

  reportTaskProgress: async (taskId: number, data: EmployeeTaskProgressRequest): Promise<TaskProgressLog> => {
    const payload = EmployeeTaskProgressRequestSchema.parse(data);
    const response = await httpClient.post(`/api/v1/employee/tasks/${taskId}/progress`, payload);
    return parseApiResponse(response.data, TaskProgressLogSchema);
  },

  listMyProgress: async (params?: { page?: number; size?: number }): Promise<PageResponse<TaskProgressLog>> => {
    const response = await httpClient.get("/api/v1/employee/progress", { params });
    return parsePageResponse(response.data, TaskProgressLogSchema);
  },

  listMyPayroll: async (params?: { seasonId?: number; page?: number; size?: number }): Promise<PageResponse<PayrollRecord>> => {
    const response = await httpClient.get("/api/v1/employee/payroll", { params });
    return parsePageResponse(response.data, PayrollRecordSchema);
  },
};
