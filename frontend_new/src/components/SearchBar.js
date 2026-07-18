import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../store/themeStore";

export default function SearchBar({ value, onChangeText }) {
  const { colors } = useThemeStore();

  const isLight = colors.background === '#FAF6EE';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isLight 
            ? "rgba(255, 255, 255, 0.75)" 
            : "rgba(30, 30, 30, 0.75)",
          borderColor: isLight 
            ? "rgba(234, 229, 217, 0.6)" 
            : "rgba(255, 255, 255, 0.1)",
          shadowColor: colors.shadow,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={18}
        color={colors.text2}
      />

      <TextInput
        placeholder="Search posters..."
        placeholderTextColor={colors.text2}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          {
            color: colors.text,
          },
        ]}
      />

      <Ionicons
        name="options-outline"
        size={20}
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 22,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
});