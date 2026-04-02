/**
 * Session Query Key Factory
 * Provides type-safe, consistent query keys for React Query
 */

export const sessionKeys = {
    all: ['session'] as const,
    signUp: () => [...sessionKeys.all, 'sign-up'] as const,
    signIn: () => [...sessionKeys.all, 'sign-in'] as const,
    signOut: () => [...sessionKeys.all, 'sign-out'] as const,
    refresh: () => [...sessionKeys.all, 'refresh'] as const,
    resetPassword: () => [...sessionKeys.all, 'reset-password'] as const,
    introspect: (token: string) => [...sessionKeys.all, 'introspect', token] as const,
} as const;
