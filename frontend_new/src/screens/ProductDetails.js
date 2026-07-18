import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated } from "react-native";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useThemeStore } from "../store/themeStore";
import { getProductImage } from "../utils/imageHelper";

const ProductDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const { colors } = useThemeStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const heartScale = useRef(new Animated.Value(1)).current;

  const { addToCart } = useCartStore();

  const {
    wishlistItems,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlistStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);

        await fetchWishlist();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isWishlisted =
  product &&
  wishlistItems.some((item) => item._id === product._id);

  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.2,
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

  const handleWishlist = async () => {
    try {
      animateHeart();
      if (isWishlisted) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }

      await fetchWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id);
      Alert.alert(
        "Added to Cart",
        `${product.name} has been added to your cart.`,
        [
          {
            text: "Continue Shopping",
          },
          {
            text: "View Cart",
            onPress: () =>
              navigation.navigate("MainTabs", {
                screen: "Cart",
              }),
          },
        ]
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}> 
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}> 
        <Text style={{ color: colors.text }}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}> 
      <View style={styles.imageContainer}>
        <Image
          source={getProductImage(product.image)}
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleWishlist}
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={isWishlisted ? "heart" : "heart-outline"}
              size={28}
              color="red"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.detailsContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.brand, { color: colors.text2 }]}>{product.brand || "PosterHaus Collection"}</Text>
        <Text style={[styles.name, { color: colors.text }]}>{product.name}</Text>
        
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#FBBF24" />
          <Ionicons name="star" size={16} color="#FBBF24" />
          <Ionicons name="star" size={16} color="#FBBF24" />
          <Ionicons name="star" size={16} color="#FBBF24" />
          <Ionicons name="star-half" size={16} color="#FBBF24" />
          <Text style={[styles.ratingText, { color: colors.text }]}>
            {product.rating || "4.8"} ({product.numReviews || "120"} reviews)
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={[styles.stockBadge, { backgroundColor: product.countInStock > 0 ? colors.primary : colors.danger }]}>
            <Text style={styles.stockBadgeText}>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Text>
          </View>
          <Text style={[styles.price, { color: colors.primary }]}>${product.price}</Text>
        </View>
        
        <Text style={[styles.descriptionHeader, { color: colors.text }]}>The Story</Text>
        <Text style={[styles.description, { color: colors.text2 }]}>{product.description}</Text>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            product.countInStock === 0 && styles.buttonDisabled, 
            { backgroundColor: colors.primary }
          ]}
          disabled={product.countInStock === 0}
          onPress={handleAddToCart}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>
            {product.countInStock > 0 ? 'Add to Cart' : 'Sold Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 460,
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  heartButton: {
    position: "absolute",
    top: 45,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
  detailsContainer: {
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -6 },
    shadowRadius: 12,
    elevation: 4,
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  name: {
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 34,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  descriptionHeader: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetails;
