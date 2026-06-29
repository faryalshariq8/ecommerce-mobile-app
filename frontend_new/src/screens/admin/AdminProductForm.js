import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAdminStore } from '../../store/adminStore';
import { useThemeStore } from '../../store/themeStore';
import api from '../../services/api';

const AdminProductForm = ({ route, navigation }) => {
  const editing = route.params?.product;
  const { createProduct, updateProduct } = useAdminStore();
  const { colors } = useThemeStore();

  const [form, setForm] = useState({
    name: '', price: '', brand: '', category: '',
    countInStock: '', description: '', image: 'no-photo.jpg',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
    if (editing) {
      setForm({
        name: editing.name, price: String(editing.price), brand: editing.brand,
        category: editing.category?._id || editing.category,
        countInStock: String(editing.countInStock),
        description: editing.description, image: editing.image,
      });
    }
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.price || !form.category) {
      return Alert.alert('Missing fields', 'Name, price and category are required');
    }
    const payload = {
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock || 0),
    };
    try {
      if (editing) await updateProduct(editing._id, payload);
      else await createProduct(payload);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  const field = (label, key, opts = {}) => (
    <>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={form[key]}
        onChangeText={(t) => set(key, t)}
        placeholderTextColor={colors.muted}
        {...opts}
      />
    </>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.header, { color: colors.text }]}>
        {editing ? 'Edit Product' : 'Add Product'}
      </Text>
      {field('Name', 'name')}
      {field('Brand', 'brand')}
      {field('Price', 'price', { keyboardType: 'numeric' })}
      {field('Stock', 'countInStock', { keyboardType: 'numeric' })}
      {field('Image URL', 'image')}
      {field('Description', 'description', { multiline: true, numberOfLines: 4 })}

      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <View style={styles.catRow}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c._id}
            onPress={() => set('category', c._id)}
            style={[
              styles.catChip,
              { borderColor: colors.border, backgroundColor: form.category === c._id ? colors.primary : colors.card },
            ]}
          >
            <Text style={{ color: form.category === c._id ? '#fff' : colors.text }}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={submit}>
        <Text style={styles.btnText}>{editing ? 'Update' : 'Create'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 6, marginTop: 10 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1, fontSize: 16 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8, marginBottom: 8 },
  btn: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AdminProductForm;
