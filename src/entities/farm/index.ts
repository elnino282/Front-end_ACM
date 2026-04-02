// Farm Entity - Public API
// Handles farm management for farmers

// Types
export type {
    FarmListParams,
    Farm,
    FarmResponse,
    FarmDetailResponse,
    FarmCreateRequest,
    FarmUpdateRequest,
} from './model/types';

// Schemas (for external validation needs)
export {
    FarmListParamsSchema,
    FarmSchema,
    FarmResponseSchema,
    FarmDetailResponseSchema,
    FarmCreateRequestSchema,
    FarmUpdateRequestSchema,
} from './model/schemas';

// Keys
export { farmKeys } from './model/keys';

// API Client
export { farmApi } from './api/client';

// Hooks
export {
    useFarms,
    useFarmById,
    useCreateFarm,
    useUpdateFarm,
    useDeleteFarm,
} from './api/hooks';
