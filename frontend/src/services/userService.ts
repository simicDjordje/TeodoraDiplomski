import api from '../utils/api';
import { UserDB, UserUpdate } from '../types';

export const userService = {
  getMe: async (): Promise<UserDB> => {
    const response = await api.get('/user/me');
    return response.data;
  },

  updateMe: async (update: UserUpdate): Promise<UserDB> => {
    const response = await api.patch('/user/me', update);
    return response.data;
  },

  deleteMyAccount: async (): Promise<any> => {
    const response = await api.delete('/user/me');
    return response.data;
  },
};

