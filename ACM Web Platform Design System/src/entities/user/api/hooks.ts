import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseMutationOptions,
    type UseQueryOptions,
} from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { userKeys } from '../model/keys';
import { userApi } from './client';
import type {
    ProfileResponse,
    ProfileUpdateRequest,
    ProfileChangePasswordRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// PROFILE QUERY OPTIONS (for prefetching and reuse)
// ═══════════════════════════════════════════════════════════════

/** 
 * Profile query stale time - used consistently across prefetch and query
 * 60s allows quick loads while ensuring data is reasonably fresh
 */
export const PROFILE_STALE_TIME = 60 * 1000; // 60 seconds

/**
 * Get profile query options - reusable for prefetch and hooks
 */
export const getProfileQueryOptions = () => ({
    queryKey: userKeys.me(),
    queryFn: userApi.getMe,
    staleTime: PROFILE_STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
});

// ═══════════════════════════════════════════════════════════════
// USER REACT QUERY HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * useProfileMe - Optimized profile query hook
 * 
 * Uses placeholderData from session to render immediately,
 * while fetching fresh data in background.
 * 
 * @returns Query result with data, isLoading, isFetching (for refresh indicator)
 */
export const useProfileMe = (
    options?: Omit<UseQueryOptions<ProfileResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    const { user } = useAuth();
    
    // Convert session profile to ProfileResponse format for placeholderData
    const sessionProfile = user?.profile ? {
        id: user.profile.id ?? user.id ?? 0,
        username: user.username,
        email: user.profile.email ?? user.email ?? null,
        fullName: user.profile.fullName ?? null,
        phone: user.profile.phone ?? null,
        status: user.profile.status ?? 'ACTIVE',
        provinceId: user.profile.provinceId ?? null,
        wardId: user.profile.wardId ?? null,
        joinedDate: user.profile.joinedDate ?? null,
    } as ProfileResponse : undefined;

    return useQuery({
        ...getProfileQueryOptions(),
        // placeholderData renders immediately from session while fetching
        // This is better than initialData because it doesn't mark the cache as "fresh"
        placeholderData: sessionProfile,
        ...options,
    });
};

/**
 * useProfileUpdate - Profile update mutation with optimistic cache update
 * 
 * Updates both React Query cache and session store for instant UI feedback.
 */
export const useProfileUpdate = (
    options?: UseMutationOptions<ProfileResponse, Error, ProfileUpdateRequest, unknown>
) => {
    const queryClient = useQueryClient();
    const { updateUserProfile } = useAuth();
    
    return useMutation({
        mutationKey: userKeys.update(),
        mutationFn: async (data: ProfileUpdateRequest) => {
            const result = await userApi.updateProfile(data);
            
            // Immediately update React Query cache (no refetch needed)
            queryClient.setQueryData(userKeys.me(), result);
            
            // Also update session store for consistent state
            if (updateUserProfile) {
                updateUserProfile({
                    id: typeof result.id === 'string' ? parseInt(result.id) : result.id,
                    fullName: result.fullName,
                    email: result.email,
                    phone: result.phone,
                    status: result.status,
                    joinedDate: result.joinedDate,
                    provinceId: result.provinceId,
                    wardId: result.wardId,
                });
            }
            
            return result;
        },
        ...options,
    });
};

/**
 * useProfileChangePassword - Password change mutation
 */
export const useProfileChangePassword = (
    options?: UseMutationOptions<ProfileResponse, Error, ProfileChangePasswordRequest, unknown>
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: userKeys.changePassword(),
        mutationFn: async (data: ProfileChangePasswordRequest) => {
            const result = await userApi.changePassword(data);
            // Invalidate profile to ensure fresh data on next read
            queryClient.invalidateQueries({ queryKey: userKeys.me() });
            return result;
        },
        ...options,
    });
};
