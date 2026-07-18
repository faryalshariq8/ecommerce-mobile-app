import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import Categories from '../screens/Categories';
import Cart from '../screens/Cart';
import Profile from '../screens/Profile';
import { useThemeStore } from '../store/themeStore';
const Tab = createBottomTabNavigator();
export default function MainTabNavigator() {
    const { colors } = useThemeStore();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    height: 70,
                    backgroundColor: colors.surface,
                    borderTopWidth: 0,
                    elevation: 15,
                    shadowOpacity: .1,
                    position: 'absolute',
                    left: 15,
                    right: 15,
                    bottom: 15,
                    borderRadius: 20,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.text2,
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 8,
                },
                tabBarIcon: ({ color, size }) => {
                    let icon;
                    switch(route.name){
                        case "Home":
                            icon="home";
                            break;
                        case "Categories":
                            icon="grid";
                            break;
                        case "Cart":
                            icon="cart";
                            break;
                        case "Profile":
                            icon="person";
                            break;
                    }
                    return (
                        <Ionicons
                            name={icon}
                            color={color}
                            size={24}
                        />
                    );
                }
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
            />
            <Tab.Screen
                name="Categories"
                component={Categories}
            />
            <Tab.Screen
                name="Cart"
                component={Cart}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
            />
        </Tab.Navigator>
    );
}