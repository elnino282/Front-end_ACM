// Export auth feature components and hooks
export { AuthProvider, useAuth } from './context/AuthContext';
export { ProtectedRoute, FarmerRoute } from './components/ProtectedRoute';
export type { User, UserRole, AuthContextType, AuthError, AuthErrorType } from './context/AuthContext';
