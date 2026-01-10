import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication and/or specific roles.
 * 
 * Behavior:
 * - If not authenticated -> redirect to /sign-in
 * - If authenticated but wrong role -> redirect to user's portal
 * - If authenticated and role matches -> render children
 * 
 * Usage:
 * <ProtectedRoute requiredRole="farmer">
 *   <FarmerDashboard />
 * </ProtectedRoute>
 * 
 * <ProtectedRoute allowedRoles={['buyer', 'farmer']}>
 *   <SharedFeature />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ 
  children, 
  requiredRole,
  allowedRoles 
}: ProtectedRouteProps) {
  const { isAuthenticated, getUserRole, isLoading } = useAuth();
  const location = useLocation();

  // Still loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3BA55D] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#333333]/70 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Check role requirements
  const userRole = getUserRole();
  if (!userRole) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // If requiredRole is specified and doesn't match
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to user's portal (access denied for this route)
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  // If allowedRoles is specified and user's role is not in the list
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to user's portal (access denied for this route)
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return <>{children}</>;
}

/**
 * FarmerRoute - Convenience wrapper for farmer-only routes
 */
export function FarmerRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute requiredRole="farmer">{children}</ProtectedRoute>;
}
