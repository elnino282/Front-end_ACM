import type { BreadcrumbPath } from "@/features/shared/layout/types";

export type EmployeeView = "tasks" | "progress" | "payroll" | "profile" | "settings";

export interface EmployeePortalShellState {
  currentView: EmployeeView;
  setCurrentView: (view: string) => void;
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;
  userName: string;
  userEmail: string;
  breadcrumbs: BreadcrumbPath[];
  handleLogout: () => Promise<void>;
}
