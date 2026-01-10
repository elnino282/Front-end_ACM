import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import { z } from 'zod';
import {
    AiSuggestionSchema,
    AiSuggestionParamsSchema,
    YieldPredictionSchema,
    YieldPredictionParamsSchema,
    CostOptimizationSchema,
    CostOptimizationParamsSchema,
    AiChatRequestSchema,
    AiChatResponseSchema,
    AiQaRequestSchema,
    AiQaResponseSchema,
} from '../model/schemas';
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

export const aiApi = {
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // FARMER AI ENDPOINTS
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

    /** POST /api/v1/farmer/ai/chat - Agronomy Q&A chat */
    chat: async (data: AiChatRequest): Promise<AiChatResponse> => {
        const validatedPayload = AiChatRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/farmer/ai/chat', validatedPayload);
        return parseApiResponse(response.data, AiChatResponseSchema);
    },

    /** GET /api/v1/farmer/ai/suggestions - Get AI suggestions for season */
    getSuggestions: async (params: AiSuggestionParams): Promise<AiSuggestion[]> => {
        const validatedParams = AiSuggestionParamsSchema.parse(params);
        const response = await httpClient.get('/api/v1/farmer/ai/suggestions', { params: validatedParams });
        return parseApiResponse(response.data, z.array(AiSuggestionSchema));
    },

    /** GET /api/v1/farmer/ai/predict-yield - Predict yield for season */
    predictYield: async (params: YieldPredictionParams): Promise<YieldPrediction> => {
        const validatedParams = YieldPredictionParamsSchema.parse(params);
        const response = await httpClient.get('/api/v1/farmer/ai/predict-yield', { params: validatedParams });
        return parseApiResponse(response.data, YieldPredictionSchema);
    },

    /** GET /api/v1/farmer/ai/optimize-cost - Get cost optimization suggestions */
    optimizeCost: async (params: CostOptimizationParams): Promise<CostOptimization> => {
        const validatedParams = CostOptimizationParamsSchema.parse(params);
        const response = await httpClient.get('/api/v1/farmer/ai/optimize-cost', { params: validatedParams });
        return parseApiResponse(response.data, CostOptimizationSchema);
    },

    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
    // BUYER AI ENDPOINTS
    // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

    /** GET /api/v1/ai/qa - AI Q&A (Buyer) */
    askQuestion: async (data: AiQaRequest): Promise<AiQaResponse> => {
        const validatedPayload = AiQaRequestSchema.parse(data);
        const response = await httpClient.get('/api/v1/ai/qa', { params: validatedPayload });
        return parseApiResponse(response.data, AiQaResponseSchema);
    },
};
