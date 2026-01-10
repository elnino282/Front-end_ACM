import type { BreadcrumbPath } from '@/features/shared/layout/types';

/**
 * Available views in the farmer portal
 */
export type FarmerView =
  | 'dashboard'
  | 'farms'
  | 'plots'
  | 'seasons'
  | 'tasks'
  | 'field-logs'
  | 'expenses'
  | 'harvest'
  | 'suppliers-supplies'
  | 'inventory'
  | 'documents'
  | 'incidents'
  | 'ai-assistant'
  // Keep these for backward compatibility (accessible via other routes)
  | 'crops'
  | 'reports'
  | 'profile'
  | 'settings';

/**
 * Configuration for each farmer view
 */
export interface FarmerViewConfig {
  title: string;
  breadcrumbLabel: string;
}

/**
 * Function type for building breadcrumbs
 */
export type BuildBreadcrumbs = (view: FarmerView) => BreadcrumbPath[];



