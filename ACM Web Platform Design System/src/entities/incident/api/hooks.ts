import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { incidentKeys } from '../model/keys';
import { incidentApi } from './client';
import type {
    Incident,
    IncidentListParams,
    IncidentCreateRequest,
    IncidentUpdateRequest,
    IncidentStatusUpdateRequest,
    IncidentSummary,
} from '../model/types';
import type { PageResponse } from '@/shared/api/types';

// ═══════════════════════════════════════════════════════════════
// QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

export const useIncidents = (
    params: IncidentListParams,
    options?: Omit<UseQueryOptions<PageResponse<Incident>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: incidentKeys.list(params),
    queryFn: () => incidentApi.list(params),
    enabled: params.seasonId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

export const useIncidentById = (
    id: number,
    options?: Omit<UseQueryOptions<Incident, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: () => incidentApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

export const useIncidentSummary = (
    seasonId: number,
    options?: Omit<UseQueryOptions<IncidentSummary, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: incidentKeys.summary(seasonId),
    queryFn: () => incidentApi.getSummary(seasonId),
    enabled: seasonId > 0,
    staleTime: 2 * 60 * 1000,
    ...options,
});

/** @deprecated Use useIncidents with params instead */
export const useIncidentsBySeason = (
    seasonId: number,
    options?: Omit<UseQueryOptions<Incident[], Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: incidentKeys.listBySeason(seasonId),
    queryFn: () => incidentApi.listBySeason(seasonId),
    enabled: seasonId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

// ═══════════════════════════════════════════════════════════════
// MUTATION HOOKS
// ═══════════════════════════════════════════════════════════════

export const useCreateIncident = (
    options?: UseMutationOptions<Incident, Error, IncidentCreateRequest>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => incidentApi.create(data),
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all incident lists for this season
            queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: incidentKeys.summary(variables.seasonId) });
            options?.onSuccess?.(data, variables, context);
        },
    });
};

export const useUpdateIncident = (
    options?: UseMutationOptions<Incident, Error, { id: number; data: IncidentUpdateRequest; seasonId: number }>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => incidentApi.update(id, data),
        ...options,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: incidentKeys.detail(variables.id) });
            options?.onSuccess?.(data, variables, context);
        },
    });
};

export const useUpdateIncidentStatus = (
    options?: UseMutationOptions<Incident, Error, { id: number; data: IncidentStatusUpdateRequest; seasonId: number }>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => incidentApi.updateStatus(id, data),
        ...options,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: incidentKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: incidentKeys.summary(variables.seasonId) });
            options?.onSuccess?.(data, variables, context);
        },
    });
};

export const useDeleteIncident = (
    options?: UseMutationOptions<void, Error, { id: number; seasonId: number }>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id }) => incidentApi.delete(id),
        ...options,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: incidentKeys.summary(variables.seasonId) });
            options?.onSuccess?.(data, variables, context);
        },
    });
};
