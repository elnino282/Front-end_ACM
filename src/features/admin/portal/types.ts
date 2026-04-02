import type { BreadcrumbPath } from "@/features/shared/layout/types";

export type AdminView =
  | "dashboard"
  | "search"
  | "inventory"
  | "incidents"
  | "alerts"
  | "users-roles"
  | "farms-plots"
  | "crops-varieties"
  | "reports"
  | "documents"
  | "profile"
  | "settings";

export type AdminViewConfig = {
  title: string;
  breadcrumbLabel?: string;
};

// Type definition helpers
export type BuildBreadcrumbs = (view: AdminView) => BreadcrumbPath[];
