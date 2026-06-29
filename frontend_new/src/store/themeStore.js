import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const light = {
  bg: '#f5f5f5', card: '#ffffff', text: '#222', muted: '#777',
  border: '#e0e0e0', primary: '#208AEF',
};
const dark = {
  bg: '#121212', card: '#1e1e1e', text: '#f1f1f1', muted: '#aaa',
  border: '#333', primary: '#4DA3FF',
};

export const useThemeStore = create((set, get) => ({
  mode: 'light',
  colors: light,

  toggle: async () => {
    const next = get().mode === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem('themeMode', next);
    set({ mode: next, colors: next === 'dark' ? dark : light });
  },

  loadTheme: async () => {
    const saved = await AsyncStorage.getItem('themeMode');
    if (saved === 'dark') set({ mode: 'dark', colors: dark });
  },
}));
