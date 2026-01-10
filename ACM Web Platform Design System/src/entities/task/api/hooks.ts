import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import type { PageResponse } from '@/shared/api/types';
import { taskKeys } from '../model/keys';
import { taskApi } from './client';
import type {
    TaskListParams,
    Task,
    TaskCreateRequest,
    TaskUpdateRequest,
    TaskStatusUpdateRequest,
} from '../model/types';

// Context types for optimistic updates
type CreateTaskContext = {
    previousTasks: PageResponse<Task> | undefined;
};
type UpdateTaskContext = {
    previousDetail: Task | undefined;
    previousList: PageResponse<Task> | undefined;
    previousWorkspaceList?: PageResponse<Task> | undefined;
};
type DeleteTaskContext = {
    previousTasks: PageResponse<Task> | undefined;
    previousWorkspaceTasks?: PageResponse<Task> | undefined;
};

// ═══════════════════════════════════════════════════════════════
// TASK REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to fetch paginated list of tasks for a season
 */
export const useTasksBySeason = (
    seasonId: number,
    params?: TaskListParams,
    options?: Omit<UseQueryOptions<PageResponse<Task>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: taskKeys.listBySeason(seasonId, params),
    queryFn: () => taskApi.listBySeason(seasonId, params),
    enabled: seasonId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch paginated list of tasks for workspace (user-scoped)
 */
export const useTasksWorkspace = (
    params?: TaskListParams,
    options?: Omit<UseQueryOptions<PageResponse<Task>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: taskKeys.listWorkspace(params),
    queryFn: () => taskApi.listWorkspace(params),
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch a single task by ID
 */
export const useTaskById = (
    id: number,
    options?: Omit<UseQueryOptions<Task, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to create a new task with optimistic updates
 */
export const useCreateTask = (
    seasonId: number,
    options?: Omit<UseMutationOptions<Task, Error, TaskCreateRequest, CreateTaskContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Task, Error, TaskCreateRequest, CreateTaskContext>({
        mutationFn: (data) => taskApi.create(seasonId, data),
        onMutate: async (newTask) => {
            const listKey = taskKeys.listBySeason(seasonId);
            await queryClient.cancelQueries({ queryKey: listKey });

            const previousTasks = queryClient.getQueryData<PageResponse<Task>>(listKey);

            if (previousTasks) {
                queryClient.setQueryData<PageResponse<Task>>(listKey, {
                    ...previousTasks,
                    items: [
                        {
                            ...newTask,
                            taskId: Date.now(),
                            seasonId,
                            status: 'PENDING',
                            createdAt: new Date().toISOString(),
                        } as Task,
                        ...previousTasks.items,
                    ],
                    totalElements: previousTasks.totalElements + 1,
                });
            }

            return { previousTasks };
        },
        onError: (_err, _newTask, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(taskKeys.listBySeason(seasonId), context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.listBySeason(seasonId) });
            queryClient.invalidateQueries({ queryKey: taskKeys.listWorkspace() });
        },
        ...options,
    });
};

/**
 * Hook to update an existing task with optimistic updates
 */
export const useUpdateTask = (
    seasonId: number,
    options?: Omit<UseMutationOptions<Task, Error, { id: number; data: TaskUpdateRequest }, UpdateTaskContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Task, Error, { id: number; data: TaskUpdateRequest }, UpdateTaskContext>({
        mutationFn: ({ id, data }) => taskApi.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: taskKeys.listBySeason(seasonId) });
            await queryClient.cancelQueries({ queryKey: taskKeys.listWorkspace() });

            const previousDetail = queryClient.getQueryData<Task>(taskKeys.detail(id));
            const previousList = queryClient.getQueryData<PageResponse<Task>>(taskKeys.listBySeason(seasonId));
            const previousWorkspaceList = queryClient.getQueryData<PageResponse<Task>>(taskKeys.listWorkspace());

            if (previousDetail) {
                queryClient.setQueryData<Task>(taskKeys.detail(id), {
                    ...previousDetail,
                    ...data,
                });
            }

            if (previousList) {
                queryClient.setQueryData<PageResponse<Task>>(taskKeys.listBySeason(seasonId), {
                    ...previousList,
                    items: previousList.items.map((item) =>
                        item.taskId === id ? { ...item, ...data } : item
                    ),
                });
            }

            if (previousWorkspaceList) {
                queryClient.setQueryData<PageResponse<Task>>(taskKeys.listWorkspace(), {
                    ...previousWorkspaceList,
                    items: previousWorkspaceList.items.map((item) =>
                        item.taskId === id ? { ...item, ...data } : item
                    ),
                });
            }

            return { previousDetail, previousList, previousWorkspaceList };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousDetail) {
                queryClient.setQueryData(taskKeys.detail(id), context.previousDetail);
            }
            if (context?.previousList) {
                queryClient.setQueryData(taskKeys.listBySeason(seasonId), context.previousList);
            }
            if (context?.previousWorkspaceList) {
                queryClient.setQueryData(taskKeys.listWorkspace(), context.previousWorkspaceList);
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: taskKeys.listBySeason(seasonId) });
            queryClient.invalidateQueries({ queryKey: taskKeys.listWorkspace() });
        },
        ...options,
    });
};

