import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { plotKeys } from '../model/keys';
import { plotApi } from './client';
import { farmKeys } from '@/entities/farm';
import type {
    PlotListParams,
    PlotResponse,
    PlotArrayResponse,
    Plot,
    PlotRequest,
} from '../model/types';

// Context types for optimistic updates
type CreatePlotContext = {
    previousPlots: PlotArrayResponse | undefined;
};
type CreatePlotInFarmContext = {
    previousFarmPlots: [readonly unknown[], PlotResponse | undefined][];
    previousAllPlots: PlotArrayResponse | undefined;
};
type UpdatePlotContext = {
    previousDetail: Plot | undefined;
    previousLists: [readonly unknown[], PlotArrayResponse | undefined][];
};
type DeletePlotContext = {
    previousPlots: [readonly unknown[], PlotArrayResponse | undefined][];
};

// ═══════════════════════════════════════════════════════════════
// PLOT REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Hook to fetch all plots for the current farmer
 */
export const usePlots = (
    options?: Omit<UseQueryOptions<PlotArrayResponse, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: plotKeys.listAll(),
    queryFn: plotApi.listAll,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch plots belonging to a specific farm
 */
export const usePlotsByFarm = (
    farmId: number,
    params?: PlotListParams,
    options?: Omit<UseQueryOptions<PlotResponse, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: plotKeys.byFarm(farmId, params),
    queryFn: () => plotApi.listByFarm(farmId, params),
    enabled: farmId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch a single plot by ID
 */
export const usePlotById = (
    id: number,
    options?: Omit<UseQueryOptions<Plot, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: plotKeys.detail(id),
    queryFn: () => plotApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to create a new plot (farmer-level) with optimistic updates
 */
export const useCreatePlot = (
    options?: Omit<UseMutationOptions<Plot, Error, PlotRequest, CreatePlotContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Plot, Error, PlotRequest, CreatePlotContext>({
        mutationFn: plotApi.create,
        onMutate: async (newPlot) => {
            await queryClient.cancelQueries({ queryKey: plotKeys.listAll() });

            const previousPlots = queryClient.getQueryData<PlotArrayResponse>(plotKeys.listAll());

            if (previousPlots) {
                queryClient.setQueryData<PlotArrayResponse>(
                    plotKeys.listAll(),
                    [
                        { ...newPlot, id: Date.now() } as Plot,
                        ...previousPlots,
                    ]
                );
            }

            return { previousPlots };
        },
        onError: (_err, _newPlot, context) => {
            if (context?.previousPlots) {
                queryClient.setQueryData(plotKeys.listAll(), context.previousPlots);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: plotKeys.listAll() });
        },
        ...options,
    });
};

/**
 * Hook to create a new plot within a specific farm with optimistic updates
 */
export const useCreatePlotInFarm = (
    options?: Omit<UseMutationOptions<Plot, Error, { farmId: number; data: PlotRequest }, CreatePlotInFarmContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Plot, Error, { farmId: number; data: PlotRequest }, CreatePlotInFarmContext>({
        mutationFn: ({ farmId, data }) => plotApi.createInFarm(farmId, data),
        onMutate: async ({ farmId, data }) => {
            await queryClient.cancelQueries({ queryKey: plotKeys.byFarm(farmId) });
            await queryClient.cancelQueries({ queryKey: plotKeys.listAll() });

            const previousFarmPlots = queryClient.getQueriesData<PlotResponse>({
                queryKey: plotKeys.byFarm(farmId),
            });
            const previousAllPlots = queryClient.getQueryData<PlotArrayResponse>(plotKeys.listAll());

            // Optimistically add to farm plots
            const optimisticPlot = { ...data, id: Date.now(), farmId } as Plot;
            previousFarmPlots.forEach(([queryKey, value]) => {
                if (!value) return;
                queryClient.setQueryData<PlotResponse>(queryKey, {
                    ...value,
                    items: [optimisticPlot, ...value.items],
                    totalElements: value.totalElements + 1,
                });
            });

            // Optimistically add to all plots
            if (previousAllPlots) {
                queryClient.setQueryData<PlotArrayResponse>(
                    plotKeys.listAll(),
                    [
                        { ...data, id: Date.now(), farmId } as Plot,
                        ...previousAllPlots,
                    ]
                );
            }

            return { previousFarmPlots, previousAllPlots };
        },
        onError: (_err, { farmId }, context) => {
            if (context?.previousFarmPlots) {
                context.previousFarmPlots.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            if (context?.previousAllPlots) {
                queryClient.setQueryData(plotKeys.listAll(), context.previousAllPlots);
            }
        },
        onSettled: (_, __, { farmId }) => {
            queryClient.invalidateQueries({ queryKey: plotKeys.byFarm(farmId), exact: false });
            queryClient.invalidateQueries({ queryKey: plotKeys.listAll() });
            queryClient.invalidateQueries({ queryKey: farmKeys.detail(farmId) });
        },
        ...options,
    });
};

/**
 * Hook to update an existing plot with optimistic updates
 */
export const useUpdatePlot = (
    options?: Omit<UseMutationOptions<Plot, Error, { id: number; data: PlotRequest }, UpdatePlotContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Plot, Error, { id: number; data: PlotRequest }, UpdatePlotContext>({
        mutationFn: ({ id, data }) => plotApi.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: plotKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: plotKeys.lists() });

            const previousDetail = queryClient.getQueryData<Plot>(plotKeys.detail(id));
            const previousLists = queryClient.getQueriesData<PlotArrayResponse>({
                queryKey: plotKeys.lists(),
            });

            if (previousDetail) {
                queryClient.setQueryData<Plot>(plotKeys.detail(id), {
                    ...previousDetail,
                    ...data,
                });
            }

            queryClient.setQueriesData<PlotArrayResponse>(
                { queryKey: plotKeys.lists() },
                (old) => old?.map((item) =>
                    item.id === id ? { ...item, ...data } : item
                )
            );

            return { previousDetail, previousLists };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousDetail) {
                queryClient.setQueryData(plotKeys.detail(id), context.previousDetail);
            }
            if (context?.previousLists) {
                context.previousLists.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: plotKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: plotKeys.lists() });
        },
        ...options,
    });
};

/**
 * Hook to delete/archive a plot with optimistic updates
 */
export const useDeletePlot = (
    options?: Omit<UseMutationOptions<void, Error, number, DeletePlotContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number, DeletePlotContext>({
        mutationFn: plotApi.delete,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: plotKeys.lists() });

            const previousPlots = queryClient.getQueriesData<PlotArrayResponse>({
                queryKey: plotKeys.lists(),
            });

            queryClient.setQueriesData<PlotArrayResponse>(
                { queryKey: plotKeys.lists() },
                (old) => old?.filter((item) => item.id !== id)
            );

            return { previousPlots };
        },
        onError: (_err, _id, context) => {
            if (context?.previousPlots) {
                context.previousPlots.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: plotKeys.lists() });
        },
        ...options,
    });
};
