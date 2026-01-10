import {
    useMutation,
    useQuery,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { aiKeys } from '../model/keys';
import { aiApi } from './client';
import type {
    AiSuggestion,
    AiSuggestionParams,
    YieldPrediction,
    YieldPredictionParams,
    CostOptimization,
    CostOptimizationParams,
    AiChatRequest,
    AiChatResponse,
    AiQaRequest,
    AiQaResponse,
} from '../model/types';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// FARMER AI HOOKS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const useAiChat = (
    options?: UseMutationOptions<AiChatResponse, Error, AiChatRequest>
) => useMutation({
    mutationFn: aiApi.chat,
    ...options,
});

export const useAiSuggestions = (
    params: AiSuggestionParams,
    options?: Omit<UseQueryOptions<AiSuggestion[], Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: aiKeys.suggestions(params),
    queryFn: () => aiApi.getSuggestions(params),
    enabled: params.seasonId > 0,
    staleTime: 10 * 60 * 1000, // AI suggestions cache for 10 minutes
    ...options,
});

export const useYieldPrediction = (
    params: YieldPredictionParams,
    options?: Omit<UseQueryOptions<YieldPrediction, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: aiKeys.yieldPrediction(params),
    queryFn: () => aiApi.predictYield(params),
    enabled: params.seasonId > 0,
    staleTime: 30 * 60 * 1000, // Yield predictions cache for 30 minutes
    ...options,
});

export const useCostOptimization = (
    params: CostOptimizationParams,
    options?: Omit<UseQueryOptions<CostOptimization, Error>, 'queryKey' | 'queryFn'>
) => useQuery({
    queryKey: aiKeys.costOptimization(params),
    queryFn: () => aiApi.optimizeCost(params),
    enabled: params.seasonId > 0,
    staleTime: 30 * 60 * 1000, // Cost optimization cache for 30 minutes
    ...options,
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// BUYER AI HOOKS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const useAiQa = (
    options?: UseMutationOptions<AiQaResponse, Error, AiQaRequest>
) => useMutation({
    mutationFn: aiApi.askQuestion,
    ...options,
});
