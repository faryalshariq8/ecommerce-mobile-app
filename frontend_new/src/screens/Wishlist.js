import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';
import { getProductImage } from "../utils/imageHelper";

const Wishlist = ({ navigation }) => {
  const { wishlistItems, loading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { colors } = useThemeStore();

  useEffect(() => {
    fetchWishlist();
}, [fetchWishlist]);

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId);
      await removeFromWishlist(productId);
      Alert.alert("Moved", "Item has been moved to your cart.");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.header, { color: colors.text }]}>My Wishlist</Text>
        {wishlistItems.length === 0 ? (
          <View style={styles.center}>
            <Text style={[styles.emptyIcon, { color: colors.primary }]}>♡</Text>
            <Text style={[styles.emptyText, { color: colors.text }]}>Your wishlist is empty</Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>Browse our latest posters</Text>
          </View>
        ) : (
          <FlatList
            data={wishlistItems}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Image source={getProductImage(item.image)} style={styles.image} />
                <View style={styles.details}>
                  <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
                  <Text style={[styles.price, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: colors.primary }]}
                      onPress={() => handleMoveToCart(item._id)}
                    >
                      <Text style={styles.btnText}>Move to Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.removeBtn, { borderColor: colors.border }]}
                      onPress={() => removeFromWishlist(item._id)}
                    >
                      <Text style={{ color: 'red', fontWeight: 'bold' }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginVertical: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 36 },
  emptyIcon: { fontSize: 42, marginBottom: 12 },
  emptyText: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  emptySubtext: { fontSize: 15, textAlign: 'center' },
  list: { paddingBottom: 40 },
  card: { flexDirection: 'row', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 15 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
  details: { flex: 1, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 15, fontWeight: '600' },
  actions: { flexDirection: 'row', marginTop: 10 },
  btn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 10 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  removeBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
});

export default Wishlist;
