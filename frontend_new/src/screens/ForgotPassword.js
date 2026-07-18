import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../store/themeStore';
import api from '../services/api';

const ForgotPassword = ({ navigation }) => {
  const { colors } = useThemeStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      return Alert.alert("Missing Email", "Please enter your email address.");
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      Alert.alert("Reset Requested", data.message || "Simulated reset instructions sent.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.header, { color: colors.text }]}>Reset Password</Text>
        <Text style={[styles.desc, { color: colors.text2 }]}>
          Enter your email address and we'll simulate sending you a password reset link.
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Email Address"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={[styles.btn, { backgroundColor: colors.primary }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={[styles.backBtnText, { color: colors.primary }]}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  desc: { fontSize: 16, lineHeight: 22, marginBottom: 30, textAlign: 'center' },
  input: { padding: 14, borderRadius: 10, borderWidth: 1, marginBottom: 20, fontSize: 16 },
  btn: { padding: 16, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backBtn: { marginTop: 25, alignItems: 'center' },
  backBtnText: { fontSize: 15, fontWeight: '600' },
});

export default ForgotPassword;
