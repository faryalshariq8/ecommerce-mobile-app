import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAdminStore } from '../../store/adminStore';
import { useThemeStore } from '../../store/themeStore';

const AdminProducts = ({ navigation }) => {
  const { products, loading, fetchProducts, deleteProduct } = useAdminStore();
  const { colors } = useThemeStore();

  useEffect(() => { fetchProducts(); }, []);

  const confirmDelete = (id) =>
    Alert.alert('Delete', 'Delete this product?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(id) },
    ]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AdminProductForm')}
      >
        <Text style={styles.addBtnText}>+ Add Product</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: colors.card }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={{ color: colors.muted }}>${item.price} · Stock: {item.countInStock}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('AdminProductForm', { product: item })}>
              <Text style={{ color: colors.primary, marginRight: 12 }}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item._id)}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  addBtn: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 8, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '600' },
});

export default AdminProducts;
