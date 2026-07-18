import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const ProfileEdit = ({ navigation }) => {
  const { userInfo, updateProfile, isLoading } = useAuthStore();
  const { colors } = useThemeStore();

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    if (!name || !email) {
      return Alert.alert("Required Fields", "Name and email are required.");
    }
    if (password && password !== confirmPassword) {
      return Alert.alert("Password Mismatch", "Passwords do not match.");
    }

    const payload = { name, email };
    if (password) {
      payload.password = password;
    }

    const result = await updateProfile(payload);
    if (result.success) {
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Error", result.error || "Failed to update profile.");
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.header, { color: colors.text }]}>Edit Profile</Text>

        <Text style={[styles.label, { color: colors.text2 }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.muted}
        />

        <Text style={[styles.label, { color: colors.text2 }]}>Email Address</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: colors.text2 }]}>New Password (Optional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          placeholderTextColor={colors.muted}
          secureTextEntry
        />

        <Text style={[styles.label, { color: colors.text2 }]}>Confirm New Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor={colors.muted}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.btn, { backgroundColor: colors.primary }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 25 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 20, fontSize: 16 },
  btn: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileEdit;
