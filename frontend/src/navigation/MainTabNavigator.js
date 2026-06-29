import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Categories from '../screens/Categories';
import Cart from '../screens/Cart';

// Temporary placeholder for Profile
const DummyScreen = () => null;

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#208AEF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ tabBarLabel: 'Home' }} 
      />
      <Tab.Screen 
        name="Categories" 
        component={Categories} 
        options={{ tabBarLabel: 'Categories' }} 
      />
      <Tab.Screen 
        name="Cart" 
        component={Cart} 
        options={{ tabBarLabel: 'Cart' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={DummyScreen} 
        options={{ tabBarLabel: 'Profile' }} 
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
