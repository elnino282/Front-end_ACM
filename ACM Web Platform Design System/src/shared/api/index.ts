// Shared API Module - Public API

// HTTP Client
export { default as httpClient } from './http';

// Types & Schemas
export {
    ApiResponseSchema,
    PageResponseSchema,
    PaginationParamsSchema,
    DateSchema,
    DateTimeSchema,
} from './types';

export type {
    ApiResponse,
    PageResponse,
    PaginationParams,
} from './types';

// Parsing Helpers
export {
    parseApiResponse,
    parsePageResponse,
} from './types';

// Backend Address API (Primary - used for farm address selection)
export {
    fetchProvinces,
    fetchProvinceById,
    fetchWardsByProvince,
    fetchWardById,
    fetchAddressStats,
    getFullAddress,
    formatAddressBreadcrumb,
    formatAddressComma,
    ProvinceResponseSchema,
    WardResponseSchema,
    AddressStatsSchema,
} from './backendAddressApi';

export type {
    ProvinceResponse,
    WardResponse,
    AddressStats,
} from './backendAddressApi';

// External Vietnam Address API (Deprecated - kept for backward compatibility)
// Note: This uses provinces.open-api.vn external API
// For new implementations, use backend address API above
export * from './vietnamAddressApi';
