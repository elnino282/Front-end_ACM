// Location Entity - Public API
// Handles location data (provinces, wards) for dropdowns

// Types
export type {
    Province,
    ProvinceArrayResponse,
    Ward,
    WardArrayResponse,
} from './model/types';

// Schemas (for external validation needs)
export {
    ProvinceSchema,
    ProvinceArrayResponseSchema,
    WardSchema,
    WardArrayResponseSchema,
} from './model/schemas';

// Keys
export { locationKeys } from './model/keys';

// API Client
export { locationApi } from './api/client';

// Hooks
export {
    useProvinces,
    useWardsByProvince,
} from './api/hooks';
