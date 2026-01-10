import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import {
    ProfileResponseSchema,
    ProfileUpdateRequestSchema,
    ProfileChangePasswordRequestSchema,
} from '../model/schemas';
import type {
    ProfileResponse,
    ProfileUpdateRequest,
    ProfileChangePasswordRequest,
} from '../model/types';

// ═══════════════════════════════════════════════════════════════
// USER API CLIENT
// Pure Axios calls with Zod validation (no React dependencies)
// ═══════════════════════════════════════════════════════════════

export const userApi = {
    getMe: async (): Promise<ProfileResponse> => {
        const response = await httpClient.get('/api/v1/user/me');
        return parseApiResponse(response.data, ProfileResponseSchema);
    },

    updateProfile: async (data: ProfileUpdateRequest): Promise<ProfileResponse> => {
        const validatedPayload = ProfileUpdateRequestSchema.parse(data);
        const response = await httpClient.put('/api/v1/user/profile', validatedPayload);
        return parseApiResponse(response.data, ProfileResponseSchema);
    },

    changePassword: async (data: ProfileChangePasswordRequest): Promise<ProfileResponse> => {
        const validatedPayload = ProfileChangePasswordRequestSchema.parse(data);
        const response = await httpClient.put('/api/v1/user/change-password', validatedPayload);
        return parseApiResponse(response.data, ProfileResponseSchema);
    },
};
