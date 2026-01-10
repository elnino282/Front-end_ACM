// ═══════════════════════════════════════════════════════════════
// DASHBOARD ENTITY - BARREL EXPORTS
// ═══════════════════════════════════════════════════════════════

// Schemas
export * from './model/schemas';

// Types
export * from './model/types';

// Query Keys
export * from './model/keys';

// API Client
export { dashboardApi } from './api/client';

// React Query Hooks
export {
    useDashboardOverview,
    useTodayTasks,
    useUpcomingTasks,
    usePlotStatus,
    useLowStock,
} from './api/hooks';
