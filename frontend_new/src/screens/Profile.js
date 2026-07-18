import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const Profile = ({ navigation }) => {
  const { userInfo, logout } = useAuthStore();
  const { colors, mode, toggle } = useThemeStore();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}> 
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.header, { color: colors.text }]}>Profile</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.name, { color: colors.text }]}>{userInfo?.name}</Text>
          <Text style={{ color: colors.muted }}>{userInfo?.email}</Text>
        </View>

      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate('OrderHistory')}
      >
        <Text style={[styles.rowText, { color: colors.text }]}>My Orders</Text>
      </TouchableOpacity>

    <TouchableOpacity
    style={[
        styles.row,
        { backgroundColor: colors.card }
    ]}
    onPress={() =>
        navigation.navigate("Wishlist")
    }
>
    <Text
        style={[
            styles.rowText,
            { color: colors.text }
        ]}
    >
        My Wishlist
    </Text>
    </TouchableOpacity>

    <TouchableOpacity
        style={[
            styles.row,
            { backgroundColor: colors.card }
        ]}
        onPress={() =>
            navigation.navigate("ProfileEdit")
        }
    >
        <Text
            style={[
                styles.rowText,
                { color: colors.text }
            ]}
        >
            Edit Profile
        </Text>
    </TouchableOpacity>

      <View style={[styles.row, { backgroundColor: colors.card }]}>
        <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
        <Switch value={mode === 'dark'} onValueChange={toggle} />
      </View>

      {userInfo?.isAdmin && (
        <TouchableOpacity
          style={[styles.row, { backgroundColor: colors.card }]}
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Text style={[styles.rowText, { color: colors.primary }]}>Admin Dashboard</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.logout, { backgroundColor: colors.primary }]} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  card: { padding: 20, borderRadius: 10, marginBottom: 20 },
  name: { fontSize: 22, fontWeight: 'bold' },
  row: { padding: 16, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { fontSize: 16 },
  logout: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default Profile;
