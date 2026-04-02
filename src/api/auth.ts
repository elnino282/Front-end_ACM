import httpClient from '@/shared/api/http';

export type ResetPasswordPayload = {
    token: string;
    newPassword: string;
    confirmPassword: string;
};

export const forgotPassword = async (email: string): Promise<void> => {
    await httpClient.post('/api/v1/auth/forgot-password', { email });
};

export const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
    await httpClient.post('/api/v1/auth/reset-password', payload);
};

export const validateResetToken = async (token: string): Promise<void> => {
    await httpClient.get('/api/v1/auth/reset-password/validate', {
        params: { token },
    });
};
