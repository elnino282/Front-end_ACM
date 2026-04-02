/**
 * User Query Key Factory
 * Provides type-safe, consistent query keys for React Query
 */

export const userKeys = {
    all: ['user'] as const,
    me: () => [...userKeys.all, 'me'] as const,
    update: () => [...userKeys.all, 'update'] as const,
    changePassword: () => [...userKeys.all, 'change-password'] as const,
} as const;
