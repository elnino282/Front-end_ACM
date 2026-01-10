import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentApi } from './client';
import { documentKeys } from '../model/keys';
import type { DocumentListParams } from '../model/types';

/**
 * Hook to list documents with pagination, filters, and tab support
 */
export function useDocumentsList(params?: DocumentListParams) {
    return useQuery({
        queryKey: documentKeys.list(params),
        queryFn: () => documentApi.list(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to get single document by ID
 */
export function useDocument(id: number, enabled = true) {
    return useQuery({
        queryKey: documentKeys.detail(id),
        queryFn: () => documentApi.getById(id),
        enabled,
    });
}

/**
 * Hook to record document open (for Recent tab)
 */
export function useRecordDocumentOpen() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => documentApi.recordOpen(id),
        onSuccess: () => {
            // Invalidate recent tab queries
            queryClient.invalidateQueries({ queryKey: documentKeys.list({ tab: 'recent' }) });
        },
    });
}

/**
 * Hook to add document to favorites
 */
export function useAddFavorite() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => documentApi.addFavorite(id),
        onSuccess: () => {
            // Invalidate all document lists to refresh isFavorited status
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

/**
 * Hook to remove document from favorites
 */
export function useRemoveFavorite() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => documentApi.removeFavorite(id),
        onSuccess: () => {
            // Invalidate all document lists to refresh isFavorited status
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}
