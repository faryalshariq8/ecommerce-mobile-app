import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import { useThemeStore } from '../store/themeStore';

const Categories = ({ navigation }) => {
  const { colors } = useThemeStore();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryCard, 
        { 
          backgroundColor: colors.surface, 
          borderColor: colors.border,
          shadowColor: colors.shadow 
        }
      ]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('CategoryProducts', { categoryId: item._id, name: item.name })}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="cover" />
      ) : (
        <View style={[styles.categoryImagePlaceholder, { backgroundColor: colors.secondary }]} />
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
        {item.description && (
          <Text style={[styles.categoryDescription, { color: colors.text2 }]} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <StatusBar barStyle={colors.background === '#FAF6EE' ? 'dark-content' : 'light-content'} />
        <Text style={[styles.header, { color: colors.text }]}>Categories</Text>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            renderItem={renderCategory}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  categoryImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default Categories;
