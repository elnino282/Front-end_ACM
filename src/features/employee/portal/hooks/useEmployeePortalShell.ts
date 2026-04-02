import { useProfileMe } from "@/entities/user";
import { useAuth } from "@/features/auth";
import { useI18n } from "@/hooks/useI18n";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { EmployeePortalShellState, EmployeeView } from "../types";

const EMPLOYEE_VIEWS: EmployeeView[] = ["tasks", "progress", "payroll", "profile", "settings"];

const resolveViewFromPath = (pathname: string): EmployeeView => {
  const pathParts = pathname.split("/").filter(Boolean);
  if (pathParts[0] !== "employee") return "tasks";
  const view = pathParts[1] as EmployeeView | undefined;
  if (view && EMPLOYEE_VIEWS.includes(view)) return view;
  return "tasks";
};

export function useEmployeePortalShell(): EmployeePortalShellState {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { data: profile } = useProfileMe();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<EmployeeView>("tasks");
  const [aiChatOpen, setAiChatOpen] = useState(false);

  useEffect(() => {
    setCurrentView(resolveViewFromPath(location.pathname));
  }, [location.pathname]);

  const profileFullName = profile?.fullName?.trim();
  const sessionFullName = user?.profile?.fullName?.trim();
  const emailUsername = user?.email?.split("@")[0];
  const userName = profileFullName || sessionFullName || emailUsername || "Employee";
  const userEmail = profile?.email || user?.email || "employee@acm-platform.com";

  const viewLabels: Record<EmployeeView, string> = {
    tasks: t("nav.tasks"),
    progress: t("nav.progress"),
    payroll: t("nav.payroll"),
    profile: t("userMenu.profile"),
    settings: t("userMenu.preferences"),
  };

  const breadcrumbs = useMemo(
    () => [
      { label: t("nav.tasks"), href: "/employee/tasks" },
      ...(currentView !== "tasks" ? [{ label: viewLabels[currentView] }] : []),
    ],
    [currentView, t, viewLabels]
  );

  const handleViewChange = (view: string) => {
    if (view.startsWith("/")) {
      navigate(view);
      return;
    }

    const target = view === "dashboard" ? "tasks" : (view as EmployeeView);
    if (!EMPLOYEE_VIEWS.includes(target)) {
      navigate("/employee/tasks");
      return;
    }
    setCurrentView(target);
    navigate(`/employee/${target}`);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    navigate("/sign-in", { replace: true });
  };

  return {
    currentView,
    setCurrentView: handleViewChange,
    aiChatOpen,
    setAiChatOpen,
    userName,
    userEmail,
    breadcrumbs,
    handleLogout,
  };
}
