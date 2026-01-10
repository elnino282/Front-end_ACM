// Variety Entity - Public API
// Handles crop variety management

// Types
export type {
    Variety,
    VarietyRequest,
} from './model/types';

// Schemas (for external validation needs)
export {
    VarietySchema,
    VarietyRequestSchema,
} from './model/schemas';

// Keys
export { varietyKeys } from './model/keys';

// API Client
export { varietyApi } from './api/client';

// Hooks
export {
    useVarietiesByCrop,
    useVarietyById,
} from './api/hooks';
