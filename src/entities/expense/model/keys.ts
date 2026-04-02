import type { ExpenseListParams } from './types';

export const expenseKeys = {
    all: ['expense'] as const,
    lists: () => [...expenseKeys.all, 'list'] as const,
    listAll: (params?: ExpenseListParams) =>
        [...expenseKeys.lists(), 'all', params] as const,
    listBySeason: (seasonId: number, params?: ExpenseListParams) =>
        [...expenseKeys.lists(), 'bySeason', seasonId, params] as const,
    details: () => [...expenseKeys.all, 'detail'] as const,
    detail: (id: number) => [...expenseKeys.details(), id] as const,
    tracker: (seasonId: number) => [...expenseKeys.all, 'tracker', seasonId] as const,
    analytics: () => [...expenseKeys.all, 'analytics'] as const,
    analyticsByCategory: (params?: ExpenseListParams) =>
        [...expenseKeys.analytics(), 'byCategory', params] as const,
    analyticsByTask: (params?: ExpenseListParams) =>
        [...expenseKeys.analytics(), 'byTask', params] as const,
    analyticsByVendor: (params?: ExpenseListParams) =>
        [...expenseKeys.analytics(), 'byVendor', params] as const,
    analyticsTimeSeries: (params?: ExpenseListParams & { granularity?: 'DAY' | 'WEEK' | 'MONTH' }) =>
        [...expenseKeys.analytics(), 'timeSeries', params] as const,
};
