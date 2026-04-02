// Session Entity - Public API
// Handles authentication, tokens, and session management

// Types
export type {
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
    ProfileInfo,
    AuthErrorResponse,
} from './model/schemas';

// Schemas (for external validation needs)
export {
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
    ProfileInfoSchema,
    AuthErrorResponseSchema,
} from './model/schemas';

// Keys
export { sessionKeys } from './model/keys';

// API Client
export { sessionApi } from './api/client';

// Hooks
export {
    useAuthSignUp,
    useAuthSignIn,
    useAuthSignOut,
    useAuthRefresh,
    useAuthResetPassword,
    useAuthIntrospect,
} from './api/hooks';
