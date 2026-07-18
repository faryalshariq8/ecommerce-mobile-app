import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeStore } from "../store/themeStore";
import { useWishlistStore } from "../store/wishlistStore";
import api from "../services/api";

import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import CategoryChip from "../components/CategoryChip";
import PosterCard from "../components/PosterCard";

export default function Home({ navigation }) {
  const { colors } = useThemeStore();
  const { fetchWishlist } = useWishlistStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        await fetchWishlist();

        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);

        setCategories(catRes.data);
        setProducts(prodRes.data);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const searchMatch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch =
      selectedCategory === "All"
        ? true
        : product.category?._id === selectedCategory ||
          product.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <StatusBar
          barStyle={
            colors.background === "#FAF6EE" ? "dark-content" : "light-content"
          }
        />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.welcome, { color: colors.primary }]}>
            EST. 2026
          </Text>

          <Text style={[styles.brand, { color: colors.text }]}>
            PosterHaus
          </Text>

          <Text style={[styles.subtitle, { color: colors.text2 }]}>
            Discover museum-quality posters, curated for every aesthetic.
          </Text>

          <SearchBar value={search} onChangeText={setSearch} />

          <HeroBanner navigation={navigation} />

          <Text style={[styles.heading, { color: colors.text }]}>
            Categories
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
          >
            <CategoryChip
              title="All"
              selected={selectedCategory === "All"}
              onPress={() => setSelectedCategory("All")}
            />
            {categories.map((category) => (
              <CategoryChip
                key={category._id}
                title={category.name}
                selected={selectedCategory === category._id}
                onPress={() => setSelectedCategory(category._id)}
              />
            ))}
          </ScrollView>

          <Text style={[styles.heading, { color: colors.text }]}>
            Featured Collection
          </Text>

          {filteredProducts.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.text2 }]}>
              No posters found.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 30 }}
              style={styles.cardScroll}
            >
              {products.slice(0, 10).map((product) => (
                <PosterCard
                  key={product._id}
                  poster={product}
                  navigation={navigation}
                  horizontal={true}
                />
              ))}
            </ScrollView>
          )}

          <Text style={[styles.heading, { color: colors.text }]}>
            Popular Posters
          </Text>

          {filteredProducts.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.text2 }]}>
              No posters found.
            </Text>
          ) : (
            <View style={styles.grid}>
              {filteredProducts.map((product) => (
                <PosterCard
                  key={product._id}
                  poster={product}
                  navigation={navigation}
                />
              ))}
            </View>
          )}

          <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 22,
    paddingTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
    marginBottom: 4,
  },
  brand: {
    fontSize: 44,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  heading: {
    fontSize: 22,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontWeight: "bold",
    marginTop: 35,
    marginBottom: 16,
  },
  chipScroll: {
    flexDirection: "row",
    marginHorizontal: -22,
    paddingHorizontal: 22,
    marginBottom: 8,
  },
  cardScroll: {
    marginHorizontal: -22,
    paddingHorizontal: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyText: {
    fontSize: 14,
    marginTop: 10,
    fontStyle: "italic",
  },
});