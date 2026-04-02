import { z } from 'zod';

export const NotificationSchema = z.object({
  id: z.number().int(),
  title: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  alertId: z.number().optional().nullable(),
  createdAt: z.string().optional().nullable(),
  readAt: z.string().optional().nullable(),
});

export type Notification = z.infer<typeof NotificationSchema>;
