import api from '../utils/api';
import { NotificationDB } from '../types';

export const notificationsService = {
  getMyNotifications: async (): Promise<NotificationDB[]> => {
    const response = await api.get('/notifications/me');
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<any> => {
    const response = await api.patch(`/notifications/read/${notificationId}`);
    return response.data;
  },

  markAllAsRead: async (): Promise<any> => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/count');
    return response.data;
  },
};

