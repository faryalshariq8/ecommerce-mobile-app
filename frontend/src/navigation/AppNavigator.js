import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';

import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import MainTabNavigator from './MainTabNavigator';
import ProductDetails from '../screens/ProductDetails';
import CategoryProducts from '../screens/CategoryProducts';
import Checkout from '../screens/Checkout';
import OrderSuccess from '../screens/OrderSuccess';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userInfo, checkAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setIsReady(true);
    };
    init();
  }, [checkAuth]);

  if (!isReady) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userInfo ? (
          // Main App Screens
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: true, title: 'Product Details' }} />
            <Stack.Screen name="CategoryProducts" component={CategoryProducts} options={{ headerShown: true }} />
            <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: true, title: 'Checkout' }} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccess} />
          </>
        ) : (
          // Auth Screens
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
