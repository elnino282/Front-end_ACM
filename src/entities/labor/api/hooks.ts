import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { taskKeys } from "@/entities/task";
import type { PageResponse } from "@/shared/api/types";
import { laborKeys } from "../model/keys";
import { laborApi } from "./client";
import type {
  AddSeasonEmployeeRequest,
  EmployeeDirectory,
  EmployeeTaskProgressRequest,
  PayrollRecord,
  PayrollRecalculateRequest,
  SeasonEmployee,
  TaskProgressLog,
} from "../model/types";
import type { Task } from "@/entities/task";

export const useEmployeeDirectory = (
  params?: { keyword?: string; page?: number; size?: number },
  options?: Omit<UseQueryOptions<PageResponse<EmployeeDirectory>, Error>, "queryKey" | "queryFn">
) =>
  useQuery({
    queryKey: laborKeys.employeeDirectory(params),
    queryFn: () => laborApi.listEmployeeDirectory(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useSeasonEmployees = (
  seasonId: number,
  params?: { keyword?: string; page?: number; size?: number },
  options?: Omit<UseQueryOptions<PageResponse<SeasonEmployee>, Error>, "queryKey" | "queryFn">
) =>
  useQuery({
    queryKey: laborKeys.seasonEmployees(seasonId, params),
    queryFn: () => laborApi.listSeasonEmployees(seasonId, params),
    enabled: seasonId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useSeasonProgressLogs = (
  seasonId: number,
  params?: { employeeUserId?: number; taskId?: number; page?: number; size?: number },
  options?: Omit<UseQueryOptions<PageResponse<TaskProgressLog>, Error>, "queryKey" | "queryFn">
) =>
  useQuery({
    queryKey: laborKeys.seasonProgress(seasonId, params),
    queryFn: () => laborApi.listSeasonProgress(seasonId, params),
    enabled: seasonId > 0,
    staleTime: 60 * 1000,
    ...options,
  });

export const useSeasonPayrollRecords = (
  seasonId: number,
  params?: { employeeUserId?: number; page?: number; size?: number },
  options?: Omit<UseQueryOptions<PageResponse<PayrollRecord>, Error>, "queryKey" | "queryFn">
) =>
  useQuery({
    queryKey: laborKeys.seasonPayroll(seasonId, params),
    queryFn: () => laborApi.listSeasonPayroll(seasonId, params),
    enabled: seasonId > 0,
    staleTime: 60 * 1000,
    ...options,
  });

export const useEmployeeTasks = (
  params?: { status?: string; seasonId?: number; page?: number; size?: number },
  options?: Omit<UseQueryOptions<PageResponse<Task>, Error>, "queryKey" | "queryFn">
) =>
  useQuery({
    queryKey: laborKeys.employeeTasks(params),
    queryFn: () => laborApi.listMyTasks(params),
    staleTime: 60 * 1000,
    ...options,
  });

export const useEmployeeProgressLogs = (
  params?: { page?: number; size?: number },
  options?: Omit<UseQueryOptions<PageResponse<TaskProgressLog>, Error>, "queryKey" | "queryFn">
) =>
  useQuery({
    queryKey: laborKeys.employeeProgress(params),
    queryFn: () => laborApi.listMyProgress(params),
    staleTime: 60 * 1000,
    ...options,
  });

export const useEmployeePayrollRecords = (
  params?: { seasonId?: number; page?: number; size?: number },
  options?: Omit<UseQueryOptions<PageResponse<PayrollRecord>, Error>, "queryKey" | "queryFn">
) =>
  useQuery({
    queryKey: laborKeys.employeePayroll(params),
    queryFn: () => laborApi.listMyPayroll(params),
    staleTime: 60 * 1000,
    ...options,
  });

export const useAddSeasonEmployee = (
  seasonId: number,
  options?: UseMutationOptions<SeasonEmployee, Error, AddSeasonEmployeeRequest>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: (data: AddSeasonEmployeeRequest) => laborApi.addSeasonEmployee(seasonId, data),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: laborKeys.seasonEmployeesBase(seasonId), exact: false });
      queryClient.invalidateQueries({ queryKey: laborKeys.seasonPayrollBase(seasonId), exact: false });
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useUpdateSeasonEmployee = (
  seasonId: number,
  options?: UseMutationOptions<
    SeasonEmployee,
    Error,
    { employeeUserId: number; data: { wagePerTask?: number; active?: boolean } }
  >
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: ({ employeeUserId, data }) =>
      laborApi.updateSeasonEmployee(seasonId, employeeUserId, data),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: laborKeys.seasonEmployeesBase(seasonId), exact: false });
      queryClient.invalidateQueries({ queryKey: laborKeys.seasonPayrollBase(seasonId), exact: false });
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useRemoveSeasonEmployee = (
  seasonId: number,
  options?: UseMutationOptions<void, Error, number>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: (employeeUserId: number) => laborApi.removeSeasonEmployee(seasonId, employeeUserId),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: laborKeys.seasonEmployeesBase(seasonId), exact: false });
      queryClient.invalidateQueries({ queryKey: laborKeys.seasonPayrollBase(seasonId), exact: false });
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useAssignTaskToEmployee = (
  seasonId: number,
  options?: UseMutationOptions<Task, Error, { taskId: number; employeeUserId: number }>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: ({ taskId, employeeUserId }) =>
      laborApi.assignTaskToEmployee(taskId, { employeeUserId }),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.listBySeason(seasonId), exact: false });
      queryClient.invalidateQueries({ queryKey: laborKeys.seasonProgressBase(seasonId), exact: false });
      queryClient.invalidateQueries({ queryKey: laborKeys.seasonPayrollBase(seasonId), exact: false });
      queryClient.invalidateQueries({ queryKey: laborKeys.employeeTasksBase(), exact: false });
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useRecalculateSeasonPayroll = (
  seasonId: number,
  options?: UseMutationOptions<PayrollRecord[], Error, PayrollRecalculateRequest | undefined>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: (payload) => laborApi.recalculateSeasonPayroll(seasonId, payload),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: laborKeys.seasonPayrollBase(seasonId), exact: false });
      queryClient.invalidateQueries({ queryKey: laborKeys.employeePayrollBase(), exact: false });
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useEmployeeAcceptTask = (
  options?: UseMutationOptions<Task, Error, number>
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: (taskId: number) => laborApi.acceptTask(taskId),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: laborKeys.employeeTasksBase(), exact: false });
      if (data.seasonId) {
        queryClient.invalidateQueries({ queryKey: laborKeys.seasonProgressBase(data.seasonId), exact: false });
      }
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};

export const useEmployeeReportTaskProgress = (
  options?: UseMutationOptions<
    TaskProgressLog,
    Error,
    { taskId: number; data: EmployeeTaskProgressRequest }
  >
) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...mutationOptions } = options ?? {};
  return useMutation({
    mutationFn: ({ taskId, data }) => laborApi.reportTaskProgress(taskId, data),
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: laborKeys.employeeTasksBase(), exact: false });
      queryClient.invalidateQueries({ queryKey: laborKeys.employeeProgressBase(), exact: false });
      queryClient.invalidateQueries({ queryKey: laborKeys.employeePayrollBase(), exact: false });
      if (data.seasonId) {
        queryClient.invalidateQueries({ queryKey: laborKeys.seasonProgressBase(data.seasonId), exact: false });
        queryClient.invalidateQueries({ queryKey: laborKeys.seasonPayrollBase(data.seasonId), exact: false });
      }
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
