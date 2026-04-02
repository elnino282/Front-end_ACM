import {
    useQuery,
    type UseQueryOptions,
} from '@tanstack/react-query';
import type { PageResponse } from '@/shared/api/types';
import { reportKeys } from '../model/keys';
import { reportApi } from './client';
import type {
    ReportListParams,
    Report,
    ReportDetail,
} from '../model/types';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// READ HOOKS (Buyer)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const useReports = (
    params?: ReportListParams,
    options?: Omit<UseQueryOptions<PageResponse<Report>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: reportKeys.list(params),
    queryFn: () => reportApi.list(params),
    staleTime: 5 * 60 * 1000,
    ...options,
});

export const useReportById = (
    id: number,
    options?: Omit<UseQueryOptions<ReportDetail, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: reportKeys.detail(id),
    queryFn: () => reportApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

