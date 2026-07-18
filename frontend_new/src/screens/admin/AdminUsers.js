import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAdminStore } from '../../store/adminStore';
import { useThemeStore } from '../../store/themeStore';

const AdminUsers = () => {
  const { users, loading, fetchUsers, deleteUserAccount, toggleUserAdmin, error } = useAdminStore();
  const { colors } = useThemeStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = (user) => {
    Alert.alert('Delete User', `Are you sure you want to delete ${user.name}?`, [
      { text: 'Cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await deleteUserAccount(user._id);
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        } 
      },
    ]);
  };

  const handleToggleAdmin = async (user) => {
    try {
      await toggleUserAdmin(user._id);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.header, { color: colors.text }]}>Manage Users</Text>
      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}
      {users.length === 0 ? (
        <Text style={[styles.empty, { color: colors.muted }]}>No users found.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                <Text style={{ color: colors.muted }}>{item.email}</Text>
                <Text style={[styles.role, { color: item.isAdmin ? colors.primary : colors.muted }]}>
                  {item.isAdmin ? 'Administrator' : 'Customer'}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.btn, { borderColor: colors.border }]} 
                  onPress={() => handleToggleAdmin(item)}
                >
                  <Text style={{ color: colors.primary, fontSize: 13, fontWeight: 'bold' }}>
                    {item.isAdmin ? 'Demote' : 'Promote'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.deleteBtn, { borderColor: colors.border }]} 
                  onPress={() => confirmDelete(item)}
                >
                  <Text style={{ color: 'red', fontSize: 13, fontWeight: 'bold' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  empty: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginTop: 40 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  role: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  actions: { flexDirection: 'row' },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1 },
});

export default AdminUsers;
