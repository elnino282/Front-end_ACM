import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { useAuth } from '@/features/auth';
import { ErrorBoundary, Skeleton } from '@/shared/ui';
import { SeasonProvider } from '@/shared/contexts';

// ═══════════════════════════════════════════════════════════════
// LAZY LOADED COMPONENTS - Improves initial bundle size
// ═══════════════════════════════════════════════════════════════

// Auth pages (loaded immediately as they're entry points)
import { SignInPage } from '@/pages/shared/SignInPage';
import { SignUpPage } from '@/pages/shared/SignUpPage';
import { ForgotPasswordPage } from '@/pages/ForgotPassword';
import { ResetPasswordPage } from '@/pages/ResetPassword';

// Portal shells
import { FarmerPortalWithShell } from '@/features/farmer/portal';
import { AdminPortalWithShell } from '@/features/admin/portal';

// Farmer feature components - Lazy loaded for code splitting
const FarmerDashboard = lazy(() => import('@/features/farmer/dashboard').then(m => ({ default: m.FarmerDashboard })));
const CropManagement = lazy(() => import('@/features/farmer/crops').then(m => ({ default: m.CropManagement })));
const HarvestManagement = lazy(() => import('@/features/farmer/harvests').then(m => ({ default: m.HarvestManagement })));
const PlotManagement = lazy(() => import('@/features/farmer/plots').then(m => ({ default: m.PlotManagement })));
const SeasonManagement = lazy(() => import('@/features/farmer/seasons').then(m => ({ default: m.SeasonManagement })));
const Documents = lazy(() => import('@/features/farmer/documents').then(m => ({ default: m.Documents })));
const ExpenseManagement = lazy(() => import('@/features/farmer/expense-management').then(m => ({ default: m.ExpenseManagement })));
const Reports = lazy(() => import('@/features/farmer/reports').then(m => ({ default: m.Reports })));
const TaskWorkspace = lazy(() => import('@/features/farmer/tasks').then(m => ({ default: m.TaskWorkspace })));
const FarmerProfile = lazy(() => import('@/features/farmer/profile').then(m => ({ default: m.FarmerProfile })));
const FarmerPreferences = lazy(() => import('@/features/farmer/preferences').then(m => ({ default: m.FarmerPreferences })));
const FarmsListPage = lazy(() => import('@/features/farmer/farm-management').then(m => ({ default: m.FarmsListPage })));
const FarmDetailPage = lazy(() => import('@/features/farmer/farm-management').then(m => ({ default: m.FarmDetailPage })));

// Farmer pages - Lazy loaded
const FieldLogsPage = lazy(() => import('@/pages/farmer/FieldLogsPage').then(m => ({ default: m.FieldLogsPage })));
const InventoryPage = lazy(() => import('@/pages/farmer/InventoryPage').then(m => ({ default: m.InventoryPage })));
const IncidentsPage = lazy(() => import('@/pages/farmer/IncidentsPage').then(m => ({ default: m.IncidentsPage })));
const AiAssistantPage = lazy(() => import('@/pages/farmer/AiAssistantPage').then(m => ({ default: m.AiAssistantPage })));
const SuppliersSuppliesPage = lazy(() => import('@/pages/farmer/SuppliersSuppliesPage').then(m => ({ default: m.SuppliersSuppliesPage })));

// ═══════════════════════════════════════════════════════════════
// LOADING FALLBACK COMPONENT
// ═══════════════════════════════════════════════════════════════

function PageLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="space-y-4 w-full max-w-md px-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

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

  return <Navigate to="/sign-in" replace />;
}

/**
 * AppRoutes Component
 * 
 * Defines all application routes with:
 * - Role-based protection via ProtectedRoute
 * - Route-level ErrorBoundary for each portal
 * - SeasonProvider for farmer routes (tasks/harvests)
 * - Lazy loading with Suspense for code splitting
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
        <Route path="dashboard" element={<Suspense fallback={<PageLoadingFallback />}><FarmerDashboard /></Suspense>} />

        {/* Farm Management with nested routes */}
        <Route path="farms">
          <Route index element={<Suspense fallback={<PageLoadingFallback />}><FarmsListPage /></Suspense>} />
          <Route path=":id" element={<Suspense fallback={<PageLoadingFallback />}><FarmDetailPage /></Suspense>} />
        </Route>

        {/* Other Farmer Features - All lazy loaded */}
        <Route path="plots" element={<Suspense fallback={<PageLoadingFallback />}><PlotManagement /></Suspense>} />
        <Route path="seasons" element={<Suspense fallback={<PageLoadingFallback />}><SeasonManagement /></Suspense>} />
        <Route path="tasks" element={<Suspense fallback={<PageLoadingFallback />}><TaskWorkspace /></Suspense>} />
        <Route path="crops" element={<Suspense fallback={<PageLoadingFallback />}><CropManagement /></Suspense>} />
        <Route path="expenses" element={<Suspense fallback={<PageLoadingFallback />}><ExpenseManagement /></Suspense>} />
        <Route path="harvest" element={<Suspense fallback={<PageLoadingFallback />}><HarvestManagement /></Suspense>} />
        <Route path="suppliers-supplies" element={<Suspense fallback={<PageLoadingFallback />}><SuppliersSuppliesPage /></Suspense>} />
        <Route path="reports" element={<Suspense fallback={<PageLoadingFallback />}><Reports /></Suspense>} />
        <Route path="documents" element={<Suspense fallback={<PageLoadingFallback />}><Documents /></Suspense>} />
        <Route path="field-logs" element={<Suspense fallback={<PageLoadingFallback />}><FieldLogsPage /></Suspense>} />
        <Route path="inventory" element={<Suspense fallback={<PageLoadingFallback />}><InventoryPage /></Suspense>} />
        <Route path="incidents" element={<Suspense fallback={<PageLoadingFallback />}><IncidentsPage /></Suspense>} />
        <Route path="farms-plots" element={<Navigate to="/farmer/farms" replace />} />
        <Route path="ai-assistant" element={<Suspense fallback={<PageLoadingFallback />}><AiAssistantPage /></Suspense>} />
        <Route path="profile" element={<Suspense fallback={<PageLoadingFallback />}><FarmerProfile /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoadingFallback />}><FarmerPreferences /></Suspense>} />
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

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Catch all - redirect to sign-in */}
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

