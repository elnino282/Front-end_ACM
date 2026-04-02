import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { SignInPage } from '@/pages/shared/SignInPage';
import { SignUpPage } from '@/pages/shared/SignUpPage';
import { ForgotPasswordPage } from '@/pages/ForgotPassword';
import { ResetPasswordPage } from '@/pages/ResetPassword';
import { FarmerPortalWithShell } from '@/features/farmer/portal';
import { AdminPortalWithShell } from '@/features/admin/portal';
import { EmployeePortalWithShell } from '@/features/employee/portal';
import { useAuth } from '@/features/auth';
import { ErrorBoundary } from '@/shared/ui';
import { SeasonProvider, useSeason } from '@/shared/contexts';

// Farmer feature imports
import { CropManagement } from '@/features/farmer/crops';
import { FarmerDashboard } from '@/features/farmer/dashboard';
import { HarvestManagement } from '@/features/farmer/harvests';
import { PlotManagement } from '@/features/farmer/plots';
import { SeasonManagement } from '@/features/farmer/seasons';
import { Documents } from '@/features/farmer/documents';
import { ExpenseManagement } from '@/features/farmer/expense-management';
import { TaskWorkspace } from '@/features/farmer/tasks';
import { LaborManagementPage } from '@/features/farmer/labor-management';
import { FarmerProfile } from '@/features/farmer/profile';
import { FarmerPreferences } from '@/features/farmer/preferences';
import { FarmsListPage, FarmDetailPage } from '@/features/farmer/farm-management';
import { FieldLogsPage } from '@/pages/farmer/FieldLogsPage';
import { InventoryPage } from '@/pages/farmer/InventoryPage';
import { ProductWarehousePage } from '@/pages/farmer/ProductWarehousePage';

import { AiAssistantPage } from '@/pages/farmer/AiAssistantPage';
import { SuppliersSuppliesPage } from '@/pages/farmer/SuppliersSuppliesPage';
import { NotificationsPage } from '@/pages/farmer/NotificationsPage';
import { FarmerSearchPage } from '@/pages/farmer/FarmerSearchPage';
import {
  SeasonIrrigationWaterAnalysesWorkspace,
  SeasonWorkspaceLayout,
  SeasonNutrientInputsWorkspace,
  SeasonReportsWorkspace,
  SeasonSoilTestsWorkspace,
  SeasonWorkspaceOverview,
} from '@/features/farmer/season-workspace';
import { EmployeeTasksPage } from '@/pages/employee/EmployeeTasksPage';
import { EmployeeProgressPage } from '@/pages/employee/EmployeeProgressPage';
import { EmployeePayrollPage } from '@/pages/employee/EmployeePayrollPage';
import { EmployeeProfilePage } from '@/pages/employee/EmployeeProfilePage';
import { EmployeeSettingsPage } from '@/pages/employee/EmployeeSettingsPage';

/**
 * Root redirect - redirects to sign-in or user's portal based on auth state
 */
function RootRedirect() {
  const { isAuthenticated, getUserRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  const role = getUserRole();
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (role === 'farmer') {
    return <Navigate to="/farmer/dashboard" replace />;
  }
  if (role === 'employee') {
    return <Navigate to="/employee/tasks" replace />;
  }

  return <Navigate to="/sign-in" replace />;
}

function LegacySeasonModuleRedirect({
  modulePath,
}: {
  modulePath: 'tasks' | 'expenses' | 'field-logs' | 'harvest' | 'reports';
}) {
  const { selectedSeasonId } = useSeason();

  if (!selectedSeasonId) {
    return <Navigate to="/farmer/seasons" replace />;
  }

  return (
    <Navigate
      to={`/farmer/seasons/${selectedSeasonId}/workspace/${modulePath}`}
      replace
    />
  );
}

/**
 * AppRoutes Component
 * 
 * Defines all application routes with:
 * - Role-based protection via ProtectedRoute
 * - Route-level ErrorBoundary for each portal
 * - SeasonProvider for farmer routes (tasks/harvests)
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/signin" element={<Navigate to="/sign-in" replace />} />
      <Route path="/signup" element={<Navigate to="/sign-up" replace />} />

      {/* Farmer Routes - Protected with SeasonProvider and ErrorBoundary */}
      <Route
        path="/farmer"
        element={
          <ProtectedRoute requiredRole="farmer">
            <ErrorBoundary>
              <SeasonProvider>
                <FarmerPortalWithShell />
              </SeasonProvider>
            </ErrorBoundary>
          </ProtectedRoute>
        }
      >
        {/* Redirect /farmer to /farmer/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Farmer Dashboard */}
        <Route path="dashboard" element={<FarmerDashboard />} />
        <Route path="search" element={<FarmerSearchPage />} />

        {/* Farm Management with nested routes */}
        <Route path="farms">
          <Route index element={<FarmsListPage />} />
          <Route path=":id" element={<FarmDetailPage />} />
        </Route>

        {/* Other Farmer Features */}
        <Route path="plots" element={<PlotManagement />} />
        <Route path="seasons">
          <Route index element={<SeasonManagement />} />
          <Route path=":seasonId/workspace" element={<SeasonWorkspaceLayout />}>
            <Route index element={<SeasonWorkspaceOverview />} />
            <Route path="tasks" element={<TaskWorkspace />} />
            <Route path="expenses" element={<ExpenseManagement />} />
            <Route path="field-logs" element={<FieldLogsPage />} />
            <Route path="harvest" element={<HarvestManagement />} />
            <Route path="nutrient-inputs" element={<SeasonNutrientInputsWorkspace />} />
            <Route path="irrigation-water-analyses" element={<SeasonIrrigationWaterAnalysesWorkspace />} />
            <Route path="soil-tests" element={<SeasonSoilTestsWorkspace />} />
            <Route path="reports" element={<SeasonReportsWorkspace />} />
          </Route>
        </Route>
        <Route path="tasks" element={<LegacySeasonModuleRedirect modulePath="tasks" />} />
        <Route path="crops" element={<CropManagement />} />
        <Route path="expenses" element={<LegacySeasonModuleRedirect modulePath="expenses" />} />
        <Route path="harvest" element={<LegacySeasonModuleRedirect modulePath="harvest" />} />
        <Route path="suppliers-supplies" element={<SuppliersSuppliesPage />} />
        <Route path="labor-management" element={<LaborManagementPage />} />
        <Route path="reports" element={<LegacySeasonModuleRedirect modulePath="reports" />} />
        <Route path="documents" element={<Documents />} />
        <Route path="field-logs" element={<LegacySeasonModuleRedirect modulePath="field-logs" />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="product-warehouse" element={<ProductWarehousePage />} />

        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="farms-plots" element={<Navigate to="/farmer/farms" replace />} />
        <Route path="ai-assistant" element={<AiAssistantPage />} />
        <Route path="profile" element={<FarmerProfile />} />
        <Route path="settings" element={<FarmerPreferences />} />
      </Route>

      {/* Admin Routes - Protected with ErrorBoundary */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <ErrorBoundary>
              <AdminPortalWithShell />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Employee Routes - Protected with ErrorBoundary */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="employee">
            <ErrorBoundary>
              <EmployeePortalWithShell />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="tasks" replace />} />
        <Route path="tasks" element={<EmployeeTasksPage />} />
        <Route path="progress" element={<EmployeeProgressPage />} />
        <Route path="payroll" element={<EmployeePayrollPage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
        <Route path="settings" element={<EmployeeSettingsPage />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Catch all - redirect to sign-in */}
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

