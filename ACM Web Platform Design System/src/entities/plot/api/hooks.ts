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

// ═══════════════════════════════════════════════════════════════
// TYPE-SAFE HELPERS FOR OPTIMISTIC UPDATES
// ═══════════════════════════════════════════════════════════════

/**
 * Union type representing both plot list data structures:
 * - PlotArrayResponse: Array of plots from /api/v1/plots (listAll)
 * - PlotResponse: Paginated response from /api/v1/farms/{farmId}/plots (byFarm)
 */
type PlotListData = PlotArrayResponse | PlotResponse;

/**
 * Type guard to check if the data is a paginated response
 */
const isPaginatedResponse = (data: PlotListData): data is PlotResponse => {
    return data !== null && typeof data === 'object' && 'items' in data && Array.isArray(data.items);
};

/**
 * Helper function to filter a plot from list data (handles both array and paginated responses)
 */
const filterPlotFromListData = (data: PlotListData | undefined, plotId: number): PlotListData | undefined => {
    if (!data) return data;

    // Handle paginated response (from byFarm)
    if (isPaginatedResponse(data)) {
        return {
            ...data,
            items: data.items.filter((item) => item.id !== plotId),
            totalElements: Math.max(0, data.totalElements - 1),
        };
    }

    // Handle array response (from listAll)
    if (Array.isArray(data)) {
        return data.filter((item) => item.id !== plotId);
    }

    return data;
};

/**
 * Helper function to update a plot in list data (handles both array and paginated responses)
 */
const updatePlotInListData = (
    data: PlotListData | undefined,
    plotId: number,
    updateFn: (item: Plot) => Plot
): PlotListData | undefined => {
    if (!data) return data;

    // Handle paginated response (from byFarm)
    if (isPaginatedResponse(data)) {
        return {
            ...data,
            items: data.items.map((item) => (item.id === plotId ? updateFn(item) : item)),
        };
    }

    // Handle array response (from listAll)
    if (Array.isArray(data)) {
        return data.map((item) => (item.id === plotId ? updateFn(item) : item));
    }

    return data;
};

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
    previousLists: [readonly unknown[], PlotListData | undefined][];
};
type DeletePlotContext = {
    previousPlots: [readonly unknown[], PlotListData | undefined][];
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
            const previousLists = queryClient.getQueriesData<PlotListData>({
                queryKey: plotKeys.lists(),
            });

            if (previousDetail) {
                queryClient.setQueryData<Plot>(plotKeys.detail(id), {
                    ...previousDetail,
                    ...data,
                });
            }

            queryClient.setQueriesData<PlotListData>(
                { queryKey: plotKeys.lists() },
                (old) => updatePlotInListData(old, id, (item) => ({ ...item, ...data }))
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

            const previousPlots = queryClient.getQueriesData<PlotListData>({
                queryKey: plotKeys.lists(),
            });

            queryClient.setQueriesData<PlotListData>(
                { queryKey: plotKeys.lists() },
                (old) => filterPlotFromListData(old, id)
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
