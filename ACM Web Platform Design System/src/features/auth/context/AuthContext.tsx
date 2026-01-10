import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { sessionApi, type AuthSignInResponse, type ProfileInfo } from '@/entities/session';
import { getProfileQueryOptions } from '@/entities/user/api/hooks';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type UserRole = 'admin' | 'farmer' | 'buyer';

export interface User {
  id?: number;
  username: string;
  role: UserRole;
  email?: string;
  profile?: ProfileInfo;
}

interface AuthStorageShape {
  token: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

export type AuthErrorType = 
  | 'invalid_credentials'  // 401 INVALID_CREDENTIALS
  | 'user_locked'          // 403 USER_LOCKED
  | 'role_missing'         // 403 ROLE_MISSING
  | 'network_error'        // Network connectivity issue
  | 'server_error'         // 5xx errors
  | 'api_not_found';       // 404 (API endpoint not found)

export interface AuthError {
  type: AuthErrorType;
  message: string;
  code?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: AuthError; redirectTo?: string }>;
  logout: () => Promise<void>;
  getUserRole: () => UserRole | null;
  refreshUserFromToken: () => Promise<void>;
  getAccessToken: () => string | null;
  /** Update user profile in session (for optimistic updates after profile edit) */
  updateUserProfile: (profile: Partial<ProfileInfo>) => void;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const AUTH_STORAGE_KEY = 'acm_auth';

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Decode JWT token to extract user information
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

function normalizeRole(value?: string | null): UserRole | null {
  const normalized = value?.toLowerCase();
  if (normalized === 'admin' || normalized === 'farmer' || normalized === 'buyer') {
    return normalized;
  }
  return null;
}

function loadStoredAuth(): AuthStorageShape | null {
  if (typeof window === 'undefined') return null;

  try {
    // Check both localStorage and sessionStorage
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY) 
             || window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthStorageShape;
    if (!parsed.token || !parsed.user) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveStoredAuth(data: AuthStorageShape, rememberMe: boolean = true) {
  if (typeof window === 'undefined') return;
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  // Clear both storages first to avoid conflicts
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Map backend error response to AuthError
 */
function mapBackendError(status: number, code?: string, message?: string): AuthError {
  // Map specific error codes
  if (code === 'INVALID_CREDENTIALS') {
    return {
      type: 'invalid_credentials',
      message: 'Invalid username/email or password.',
      code,
    };
  }
  
  if (code === 'USER_LOCKED') {
    return {
      type: 'user_locked',
      message: 'Your account is locked. Please contact support.',
      code,
    };
  }
  
  if (code === 'ROLE_MISSING') {
    return {
      type: 'role_missing',
      message: 'No role assigned to your account. Please contact support.',
      code,
    };
  }

  // Map by HTTP status
  if (status === 401) {
    return {
      type: 'invalid_credentials',
      message: message || 'Invalid credentials.',
      code,
    };
  }
  
  if (status === 403) {
    return {
      type: 'user_locked',
      message: message || 'Access denied.',
      code,
    };
  }
  
  if (status === 404) {
    return {
      type: 'api_not_found',
      message: 'Cannot reach login service. Please check if the server is running.',
      code: 'ERR_API_NOT_FOUND',
    };
  }

  return {
    type: 'server_error',
    message: message || 'An unexpected error occurred. Please try again.',
    code,
  };
}

// ═══════════════════════════════════════════════════════════════
// AUTH PROVIDER
// ═══════════════════════════════════════════════════════════════

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the entire application.
 * Manages user state, login/logout, and session persistence.
 * 
 * Features:
 * - Supports login via username OR email
 * - Returns role-based redirect path
 * - Handles all error codes from backend
 * - Persists session across page reloads
 * - Calls /me endpoint on app bootstrap if token exists
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  /**
   * Prefetch profile query for instant profile page loads
   */
  const prefetchProfile = useCallback(() => {
    const options = getProfileQueryOptions();
    queryClient.prefetchQuery(options);
  }, [queryClient]);

  /**
   * Refresh user info from /me endpoint
   */
  const refreshUserFromToken = useCallback(async () => {
    try {
      const stored = loadStoredAuth();
      if (!stored?.token) {
        setUser(null);
        return;
      }

      // Call /me endpoint to get fresh user info
      const response = await sessionApi.me();
      const { result } = response;

      const primaryRole = normalizeRole(result.role || result.roles?.[0]);
      if (!primaryRole) {
        clearStoredAuth();
        setUser(null);
        return;
      }

      const refreshedUser: User = {
        id: result.userId,
        username: result.username || '',
        role: primaryRole,
        email: result.email,
        profile: result.profile,
      };

      setUser(refreshedUser);

      // Update stored auth with fresh user info
      saveStoredAuth({
        ...stored,
        user: refreshedUser,
      });
    } catch (error) {
      console.error('Failed to refresh user from token:', error);
      // Token is invalid, clear auth
      clearStoredAuth();
      setUser(null);
    }
  }, []);

  // Load user from storage on mount + call /me if token exists
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = loadStoredAuth();
        if (stored && stored.expiresAt > Date.now()) {
          // Token exists and not expired, try to refresh from /me
          setUser(stored.user);
          try {
            await refreshUserFromToken();
          } catch {
            // If /me fails, keep using stored user
            console.warn('Failed to refresh user info from /me endpoint');
          }
        } else if (stored && stored.expiresAt <= Date.now()) {
          clearStoredAuth();
        }
      } catch (error) {
        console.error('Failed to load auth from storage:', error);
        clearStoredAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [refreshUserFromToken]);

  /**
   * Login with username/email and password.
   * 
   * @param identifier - Username or email
   * @param password - User password
   * @param rememberMe - Whether to persist session in localStorage
   * @returns Result with success status, error (if failed), and redirectTo path
   */
  const login = async (
    identifier: string, 
    password: string, 
    rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: AuthError; redirectTo?: string }> => {
    try {
      // Call backend with identifier-based login
      const authResponse: AuthSignInResponse = await sessionApi.signIn({
        identifier,
        password,
        rememberMe,
      });

      // Extract user info from the response
      const { result } = authResponse;
      const { token, username, roles, userId, expiresIn, role, profile, redirectTo } = result;

      // Decode JWT to get user ID if not in response
      const jwtPayload = decodeJwtPayload(token);
      const userIdFromToken = jwtPayload?.user_id || jwtPayload?.userId || jwtPayload?.sub;

      // Use primary role from response or fall back to first role
      const primaryRole = normalizeRole(role || roles[0]);
      if (!primaryRole) {
        return {
          success: false,
          error: {
            type: 'role_missing',
            message: 'No supported role assigned to your account.',
          },
        };
      }

      const mappedUser: User = {
        id: userId ?? (userIdFromToken ? Number(userIdFromToken) : undefined),
        username,
        role: primaryRole,
        email: identifier.includes('@') ? identifier : undefined,
        profile,
      };

      // Calculate expiration time (use expiresIn from response or default 24h)
      const expirationMs = (expiresIn ?? 24 * 60 * 60) * 1000;

      const storage: AuthStorageShape = {
        token,
        refreshToken: token, // Using same token as refresh for now
        expiresAt: Date.now() + expirationMs,
        user: mappedUser,
      };

      setUser(mappedUser);
      saveStoredAuth(storage, rememberMe);

      // Prefetch profile for instant profile page loads
      prefetchProfile();

      const normalizedRedirect =
        redirectTo === '/admin' || redirectTo === '/farmer' || redirectTo === '/buyer' ? redirectTo : `/${primaryRole}`;

      return { 
        success: true,
        redirectTo: normalizedRedirect,
      };
    } catch (error) {
      console.error('Failed to login:', error);
      
      // Parse error to provide specific feedback
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 0;
        const responseData = error.response?.data as { code?: string; message?: string } | undefined;

        if (!error.response) {
          return {
            success: false,
            error: {
              type: 'network_error',
              message: 'Cannot connect to server. Please check your network connection.',
              code: 'ERR_NETWORK',
            },
          };
        }

        return {
          success: false,
          error: mapBackendError(status, responseData?.code, responseData?.message),
        };
      }

      return {
        success: false,
        error: {
          type: 'server_error',
          message: 'An unexpected error occurred. Please try again.',
        },
      };
    }
  };

