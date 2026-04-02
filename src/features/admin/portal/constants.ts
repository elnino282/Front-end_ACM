import type { AdminView, AdminViewConfig } from "./types";

export const ADMIN_VIEW_CONFIG: Record<AdminView, AdminViewConfig> = {
  dashboard: { title: "Admin Dashboard", breadcrumbLabel: "Dashboard" },
  search: { title: "Search", breadcrumbLabel: "Search" },
  inventory: { title: "Inventory", breadcrumbLabel: "Inventory" },
  incidents: { title: "Incidents", breadcrumbLabel: "Incidents" },
  alerts: { title: "Alerts Center", breadcrumbLabel: "Alerts" },
  "users-roles": {
    title: "Users & Roles / Người dùng & Phân quyền",
    breadcrumbLabel: "Users & Roles",
  },
  "farms-plots": {
    title: "Farms & Plots / Trang trại & Lô đất",
    breadcrumbLabel: "Farms & Plots",
  },
  "crops-varieties": {
    title: "Crops & Varieties / Cây trồng & Giống",
    breadcrumbLabel: "Crops & Varieties",
  },
  reports: { title: "Reports / Báo cáo", breadcrumbLabel: "Reports" },
  documents: { title: "Documents / Tài liệu", breadcrumbLabel: "Documents" },
  profile: { title: "Admin Profile", breadcrumbLabel: "Profile" },
  settings: { title: "Preferences", breadcrumbLabel: "Preferences" },
};

export const getAdminViewTitle = (view: AdminView): string =>
  ADMIN_VIEW_CONFIG[view]?.title ?? ADMIN_VIEW_CONFIG.dashboard.title;

export const getAdminBreadcrumbLabel = (view: AdminView): string | undefined =>
  ADMIN_VIEW_CONFIG[view]?.breadcrumbLabel;
