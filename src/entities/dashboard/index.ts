// ═══════════════════════════════════════════════════════════════
// DASHBOARD ENTITY - BARREL EXPORTS
// ═══════════════════════════════════════════════════════════════

// Schemas
export * from './model/schemas';

// Types
export * from './model/types';
export * from './model/fdn';

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

export {
    useDashboardFdnOverview,
    useDashboardFieldMap,
    useFieldMetrics,
    useFieldHistory,
    useFieldRecommendations,
    useDashboardAssistantRecommendations,
} from './api/fdn-hooks';
