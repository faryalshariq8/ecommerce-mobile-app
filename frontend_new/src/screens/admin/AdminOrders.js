import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAdminStore } from '../../store/adminStore';
import { useThemeStore } from '../../store/themeStore';

const AdminOrders = () => {
  const { orders, loading, fetchOrders, markDelivered } = useAdminStore();
  const { colors } = useThemeStore();

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 15 }}
      data={orders}
      keyExtractor={(i) => i._id}
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.id, { color: colors.text }]}>#{item._id.slice(-6)}</Text>
          <Text style={{ color: colors.muted }}>{item.user?.name} · {item.user?.email}</Text>
          <Text style={{ color: colors.text, marginTop: 6 }}>Total: ${item.totalPrice}</Text>
          <Text style={{ color: item.isPaid ? 'green' : 'orange' }}>
            {item.isPaid ? 'Paid' : 'Pending payment'}
          </Text>
          <Text style={{ color: item.isDelivered ? 'green' : 'orange' }}>
            {item.isDelivered ? `Delivered ${new Date(item.deliveredAt).toLocaleDateString()}` : 'Not delivered'}
          </Text>
          {!item.isDelivered && (
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary }]}
              onPress={() => markDelivered(item._id)}
            >
              <Text style={styles.btnText}>Mark Delivered</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 10, marginBottom: 12 },
  id: { fontSize: 16, fontWeight: 'bold' },
  btn: { padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default AdminOrders;
