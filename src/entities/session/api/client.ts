import httpClient from '@/shared/api/http';
import {
    AuthSignUpRequestSchema,
    AuthSignUpResponseSchema,
    AuthSignInRequestSchema,
    AuthSignInResponseSchema,
    AuthSignOutRequestSchema,
    AuthRefreshRequestSchema,
    AuthRefreshResponseSchema,
    AuthResetPasswordRequestSchema,
    AuthIntrospectRequestSchema,
    AuthIntrospectResponseSchema,
    AuthMeResponseSchema,
} from '../model/schemas';
import type {
    AuthSignUpRequest,
    AuthSignUpResponse,
    AuthSignInRequest,
    AuthSignInResponse,
    AuthSignOutRequest,
    AuthRefreshRequest,
    AuthRefreshResponse,
    AuthResetPasswordRequest,
    AuthIntrospectRequest,
    AuthIntrospectResponse,
    AuthMeResponse,
} from '../model/schemas';

// ═══════════════════════════════════════════════════════════════
// SESSION API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const sessionApi = {
    /**
     * Register a new user account
     */
    signUp: async (data: AuthSignUpRequest): Promise<AuthSignUpResponse> => {
        const validatedPayload = AuthSignUpRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/auth/sign-up', validatedPayload);
        return AuthSignUpResponseSchema.parse(response.data);
    },

    /**
     * Sign in with username/email and password.
     * 
     * @param data - Login credentials with `identifier` (username OR email) and `password`
     * @returns Authentication response with token, profile, role, and redirectTo path
     * 
     * Error codes:
     * - 401 INVALID_CREDENTIALS: Wrong username/email or password
     * - 403 USER_LOCKED: User account is not active
     * - 403 ROLE_MISSING: User has no assigned role
     */
    signIn: async (data: AuthSignInRequest): Promise<AuthSignInResponse> => {
        // Transform email to identifier for the new API if identifier not provided
        const payload = {
            identifier: data.identifier || data.email,
            email: data.email || data.identifier,
            password: data.password,
            rememberMe: data.rememberMe ?? false,
        };
        const validatedPayload = AuthSignInRequestSchema.parse(payload);
        const response = await httpClient.post('/api/v1/auth/sign-in', validatedPayload);
        return AuthSignInResponseSchema.parse(response.data);
    },

    /**
     * Get current authenticated user info.
     * Used for frontend app bootstrapping on page load.
     * 
     * @returns Current user profile, role, and redirect path
     * @throws 401 if token is invalid or expired
     */
    me: async (): Promise<AuthMeResponse> => {
        const response = await httpClient.get('/api/v1/auth/me');
        return AuthMeResponseSchema.parse(response.data);
    },

    /**
     * Sign out and invalidate the current token
     */
    signOut: async (data: AuthSignOutRequest): Promise<void> => {
        await httpClient.post('/api/v1/auth/sign-out', AuthSignOutRequestSchema.parse(data));
    },

    /**
     * Refresh the access token
     */
    refresh: async (data: AuthRefreshRequest): Promise<AuthRefreshResponse> => {
        const validatedPayload = AuthRefreshRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/auth/refresh', validatedPayload);
        return AuthRefreshResponseSchema.parse(response.data);
    },

    /**
     * Reset user password via token
     */
    resetPassword: async (data: AuthResetPasswordRequest): Promise<void> => {
        await httpClient.post('/api/v1/auth/reset-password', AuthResetPasswordRequestSchema.parse(data));
    },

    /**
     * Check if a token is still valid
     */
    introspect: async (data: AuthIntrospectRequest): Promise<AuthIntrospectResponse> => {
        const validatedPayload = AuthIntrospectRequestSchema.parse(data);
        const response = await httpClient.post('/api/v1/auth/introspect', validatedPayload);
        return AuthIntrospectResponseSchema.parse(response.data);
    },
};
