import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeStore } from '../../store/themeStore';

const AdminDashboard = ({ navigation }) => {
  const { colors } = useThemeStore();
  const tiles = [
    { label: 'Manage Products', screen: 'AdminProducts' },
    { label: 'Manage Orders', screen: 'AdminOrders' },
    { label: 'Add Product', screen: 'AdminProductForm' },
  ];
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.header, { color: colors.text }]}>Admin Dashboard</Text>
      {tiles.map((t) => (
        <TouchableOpacity
          key={t.screen}
          style={[styles.tile, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate(t.screen)}
        >
          <Text style={[styles.tileText, { color: colors.text }]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  tile: { padding: 20, borderRadius: 10, marginBottom: 12 },
  tileText: { fontSize: 18, fontWeight: '600' },
});

export default AdminDashboard;
