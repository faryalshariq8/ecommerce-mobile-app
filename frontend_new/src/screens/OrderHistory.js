import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { useThemeStore } from '../store/themeStore';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useThemeStore();

  useEffect(() => {
    api.get('/orders/myorders')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 15 }}
      data={orders}
      keyExtractor={(i) => i._id}
      ListEmptyComponent={<Text style={{ color: colors.muted, textAlign: 'center', marginTop: 40 }}>No orders yet</Text>}
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.id, { color: colors.text }]}>Order #{item._id.slice(-6)}</Text>
          <Text style={{ color: colors.muted }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <Text style={{ color: colors.text, marginTop: 6 }}>Total: ${item.totalPrice}</Text>
          <Text style={{ color: item.isPaid ? 'green' : 'orange' }}>{item.isPaid ? 'Paid' : 'Pending'}</Text>
          <Text style={{ color: item.isDelivered ? 'green' : 'orange' }}>{item.isDelivered ? 'Delivered' : 'In transit'}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 10, marginBottom: 12 },
  id: { fontSize: 16, fontWeight: 'bold' },
});

export default OrderHistory;
