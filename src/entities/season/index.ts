// Season Entity - Public API
// Handles growing season planning and management for farmers

// Types
export type {
    SeasonStatus,
    SeasonListParams,
    Season,
    SeasonDetailResponse,
    SeasonCreateRequest,
    SeasonUpdateRequest,
    SeasonStatusUpdateRequest,
    SeasonStartRequest,
    SeasonCompleteRequest,
    SeasonCancelRequest,
} from './model/types';

// Schemas (for external validation needs)
export {
    SeasonStatusEnum,
    SeasonListParamsSchema,
    SeasonSchema,
    SeasonDetailResponseSchema,
    SeasonCreateRequestSchema,
    SeasonUpdateRequestSchema,
    SeasonStatusUpdateRequestSchema,
    SeasonStartRequestSchema,
    SeasonCompleteRequestSchema,
    SeasonCancelRequestSchema,
} from './model/schemas';

// Keys
export { seasonKeys } from './model/keys';

// API Client
export { seasonApi } from './api/client';

// Hooks
export {
    useSeasons,
    useSeasonsByCrop,
    useSeasonById,
    useCreateSeason,
    useUpdateSeason,
    useUpdateSeasonStatus,
    useStartSeason,
    useCompleteSeason,
    useCancelSeason,
    useDeleteSeason,
} from './api/hooks';
