import { mockStore } from './storage';
import { AppNotification } from '@/src/types/notification';

export const mockNotificationsApi = {
  async getNotifications(): Promise<AppNotification[]> {
    await new Promise((r) => setTimeout(r, 150));
    return mockStore.getNotifications();
  },

  async markAsRead(id: string): Promise<AppNotification> {
    await new Promise((r) => setTimeout(r, 150));
    const notifs = mockStore.getNotifications();
    const index = notifs.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('Notifikasi tidak ditemukan');

    notifs[index].isRead = true;
    mockStore.setNotifications([...notifs]);
    return notifs[index];
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    await new Promise((r) => setTimeout(r, 150));
    const notifs = mockStore.getNotifications().map((n) => ({ ...n, isRead: true }));
    mockStore.setNotifications(notifs);
    return { success: true };
  },
};
