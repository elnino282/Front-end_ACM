import type { IncidentListParams } from './types';

export const incidentKeys = {
    all: ['incident'] as const,
    lists: () => [...incidentKeys.all, 'list'] as const,
    list: (params: IncidentListParams) => [...incidentKeys.lists(), params] as const,
    listBySeason: (seasonId: number) => [...incidentKeys.lists(), 'bySeason', seasonId] as const,
    details: () => [...incidentKeys.all, 'detail'] as const,
    detail: (id: number) => [...incidentKeys.details(), id] as const,
    summaries: () => [...incidentKeys.all, 'summary'] as const,
    summary: (seasonId: number) => [...incidentKeys.summaries(), seasonId] as const,
};
