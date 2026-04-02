import httpClient from '@/shared/api/http';
import { parseApiResponse } from '@/shared/api/types';
import { NotificationSchema } from '../model/schemas';
import { z } from 'zod';

export const notificationApi = {
  list: async () => {
    const response = await httpClient.get('/api/v1/farmer/notifications');
    return parseApiResponse(response.data, z.array(NotificationSchema));
  },
  markRead: async (id: number) => {
    const response = await httpClient.patch(`/api/v1/farmer/notifications/${id}/read`);
    return parseApiResponse(response.data, NotificationSchema);
  },
};
