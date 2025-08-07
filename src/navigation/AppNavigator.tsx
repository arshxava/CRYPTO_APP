import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';

import {RootState} from '../store/index';
import {RootStackParamList} from '../types/Navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import ProductDetailScreen from '@screens/ProductDetailScreen';
import ProductListScreen from '@screens/ProductListScreen';
import OrderDetailScreen from '@screens/OrderDetailScreen';
import CartScreen from '@screens/CartScreen';
import CheckoutScreen from '@screens/CheckoutScreen';
import ProfileScreen from '@screens/ProfileScreen';
import SettingsScreen from '@screens/SettingsScreen';
import SearchScreen from '@screens/SearchScreen';
import WebViewScreen from '@screens/WebViewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen}
            options={{
              headerShown: true,
              title: 'Product Details',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen 
            name="ProductList" 
            component={ProductListScreen}
            options={{
              headerShown: true,
              title: 'Products',
            }}
          />
          <Stack.Screen 
            name="OrderDetail" 
            component={OrderDetailScreen}
            options={{
              headerShown: true,
              title: 'Order Details',
            }}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
            options={{
              headerShown: true,
              title: 'Shopping Cart',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen}
            options={{
              headerShown: true,
              title: 'Checkout',
            }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              headerShown: true,
              title: 'Profile',
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Settings',
            }}
          />
          <Stack.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
              headerShown: true,
              title: 'Search',
            }}
          />
          <Stack.Screen 
            name="WebView" 
            component={WebViewScreen}
            options={({route}) => ({
              headerShown: true,
              title: route.params.title || 'Web View',
            })}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;