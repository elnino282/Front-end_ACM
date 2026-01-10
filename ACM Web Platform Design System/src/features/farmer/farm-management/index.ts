// Farm Management Feature - Public API
export * from './hooks';

// Pages
export { FarmsListPage } from './pages/FarmsListPage';
export { FarmDetailPage } from './pages/FarmDetailPage';

// UI Components - New Modern Components
export { FarmToolbar } from './ui/FarmToolbar';
export { FarmsListView } from './ui/FarmsListView';
export { FarmsCardView } from './ui/FarmsCardView';
export { FarmActionsMenu } from './ui/FarmActionsMenu';
export { FarmBulkActionBar } from './ui/FarmBulkActionBar';

// UI Components - Shared/Dialog Components
export { LoadingState } from './ui/LoadingState';
export { EmptyState } from './ui/EmptyState';
export { FarmFormDialog } from './ui/FarmFormDialog';
export { FarmDeleteDialog } from './ui/FarmDeleteDialog';
export { FarmInfoCard } from './ui/FarmInfoCard';
export { FarmPlotsTable } from './ui/FarmPlotsTable';
export { CreatePlotInFarmDialog } from './ui/CreatePlotInFarmDialog';

// UI Components - Deprecated (kept for backward compatibility)
/** @deprecated Use FarmToolbar instead */
export { FarmFilters } from './ui/FarmFilters';
/** @deprecated Use FarmsListView instead */
export { FarmsTable } from './ui/FarmsTable';



