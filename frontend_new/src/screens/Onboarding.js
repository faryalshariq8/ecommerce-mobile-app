import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useThemeStore } from '../store/themeStore';

const Onboarding = ({ navigation }) => {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#FAF6EE' ? 'dark-content' : 'light-content'} />
      
      <View style={styles.content}>
        <Text style={[styles.welcome, { color: colors.primary }]}>WELCOME TO</Text>
        <Text style={[styles.title, { color: colors.text }]}>PosterHaus</Text>
        <Text style={[styles.subtitle, { color: colors.text2 }]}>
          Discover museum-quality posters curated to elevate your space. From mid-century jazz to minimalist architecture.
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Enter Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 30,
    paddingVertical: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 40,
  },
  welcome: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    marginBottom: 20,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
    color: '#666',
    maxWidth: '90%',
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default Onboarding;
