import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import MainTabNavigator from './MainTabNavigator';
import ProductDetails from '../screens/ProductDetails';
import CategoryProducts from '../screens/CategoryProducts';
import Checkout from '../screens/Checkout';
import OrderSuccess from '../screens/OrderSuccess';
import OrderHistory from '../screens/OrderHistory';
import AdminDashboard from '../screens/admin/AdminDashboard';
import AdminProducts from '../screens/admin/AdminProducts';
import AdminProductForm from '../screens/admin/AdminProductForm';
import AdminOrders from '../screens/admin/AdminOrders';
import Wishlist from "../screens/Wishlist";
import ProfileEdit from "../screens/ProfileEdit";
import ForgotPassword from "../screens/ForgotPassword";
import AdminUsers from "../screens/admin/AdminUsers";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userInfo, checkAuth } = useAuthStore();
  const { mode, loadTheme } = useThemeStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      await Promise.all([checkAuth(), loadTheme()]);
      setIsReady(true);
    })();
  }, []);

  if (!isReady) return <Splash />;

  return (
    <NavigationContainer theme={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userInfo ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: true, title: 'Product Details' }} />
            <Stack.Screen name="CategoryProducts" component={CategoryProducts} options={{ headerShown: true }} />
            <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: true, title: 'Checkout' }} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
            <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ headerShown: true, title: 'My Orders' }} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: true, title: 'Admin' }} />
            <Stack.Screen name="AdminProducts" component={AdminProducts} options={{ headerShown: true, title: 'Products' }} />
            <Stack.Screen name="AdminProductForm" component={AdminProductForm} options={{ headerShown: true, title: 'Product Form' }} />
            <Stack.Screen name="AdminOrders" component={AdminOrders} options={{ headerShown: true, title: 'Orders' }} />
            <Stack.Screen name="Wishlist" component={Wishlist} options={{ headerShown: true }} />
            <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{ headerShown: true }} />
            <Stack.Screen name="AdminUsers" component={AdminUsers} options={{ headerShown: true }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