/**
 * Hook to update task status with optimistic updates
 */
export const useUpdateTaskStatus = (
    seasonId: number,
    options?: Omit<UseMutationOptions<Task, Error, { id: number; data: TaskStatusUpdateRequest }, UpdateTaskContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Task, Error, { id: number; data: TaskStatusUpdateRequest }, UpdateTaskContext>({
        mutationFn: ({ id, data }) => taskApi.updateStatus(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: taskKeys.listBySeason(seasonId) });
            await queryClient.cancelQueries({ queryKey: taskKeys.listWorkspace() });

            const previousDetail = queryClient.getQueryData<Task>(taskKeys.detail(id));
            const previousList = queryClient.getQueryData<PageResponse<Task>>(taskKeys.listBySeason(seasonId));
            const previousWorkspaceList = queryClient.getQueryData<PageResponse<Task>>(taskKeys.listWorkspace());

            if (previousDetail) {
                queryClient.setQueryData<Task>(taskKeys.detail(id), {
                    ...previousDetail,
                    status: data.status,
                });
            }

            if (previousList) {
                queryClient.setQueryData<PageResponse<Task>>(taskKeys.listBySeason(seasonId), {
                    ...previousList,
                    items: previousList.items.map((item) =>
                        item.taskId === id ? { ...item, status: data.status } : item
                    ),
                });
            }

            if (previousWorkspaceList) {
                queryClient.setQueryData<PageResponse<Task>>(taskKeys.listWorkspace(), {
                    ...previousWorkspaceList,
                    items: previousWorkspaceList.items.map((item) =>
                        item.taskId === id ? { ...item, status: data.status } : item
                    ),
                });
            }

            return { previousDetail, previousList, previousWorkspaceList };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousDetail) {
                queryClient.setQueryData(taskKeys.detail(id), context.previousDetail);
            }
            if (context?.previousList) {
                queryClient.setQueryData(taskKeys.listBySeason(seasonId), context.previousList);
            }
            if (context?.previousWorkspaceList) {
                queryClient.setQueryData(taskKeys.listWorkspace(), context.previousWorkspaceList);
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: taskKeys.listBySeason(seasonId) });
            queryClient.invalidateQueries({ queryKey: taskKeys.listWorkspace() });
        },
        ...options,
    });
};

/**
 * Hook to delete a task with optimistic updates
 */
export const useDeleteTask = (
    seasonId: number,
    options?: Omit<UseMutationOptions<void, Error, number, DeleteTaskContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number, DeleteTaskContext>({
        mutationFn: taskApi.delete,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.listBySeason(seasonId) });
            await queryClient.cancelQueries({ queryKey: taskKeys.listWorkspace() });

            const previousTasks = queryClient.getQueryData<PageResponse<Task>>(taskKeys.listBySeason(seasonId));
            const previousWorkspaceTasks = queryClient.getQueryData<PageResponse<Task>>(taskKeys.listWorkspace());

            if (previousTasks) {
                queryClient.setQueryData<PageResponse<Task>>(taskKeys.listBySeason(seasonId), {
                    ...previousTasks,
                    items: previousTasks.items.filter((item) => item.taskId !== id),
                    totalElements: Math.max(0, previousTasks.totalElements - 1),
                });
            }

            if (previousWorkspaceTasks) {
                queryClient.setQueryData<PageResponse<Task>>(taskKeys.listWorkspace(), {
                    ...previousWorkspaceTasks,
                    items: previousWorkspaceTasks.items.filter((item) => item.taskId !== id),
                    totalElements: Math.max(0, previousWorkspaceTasks.totalElements - 1),
                });
            }

            return { previousTasks, previousWorkspaceTasks };
        },
        onError: (_err, _id, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(taskKeys.listBySeason(seasonId), context.previousTasks);
            }
            if (context?.previousWorkspaceTasks) {
                queryClient.setQueryData(taskKeys.listWorkspace(), context.previousWorkspaceTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.listBySeason(seasonId) });
            queryClient.invalidateQueries({ queryKey: taskKeys.listWorkspace() });
        },
        ...options,
    });
};
