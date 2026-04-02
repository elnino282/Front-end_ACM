import type { AiSuggestionParams, YieldPredictionParams, CostOptimizationParams } from './types';

export const aiKeys = {
    all: ['ai'] as const,
    // Farmer AI
    suggestions: (params: AiSuggestionParams) => [...aiKeys.all, 'suggestions', params] as const,
    yieldPrediction: (params: YieldPredictionParams) => [...aiKeys.all, 'yield-prediction', params] as const,
    costOptimization: (params: CostOptimizationParams) => [...aiKeys.all, 'cost-optimization', params] as const,
    chat: () => [...aiKeys.all, 'chat'] as const,
    // Buyer AI
    qa: () => [...aiKeys.all, 'qa'] as const,
};
