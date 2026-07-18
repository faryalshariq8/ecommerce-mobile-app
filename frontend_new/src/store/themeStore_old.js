import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { light, dark } from '../constants/colors';

export const useThemeStore = create((set, get) => ({
  mode: "light",

  colors: light,

  toggle: async () => {
    const next = get().mode === "light" ? "dark" : "light";

    await AsyncStorage.setItem("themeMode", next);

    set({
      mode: next,
      colors: next === "dark" ? dark : light,
    });
  },

  loadTheme: async () => {
    const saved = await AsyncStorage.getItem("themeMode");

    if (saved === "dark") {
      set({
        mode: "dark",
        colors: dark,
      });
    }
  },
}));