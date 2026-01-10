import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// SIGN UP
// ═══════════════════════════════════════════════════════════════

export const AuthSignUpRequestSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format").optional(),
    fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
    phone: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["BUYER", "FARMER"], {
        errorMap: () => ({ message: "Role must be either BUYER or FARMER" }),
    }),
}).strict();

export const AuthSignUpResponseSchema = z.object({
    status: z.number().optional(),
    code: z.string().optional(),
    message: z.string().optional(),
    result: z.object({
        id: z.number().positive("User ID must be a positive number"),
        username: z.string(),
        status: z.string().optional().nullable(),
        roles: z.array(z.string()).optional().nullable(),
    }),
});

export type AuthSignUpRequest = z.infer<typeof AuthSignUpRequestSchema>;
export type AuthSignUpResponse = z.infer<typeof AuthSignUpResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// PROFILE INFO (nested in responses)
// ═══════════════════════════════════════════════════════════════

export const ProfileInfoSchema = z.object({
    id: z.number().optional(),
    fullName: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    joinedDate: z.string().nullable().optional(),
    provinceId: z.number().nullable().optional(),
    wardId: z.number().nullable().optional(),
});

export type ProfileInfo = z.infer<typeof ProfileInfoSchema>;

// ═══════════════════════════════════════════════════════════════
// SIGN IN
// ═══════════════════════════════════════════════════════════════

/**
 * Sign-in request supporting both 'identifier' (username OR email) 
 * and backwards-compatible 'email' field.
 */
export const AuthSignInRequestSchema = z.object({
    identifier: z.string().min(1, "Username or email is required").optional(),
    email: z.string().optional(),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional().default(false),
});

/**
 * Sign-in response with profile and redirect info as per Feature 0.1 spec.
 */
export const AuthSignInResponseSchema = z.object({
    status: z.number().optional(),
    code: z.string().optional(),
    message: z.string().optional(),
    result: z.object({
        token: z.string().min(1, "Access token cannot be empty"),
        tokenType: z.string().optional().default("Bearer"),
        expiresIn: z.number().optional(),
        userId: z.number().optional(),
        email: z.string().optional(),
        username: z.string(),
        roles: z.array(z.string()).min(1, "At least one role is required"),
        role: z.string().optional(), // Primary role (BUYER/FARMER)
        profile: ProfileInfoSchema.optional(),
        redirectTo: z.string().optional(), // "/buyer" or "/farmer"
    }),
});

export type AuthSignInRequest = z.infer<typeof AuthSignInRequestSchema>;
export type AuthSignInResponse = z.infer<typeof AuthSignInResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// ME (GET /api/v1/auth/me) - Current user endpoint
// ═══════════════════════════════════════════════════════════════

export const AuthMeResponseSchema = z.object({
    status: z.number().optional(),
    code: z.string().optional(),
    message: z.string().optional(),
    result: z.object({
        userId: z.number().optional(),
        email: z.string().optional(),
        username: z.string().optional(),
        roles: z.array(z.string()).optional(),
        role: z.string().optional(), // Primary role
        profile: ProfileInfoSchema.optional(),
        redirectTo: z.string().optional(),
    }),
});

export type AuthMeResponse = z.infer<typeof AuthMeResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// SIGN OUT
// ═══════════════════════════════════════════════════════════════

export const AuthSignOutRequestSchema = z.object({
    token: z.string().min(1, "Token is required"),
}).strict();

export type AuthSignOutRequest = z.infer<typeof AuthSignOutRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// REFRESH
// ═══════════════════════════════════════════════════════════════

export const AuthRefreshRequestSchema = z.object({
    token: z.string().min(1, "Refresh token is required"),
}).strict();

export const AuthRefreshResponseSchema = z.object({
    status: z.number().optional(),
    code: z.string().optional(),
    message: z.string().optional(),
    result: z.object({
        token: z.string().min(1, "Access token cannot be empty"),
        tokenType: z.string().optional().default("Bearer"),
        expiresIn: z.number().optional(),
        userId: z.number().optional(),
        email: z.string().optional(),
        username: z.string().optional(),
        roles: z.array(z.string()).optional(),
        role: z.string().optional(),
        profile: ProfileInfoSchema.optional(),
        redirectTo: z.string().optional(),
    }),
});

export type AuthRefreshRequest = z.infer<typeof AuthRefreshRequestSchema>;
export type AuthRefreshResponse = z.infer<typeof AuthRefreshResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// RESET PASSWORD
// ═══════════════════════════════════════════════════════════════

export const AuthResetPasswordRequestSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).strict().refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type AuthResetPasswordRequest = z.infer<typeof AuthResetPasswordRequestSchema>;

// ═══════════════════════════════════════════════════════════════
// INTROSPECT
// ═══════════════════════════════════════════════════════════════

export const AuthIntrospectRequestSchema = z.object({
    token: z.string().min(1, "Token is required"),
}).strict();

export const AuthIntrospectResponseSchema = z.object({
    status: z.number().optional(),
    code: z.string().optional(),
    result: z.object({
        valid: z.boolean(),
    }).optional(),
    // Legacy format support
    active: z.boolean().optional(),
    username: z.string().optional(),
    role: z.string().optional(),
    exp: z.number().optional(),
});

export type AuthIntrospectRequest = z.infer<typeof AuthIntrospectRequestSchema>;
export type AuthIntrospectResponse = z.infer<typeof AuthIntrospectResponseSchema>;

// ═══════════════════════════════════════════════════════════════
// ERROR RESPONSE (for parsing backend errors)
// ═══════════════════════════════════════════════════════════════

export const AuthErrorResponseSchema = z.object({
    status: z.number().optional(),
    code: z.string().optional(),
    message: z.string().optional(),
});

export type AuthErrorResponse = z.infer<typeof AuthErrorResponseSchema>;
