import type { AdminView } from '../types';
import { getAdminViewTitle } from '../constants';
import { UnderConstruction } from './UnderConstruction';

// Feature Imports
import { AdminDashboard } from '@/features/admin';
import { ReportsAnalytics } from '@/features/admin/reports-analytics';

// Admin Pages
import { UsersRolesPage } from '@/pages/admin/UsersRolesPage';
import { FarmsPlotsPage } from '@/pages/admin/FarmsPlotsPage';
import { CropsVarietiesPage } from '@/pages/admin/CropsVarietiesPage';

import { AdminDocumentsPage } from '@/pages/admin/AdminDocumentsPage';

type AdminPortalContentProps = {
  currentView: AdminView;
};

export function AdminPortalContent({ currentView }: AdminPortalContentProps) {
  switch (currentView) {
    case 'dashboard':
      return <AdminDashboard />;
    case 'users-roles':
      return <UsersRolesPage />;
    case 'farms-plots':
      return <FarmsPlotsPage />;
    case 'crops-varieties':
      return <CropsVarietiesPage />;
    case 'reports':
      return <ReportsAnalytics />;

    case 'documents':
      return <AdminDocumentsPage />;
    default:
      return <UnderConstruction title={getAdminViewTitle(currentView)} />;
  }
}
