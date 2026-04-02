import { getAdminViewTitle } from "../constants";
import type { AdminView } from "../types";
import { UnderConstruction } from "./UnderConstruction";

// Feature Imports
import { AdminDashboard } from "@/features/admin";
import { AdminPreferences } from "@/features/admin/preferences";
import { AdminProfile } from "@/features/admin/profile";
import { ReportsAnalytics } from "@/features/admin/reports-analytics";

// Admin Pages
import { AdminAlertsPage } from "@/pages/admin/AdminAlertsPage";
import { AdminIncidentsPage } from "@/pages/admin/AdminIncidentsPage";
import { AdminInventoryPage } from "@/pages/admin/AdminInventoryPage";
import { CropsVarietiesPage } from "@/pages/admin/CropsVarietiesPage";
import { FarmsPlotsPage } from "@/pages/admin/FarmsPlotsPage";
import { UsersRolesPage } from "@/pages/admin/UsersRolesPage";
import { AdminSearchPage } from "@/pages/admin/AdminSearchPage";

import { AdminDocumentsPage } from "@/pages/admin/AdminDocumentsPage";

type AdminPortalContentProps = {
  currentView: AdminView;
};

export function AdminPortalContent({ currentView }: AdminPortalContentProps) {
  switch (currentView) {
    case "dashboard":
      return <AdminDashboard />;
    case "search":
      return <AdminSearchPage />;
    case "inventory":
      return <AdminInventoryPage />;
    case "incidents":
      return <AdminIncidentsPage />;
    case "alerts":
      return <AdminAlertsPage />;
    case "users-roles":
      return <UsersRolesPage />;
    case "farms-plots":
      return <FarmsPlotsPage />;
    case "crops-varieties":
      return <CropsVarietiesPage />;
    case "reports":
      return <ReportsAnalytics />;

    case "documents":
      return <AdminDocumentsPage />;
    case "profile":
      return <AdminProfile />;
    case "settings":
      return <AdminPreferences />;
    default:
      return <UnderConstruction title={getAdminViewTitle(currentView)} />;
  }
}
