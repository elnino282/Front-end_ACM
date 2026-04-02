// AI Entity - Public API
// Handles AI features for Farmer and Buyer roles

// Types
export type {
    AiSuggestionParams,
    AiSuggestion,
    YieldPredictionParams,
    YieldPrediction,
    CostOptimizationParams,
    CostOptimization,
    AiChatRequest,
    AiChatResponse,
    AiQaRequest,
    AiQaResponse,
} from './model/types';

// Schemas
export {
    AiSuggestionParamsSchema,
    AiSuggestionSchema,
    YieldPredictionParamsSchema,
    YieldPredictionSchema,
    CostOptimizationParamsSchema,
    CostOptimizationSchema,
    AiChatRequestSchema,
    AiChatResponseSchema,
    AiQaRequestSchema,
    AiQaResponseSchema,
} from './model/schemas';

// Keys
export { aiKeys } from './model/keys';

// API Client
export { aiApi } from './api/client';

// Farmer AI Hooks
export {
    useAiSuggestions,
    useYieldPrediction,
    useCostOptimization,
    useAiChat,
} from './api/hooks';

// Buyer AI Hooks
export { useAiQa } from './api/hooks';
