import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';
import api from '../services/api';

const Checkout = ({ navigation }) => {
  const { cartItems, clearCart } = useCartStore();
  const { colors } = useThemeStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [method, setMethod] = useState('Stripe');
  const [loading, setLoading] = useState(false);

  const itemsPrice = cartItems.reduce((a, i) => a + i.qty * i.price, 0);
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

  const payWithStripe = async (orderId) => {
    const { data } = await api.post('/payments/create-intent', { amount: totalPrice });
    const init = await initPaymentSheet({
      paymentIntentClientSecret: data.clientSecret,
      merchantDisplayName: 'My Store',
    });
    if (init.error) throw new Error(init.error.message);
    const result = await presentPaymentSheet();
    if (result.error) throw new Error(result.error.message);
    await api.put(`/payments/${orderId}/confirm`, { paymentIntentId: 'stripe' });
  };

  const placeOrder = async () => {
    if (!address || !city || !postalCode || !country) {
      return Alert.alert('Missing', 'Please fill all shipping details');
    }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: method,
        itemsPrice, taxPrice, shippingPrice, totalPrice,
      });
      if (method === 'Stripe') await payWithStripe(data._id);
      clearCart();
      navigation.replace('OrderSuccess', { orderId: data._id });
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.header, { color: colors.text }]}>Shipping Address</Text>
      {['address','city','postalCode','country'].map((k, i) => {
        const vals = { address, city, postalCode, country };
        const setters = { address: setAddress, city: setCity, postalCode: setPostalCode, country: setCountry };
        return (
          <TextInput
            key={k}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
            placeholderTextColor={colors.muted}
            value={vals[k]}
            onChangeText={setters[k]}
          />
        );
      })}

      <Text style={[styles.header, { color: colors.text, marginTop: 20 }]}>Payment Method</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        {['Stripe', 'CashOnDelivery'].map((m) => (
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
        <Row label="Items" value={itemsPrice} c={colors} />
        <Row label="Shipping" value={shippingPrice} c={colors} />
        <Row label="Tax" value={taxPrice} c={colors} />
        <Row label="Total" value={totalPrice} c={colors} bold />
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={placeOrder} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Place Order</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const Row = ({ label, value, c, bold }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
    <Text style={{ color: bold ? c.text : c.muted, fontWeight: bold ? 'bold' : 'normal', fontSize: bold ? 18 : 16 }}>{label}</Text>
    <Text style={{ color: bold ? c.text : c.muted, fontWeight: bold ? 'bold' : 'normal', fontSize: bold ? 18 : 16 }}>${value.toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { padding: 14, borderRadius: 8, borderWidth: 1, marginBottom: 12, fontSize: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, marginRight: 10 },
  summary: { padding: 20, borderRadius: 8, borderWidth: 1, marginBottom: 20 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  button: { padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 40 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default Checkout;
