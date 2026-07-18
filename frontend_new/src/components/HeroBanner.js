import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
} from "react-native";

import { useThemeStore } from "../store/themeStore";
import { getProductImage } from "../utils/imageHelper";

export default function HeroBanner({ navigation, featuredPoster }) {
  const { colors } = useThemeStore();
  const backgroundImage = featuredPoster ? getProductImage(featuredPoster.image) : null;

  return (
    <ImageBackground
      source={backgroundImage}
      style={[
        styles.banner,
        {
          shadowColor: colors.primary,
        },
      ]}
      imageStyle={styles.bannerImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.small}>LIMITED COLLECTION</Text>

        <Text style={styles.title}>Curated{"\n"}Wall Art</Text>

        <Text style={styles.subtitle}>
          Elevate your living space with museum-quality posters.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Categories")}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>Browse Collection</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 24,
    marginTop: 24,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 4,
  },
  bannerImage: {
    opacity: 0.42,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 11, 11, 0.32)",
  },
  content: {
    padding: 24,
  },
  small: {
    color: "rgba(255, 255, 255, 0.92)",
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 2,
  },
  title: {
    fontSize: 36,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontWeight: "600",
    color: "white",
    marginTop: 8,
    lineHeight: 42,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.92)",
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