import { USE_MOCK_API, apiClient } from './client';
import { mockNotificationsApi } from '@/src/mocks/notifications';
import { AppNotification } from '@/src/types/notification';

export const notificationsService = {
  async getNotifications(): Promise<AppNotification[]> {
    if (USE_MOCK_API) {
      return mockNotificationsApi.getNotifications();
    }
    const res = await apiClient<{ data: AppNotification[] }>('/notifications');
    return res.data;
  },

  async markAsRead(id: string): Promise<AppNotification> {
    if (USE_MOCK_API) {
      return mockNotificationsApi.markAsRead(id);
    }
    const res = await apiClient<{ data: AppNotification }>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return res.data;
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    if (USE_MOCK_API) {
      return mockNotificationsApi.markAllAsRead();
    }
    return apiClient<{ success: boolean }>('/notifications/read-all', {
      method: 'POST',
    });
  },
};
