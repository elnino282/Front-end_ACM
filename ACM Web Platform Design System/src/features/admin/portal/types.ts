import type { BreadcrumbPath } from '@/features/shared/layout/types';

export type AdminView =
  | 'dashboard'
  | 'users-roles'
  | 'farms-plots'
  | 'crops-varieties'
  | 'reports'
  | 'documents';

export type AdminViewConfig = {
  title: string;
  breadcrumbLabel?: string;
};

// Type definition helpers
export type BuildBreadcrumbs = (view: AdminView) => BreadcrumbPath[];
