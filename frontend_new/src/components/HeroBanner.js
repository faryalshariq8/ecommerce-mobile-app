import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

import { useThemeStore } from "../store/themeStore";

export default function HeroBanner({ navigation }) {
  const { colors } = useThemeStore();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
        },
      ]}
    >
      <Text style={styles.small}>
        LIMITED COLLECTION
      </Text>

      <Text style={styles.title}>
        Curated{"\n"}Wall Art
      </Text>

      <Text style={styles.subtitle}>
        Elevate your living space with museum-quality posters.
      </Text>

      <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Categories")}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: colors.primary,
            },
          ]}
        >
          Browse Collection
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  small: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 2,
  },
  title: {
    fontSize: 36,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
    lineHeight: 42,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    lineHeight: 20,
    maxWidth: "85%",
  },
  button: {
    marginTop: 18,
    backgroundColor: "white",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 13,
  },
});