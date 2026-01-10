// Inventory Entity - Public API
// Only export what components need to use

// Types
export type {
    Warehouse,
    StockLocation,
    OnHandRow,
    StockMovement,
    StockMovementRequest,
    OnHandParams,
    MovementsParams,
} from './model/types';

// Schemas (for validation)
export {
    WarehouseSchema,
    StockLocationSchema,
    OnHandRowSchema,
    StockMovementSchema,
    StockMovementRequestSchema,
    OnHandParamsSchema,
    MovementsParamsSchema,
} from './model/schemas';

// Query Keys
export { inventoryKeys } from './model/keys';

// API Client
export { inventoryApi } from './api/client';

// React Query Hooks
export {
    useMyWarehouses,
    useLocations,
    useOnHandList,
    useMovements,
    useRecordStockMovement,
    useLotOnHand,
} from './api/hooks';
