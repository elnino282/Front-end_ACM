import type { FarmerView, FarmerViewConfig } from './types';

/**
 * Configuration mapping for all farmer portal views
 */
export const FARMER_VIEW_CONFIG: Record<FarmerView, FarmerViewConfig> = {
  dashboard: {
    title: 'Dashboard',
    breadcrumbLabel: 'Dashboard',
  },
  farms: {
    title: 'Farms & Plots',
    breadcrumbLabel: 'Farms & Plots',
  },
  plots: {
    title: 'Plot Management',
    breadcrumbLabel: 'Plot Management',
  },
  seasons: {
    title: 'Seasons',
    breadcrumbLabel: 'Seasons',
  },
  tasks: {
    title: 'Tasks Workspace',
    breadcrumbLabel: 'Tasks Workspace',
  },
  'field-logs': {
    title: 'Field Logs',
    breadcrumbLabel: 'Field Logs',
  },
  expenses: {
    title: 'Expenses',
    breadcrumbLabel: 'Expenses',
  },
  harvest: {
    title: 'Harvest',
    breadcrumbLabel: 'Harvest',
  },
  'suppliers-supplies': {
    title: 'Suppliers & Supplies',
    breadcrumbLabel: 'Suppliers & Supplies',
  },
  inventory: {
    title: 'Inventory',
    breadcrumbLabel: 'Inventory',
  },
  documents: {
    title: 'Documents',
    breadcrumbLabel: 'Documents',
  },
  incidents: {
    title: 'Incidents',
    breadcrumbLabel: 'Incidents',
  },
  'ai-assistant': {
    title: 'AI Assistant',
    breadcrumbLabel: 'AI Assistant',
  },
  // Keep for backward compatibility
  crops: {
    title: 'Crop Management',
    breadcrumbLabel: 'Crop Management',
  },
  reports: {
    title: 'Reports',
    breadcrumbLabel: 'Reports',
  },
  profile: {
    title: 'Profile',
    breadcrumbLabel: 'Profile',
  },
  settings: {
    title: 'Preferences',
    breadcrumbLabel: 'Preferences',
  },
};

/**
 * Get the display title for a farmer view
 */
export function getFarmerViewTitle(view: FarmerView): string {
  return FARMER_VIEW_CONFIG[view]?.title ?? 'Dashboard';
}

/**
 * Get the breadcrumb label for a farmer view
 */
export function getFarmerBreadcrumbLabel(view: FarmerView): string {
  return FARMER_VIEW_CONFIG[view]?.breadcrumbLabel ?? 'Dashboard';
}



