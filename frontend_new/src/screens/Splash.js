import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { useThemeStore } from '../store/themeStore';

const Splash = ({ navigation }) => {
  const { colors } = useThemeStore();

  useEffect(() => {
    // Navigate to Onboarding after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#FAF6EE' ? 'dark-content' : 'light-content'} />
      <View style={styles.brandingContainer}>
        <Text style={[styles.brandText, { color: colors.text }]}>PosterHaus</Text>
        <View style={[styles.divider, { backgroundColor: colors.primary }]} />
        <Text style={[styles.subText, { color: colors.text2 }]}>CURATED ART GALLERY</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingContainer: {
    alignItems: 'center',
  },
  brandText: {
    fontSize: 42,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  divider: {
    width: 40,
    height: 2,
    marginVertical: 12,
  },
  subText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 4,
  },
});

export default Splash;
