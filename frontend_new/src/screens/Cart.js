import React, { useEffect } from 'react';
import { Image } from "react-native";
import { getProductImage } from "../utils/imageHelper";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';

const Cart = ({ navigation }) => {
  const {
    cart,
    fetchCart,
    removeItem,
    updateQuantity,
  } = useCartStore();
  const { colors } = useThemeStore();
  const insets = useSafeAreaInsets();
    useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  const increaseQty = (item) => {
    updateQuantity(item.product._id, item.quantity + 1);
  };

  const decreaseQty = (item) => {
    if (item.quantity === 1) {
      removeItem(item.product._id);
    } else {
      updateQuantity(item.product._id, item.quantity - 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.card, shadowColor: colors.text }]}> 
      <Image
        source={getProductImage(item.product.image)}
        style={styles.itemImagePlaceholder}
      />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {item.product.name}
        </Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => decreaseQty(item)}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>
            {item.quantity}
          </Text>

          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => increaseQty(item)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.itemPrice}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const totalAmount = (cart?.items || [])
    .reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    )
    .toFixed(2);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}> 
      <View style={[styles.container, { backgroundColor: colors.bg }]}> 
        <Text style={[styles.header, { color: colors.text }]}>Shopping Cart</Text>
        
        {cart?.items?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyIcon, { color: colors.primary }]}>🛒</Text>
            <Text style={[styles.emptyText, { color: colors.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>Browse our latest posters</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cart?.items || []}
              keyExtractor={(item) => item.product._id}
              renderItem={renderItem}
              contentContainerStyle={{
                paddingBottom: 250,   // more space
              }}
            />
            <View
                style={[
                    styles.checkoutContainer,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        paddingBottom: insets.bottom + 20,
                    },
                ]}
            >
              <Text style={[styles.totalText, { color: colors.text }]}>Total: ${totalAmount}</Text>
              <TouchableOpacity
                style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#208AEF',
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 10,
  },
  removeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: 'center',
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    marginHorizontal: 14,
    fontSize: 16,
    fontWeight: "600",
  },
  checkoutContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderTopWidth: 1,
      borderColor: '#e0e0e0',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 85,     // <- THIS is the important fix
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  checkoutButton: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default Cart;
