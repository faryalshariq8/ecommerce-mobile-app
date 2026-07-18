import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  userInfo: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        isLoading: false,
      });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    set({ userInfo: null });
  },

  checkAuth: async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        set({ userInfo: JSON.parse(userInfo) });
      }
    } catch (error) {
      console.error('Failed to load user info', error);
    }
  },

  updateProfile: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put('/auth/profile', payload);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data));
      set({ userInfo: data, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));
