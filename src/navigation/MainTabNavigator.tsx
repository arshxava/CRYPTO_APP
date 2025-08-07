import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {MainTabParamList} from '../types/Navigation';
import {RootState} from '../store/index';
import {Colors} from '@/constants/Colors';
import {Typography} from '@/constants/Typography';

import HomeScreen from '@screens/HomeScreen';
import ProductsScreen from '@screens/ProductsScreen';
import OrdersScreen from '@screens/OrdersScreen';
import AnalyticsScreen from '@screens/AnalyticsScreen';
import MoreScreen from '@screens/MoreScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const cartItemsCount = useSelector((state: RootState) => state.cart.totalItems);
  
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Products':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Orders':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            case 'More':
              iconName = focused ? 'menu' : 'menu-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: Typography.fontSize.xs,
          fontWeight: Typography.fontWeight.medium,
        },
        headerStyle: {
          backgroundColor: Colors.headerBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          color: Colors.headerText,
          fontSize: Typography.fontSize.lg,
          fontWeight: Typography.fontWeight.semibold,
        },
        headerTintColor: Colors.headerText,
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'The Crypto Merchant',
          headerShown: true,
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{
          title: 'Hardware Wallets',
          headerShown: true,
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          title: 'Orders',
          headerShown: true,
          tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.error,
            color: Colors.white,
            fontSize: Typography.fontSize.xs,
            minWidth: 18,
            height: 18,
          },
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
          headerShown: true,
        }}
      />
      <Tab.Screen 
        name="More" 
        component={MoreScreen}
        options={{
          title: 'More',
          headerShown: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;