  const logout = useCallback(async () => {
    try {
      // Get the current token before clearing
      const stored = loadStoredAuth();
      if (stored?.token) {
        // Call backend to invalidate token (saves to invalid_token table)
        await sessionApi.signOut({ token: stored.token });
      }
    } catch (error) {
      // Log error but continue with logout even if API call fails
      console.warn('Failed to invalidate token on server:', error);
    } finally {
      // Always clear local state and storage
      setUser(null);
      clearStoredAuth();
    }
  }, []);

  const getUserRole = useCallback((): UserRole | null => {
    return user?.role || null;
  }, [user]);

  const getAccessToken = useCallback((): string | null => {
    const stored = loadStoredAuth();
    return stored?.token || null;
  }, []);

  /**
   * Update user profile in session storage (for optimistic UI updates)
   * Call this after successful profile mutations to sync session with API response
   */
  const updateUserProfile = useCallback((profileUpdate: Partial<ProfileInfo>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = {
        ...prev,
        profile: {
          ...prev.profile,
          ...profileUpdate,
        },
      };
      // Also update storage
      const stored = loadStoredAuth();
      if (stored) {
        saveStoredAuth({
          ...stored,
          user: updatedUser,
        });
      }
      return updatedUser;
    });
  }, []);

  // Show loading UI while checking authentication state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#3BA55D] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#333333]/70 text-sm">Loading application...</p>
        </div>
      </div>
    );
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    getUserRole,
    refreshUserFromToken,
    getAccessToken,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context
 * Throws error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
