import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import type { PageResponse } from '@/shared/api/types';
import { expenseKeys } from '../model/keys';
import { expenseApi } from './client';
import type {
    ExpenseListParams,
    Expense,
    ExpenseCreateRequest,
    ExpenseUpdateRequest,
} from '../model/types';

// Context types for optimistic updates
type CreateExpenseContext = {
    previousExpenses: PageResponse<Expense> | undefined;
};
type UpdateExpenseContext = {
    previousDetail: Expense | undefined;
    previousList: PageResponse<Expense> | undefined;
};
type DeleteExpenseContext = {
    previousExpenses: PageResponse<Expense> | undefined;
};

/**
 * Hook to fetch paginated list of expenses for a season
 */
export const useExpensesBySeason = (
    seasonId: number,
    params?: ExpenseListParams,
    options?: Omit<UseQueryOptions<PageResponse<Expense>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: expenseKeys.listBySeason(seasonId, params),
    queryFn: () => expenseApi.listBySeason(seasonId, params),
    enabled: seasonId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch all farmer expenses across seasons
 * Uses the new /api/v1/expenses endpoint
 */
export const useAllFarmerExpenses = (
    params?: ExpenseListParams & { seasonId?: number; q?: string },
    options?: Omit<UseQueryOptions<PageResponse<Expense>, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: expenseKeys.listAll(params),
    queryFn: () => expenseApi.listAll(params),
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to fetch a single expense by ID
 */
export const useExpenseById = (
    id: number,
    options?: Omit<UseQueryOptions<Expense, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expenseApi.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
});

/**
 * Hook to create a new expense with optimistic updates
 */
export const useCreateExpense = (
    seasonId: number,
    options?: Omit<UseMutationOptions<Expense, Error, ExpenseCreateRequest, CreateExpenseContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Expense, Error, ExpenseCreateRequest, CreateExpenseContext>({
        mutationFn: (data) => expenseApi.create(seasonId, data),
        onMutate: async (newExpense) => {
            const listKey = expenseKeys.listBySeason(seasonId);
            await queryClient.cancelQueries({ queryKey: listKey });

            const previousExpenses = queryClient.getQueryData<PageResponse<Expense>>(listKey);

            if (previousExpenses) {
                queryClient.setQueryData<PageResponse<Expense>>(listKey, {
                    ...previousExpenses,
                    items: [
                        { ...newExpense, id: Date.now(), seasonId, createdAt: new Date().toISOString() } as Expense,
                        ...previousExpenses.items,
                    ],
                    totalElements: previousExpenses.totalElements + 1,
                });
            }

            return { previousExpenses };
        },
        onError: (_err, _newExpense, context) => {
            if (context?.previousExpenses) {
                queryClient.setQueryData(expenseKeys.listBySeason(seasonId), context.previousExpenses);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: expenseKeys.listBySeason(seasonId) });
        },
        ...options,
    });
};

/**
 * Hook to update an expense with optimistic updates
 */
export const useUpdateExpense = (
    seasonId: number,
    options?: Omit<UseMutationOptions<Expense, Error, { id: number; data: ExpenseUpdateRequest }, UpdateExpenseContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<Expense, Error, { id: number; data: ExpenseUpdateRequest }, UpdateExpenseContext>({
        mutationFn: ({ id, data }) => expenseApi.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: expenseKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: expenseKeys.listBySeason(seasonId) });

            const previousDetail = queryClient.getQueryData<Expense>(expenseKeys.detail(id));
            const previousList = queryClient.getQueryData<PageResponse<Expense>>(expenseKeys.listBySeason(seasonId));

            if (previousDetail) {
                queryClient.setQueryData<Expense>(expenseKeys.detail(id), {
                    ...previousDetail,
                    ...data,
                });
            }

            if (previousList) {
                queryClient.setQueryData<PageResponse<Expense>>(expenseKeys.listBySeason(seasonId), {
                    ...previousList,
                    items: previousList.items.map((item) =>
                        item.id === id ? { ...item, ...data } : item
                    ),
                });
            }

            return { previousDetail, previousList };
        },
        onError: (_err, { id }, context) => {
            if (context?.previousDetail) {
                queryClient.setQueryData(expenseKeys.detail(id), context.previousDetail);
            }
            if (context?.previousList) {
                queryClient.setQueryData(expenseKeys.listBySeason(seasonId), context.previousList);
            }
        },
        onSettled: (_, __, { id }) => {
            queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: expenseKeys.listBySeason(seasonId) });
        },
        ...options,
    });
};

/**
 * Hook to delete an expense with optimistic updates
 */
export const useDeleteExpense = (
    seasonId: number,
    options?: Omit<UseMutationOptions<void, Error, number, DeleteExpenseContext>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number, DeleteExpenseContext>({
        mutationFn: expenseApi.delete,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: expenseKeys.listBySeason(seasonId) });

            const previousExpenses = queryClient.getQueryData<PageResponse<Expense>>(expenseKeys.listBySeason(seasonId));

            if (previousExpenses) {
                queryClient.setQueryData<PageResponse<Expense>>(expenseKeys.listBySeason(seasonId), {
                    ...previousExpenses,
                    items: previousExpenses.items.filter((item) => item.id !== id),
                    totalElements: Math.max(0, previousExpenses.totalElements - 1),
                });
            }

            return { previousExpenses };
        },
        onError: (_err, _id, context) => {
            if (context?.previousExpenses) {
                queryClient.setQueryData(expenseKeys.listBySeason(seasonId), context.previousExpenses);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: expenseKeys.listBySeason(seasonId) });
        },
        ...options,
    });
};
