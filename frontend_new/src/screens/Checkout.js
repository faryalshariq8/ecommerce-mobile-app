import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStripe } from '@stripe/stripe-react-native';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';
import api from '../services/api';

const Checkout = ({ navigation }) => {
  const { cart, fetchCart, clearCart } = useCartStore();
  const { colors } = useThemeStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [method, setMethod] = useState('Stripe');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const cartItems = cart?.items || [];
  const itemsPrice = cartItems.reduce((a, i) => a + i.quantity * i.product.price, 0);
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

  const payWithStripe = async (orderId, amount) => {
    const { data } = await api.post('/payments/create-intent', { amount });
    const init = await initPaymentSheet({
      paymentIntentClientSecret: data.clientSecret,
      merchantDisplayName: 'PosterHaus Store',
    });
    if (init.error) throw new Error(init.error.message);
    const result = await presentPaymentSheet();
    if (result.error) throw new Error(result.error.message);
    await api.put(`/payments/${orderId}/confirm`, { paymentIntentId: 'stripe' });
  };

  const placeOrder = async () => {
    if (!name || !phone || !address || !city) {
      return Alert.alert('Missing Info', 'Please fill all shipping details');
    }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: { name, phone, address, city },
        paymentMethod: method,
      });
      
      if (method === 'Stripe') {
        await payWithStripe(data._id, data.totalPrice);
      }
      
      clearCart();
      navigation.replace('OrderSuccess', { orderId: data._id });
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}> 
      <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}> 
        <Text style={[styles.header, { color: colors.text }]}>Shipping Address</Text>
        {['name', 'phone', 'address', 'city'].map((k) => {
          const vals = { name, phone, address, city };
          const setters = { name: setName, phone: setPhone, address: setAddress, city: setCity };
          const placeholders = { name: 'Full Name', phone: 'Phone Number', address: 'Shipping Address', city: 'City' };
          return (
            <TextInput
              key={k}
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder={placeholders[k]}
              placeholderTextColor={colors.muted}
              value={vals[k]}
              onChangeText={setters[k]}
            />
          );
        })}

        <Text style={[styles.header, { color: colors.text }]}>Payment Method</Text>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {['Stripe', 'Cash on Delivery'].map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMethod(m)}
              style={[
                styles.chip,
                { borderColor: colors.border, backgroundColor: method === m ? colors.primary : colors.card },
              ]}
            >
              <Text style={{ color: method === m ? '#fff' : colors.text }}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.product._id} style={styles.itemRow}>
              <Text style={{ color: colors.text2, flex: 1 }}>{item.product.name} (x{item.quantity})</Text>
              <Text style={{ color: colors.text }}>${(item.product.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row label="Items" value={itemsPrice} c={colors} />
          <Row label="Shipping" value={shippingPrice} c={colors} />
          <Row label="Tax" value={taxPrice} c={colors} />
          <Row label="Total" value={totalPrice} c={colors} bold />
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={placeOrder} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Place Order</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const Row = ({ label, value, c, bold }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
    <Text style={{ color: bold ? c.text : c.muted, fontWeight: bold ? 'bold' : 'normal', fontSize: bold ? 18 : 16 }}>{label}</Text>
    <Text style={{ color: bold ? c.text : c.muted, fontWeight: bold ? 'bold' : 'normal', fontSize: bold ? 18 : 16 }}>${value.toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { padding: 14, borderRadius: 8, borderWidth: 1, marginBottom: 12, fontSize: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, marginRight: 10 },
  summary: { padding: 20, borderRadius: 8, borderWidth: 1, marginBottom: 20 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  divider: { height: 1, marginVertical: 10 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 40 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default Checkout;
