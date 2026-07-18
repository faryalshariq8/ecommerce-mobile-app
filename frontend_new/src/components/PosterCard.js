import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../store/themeStore";
import { getProductImage } from "../utils/imageHelper";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

export default function PosterCard({ poster, navigation, horizontal }) {
  const { colors } = useThemeStore();
  const { addToCart } = useCartStore();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlistStore();
  const heartScale = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(1)).current;

  const title = poster.name || poster.title;
  const id = poster._id || poster.id;
  const imageSource = getProductImage(poster.image);
  const isWishlisted = wishlistItems.some(
    item => item._id === poster._id
  );

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.25,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateCard = (hovered) => {
    Animated.spring(cardScale, {
      toValue: hovered ? 1.03 : 1,
      speed: 20,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(poster._id);
  };

  return (
    <Animated.View style={{ transform: [{ scale: cardScale }] }}>
      <Pressable
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            width: horizontal ? 160 : 170,
            marginRight: horizontal ? 16 : 0,
          },
        ]}
        onHoverIn={() => animateCard(true)}
        onHoverOut={() => animateCard(false)}
        onPressIn={() => animateCard(true)}
        onPressOut={() => animateCard(false)}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            id: id,
            poster: poster,
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />

          {poster.countInStock <= 3 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ONLY {poster.countInStock} LEFT</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.heart}
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation();
              animateHeart();

              if (isWishlisted) {
                removeFromWishlist(poster._id);
              } else {
                addToWishlist(poster._id);
              }
            }}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={isWishlisted ? "heart" : "heart-outline"}
                size={18}
                color={isWishlisted ? "#EF4444" : colors.text}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <Text style={[styles.brand, { color: colors.text2 }]} numberOfLines={1}>
            {poster.brand || "PosterHaus Collection"}
          </Text>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${poster.price}
            </Text>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 198,
    borderRadius: 18,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heart: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  details: {
    marginTop: 10,
    paddingHorizontal: 2,
  },
  brand: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontWeight: "bold",
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});