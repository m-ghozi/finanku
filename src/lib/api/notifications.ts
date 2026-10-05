import { apiClient } from './client';
import { AppNotification } from '@/src/types/notification';

export const notificationsService = {
  async getNotifications(): Promise<AppNotification[]> {
    const res = await apiClient<{ data: AppNotification[] }>('/notifications');
    return res.data;
  },

  async markAsRead(id: string): Promise<AppNotification> {
    const res = await apiClient<{ data: AppNotification }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return res.data;
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>('/notifications/read-all', {
      method: 'POST',
    });
  },
};
