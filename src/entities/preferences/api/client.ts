import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import {
    PreferencesSchema,
    PreferencesUpdateRequestSchema,
    type Preferences,
    type PreferencesUpdateRequest,
} from '../model/schemas';

export const preferencesApi = {
    getMe: async (): Promise<Preferences> => {
        const response = await httpClient.get('/api/v1/preferences/me');
        return parseApiResponse(response.data, PreferencesSchema);
    },

    updateMe: async (data: PreferencesUpdateRequest): Promise<Preferences> => {
        const payload = PreferencesUpdateRequestSchema.parse(data);
        const response = await httpClient.put('/api/v1/preferences/me', payload);
        return parseApiResponse(response.data, PreferencesSchema);
    },
};
