import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import api from '../services/api';
import { useThemeStore } from '../store/themeStore';
import PosterCard from '../components/PosterCard';

const CategoryProducts = ({ route, navigation }) => {
  const { categoryId, name } = route.params;
  const { colors } = useThemeStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: name });
    
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products?category=${categoryId}`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, name, navigation]);

  const renderProduct = ({ item }) => (
    <PosterCard 
      poster={item} 
      navigation={navigation} 
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <StatusBar barStyle={colors.background === '#FAF6EE' ? 'dark-content' : 'light-content'} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.emptyText, { color: colors.text2 }]}>No products found in this category.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  }
});

export default CategoryProducts;
