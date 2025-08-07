import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {Product, ProductVariant} from './Product';
import {Order} from './Order';

// Root Stack Navigator
export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: {product: Product};
  ProductList: {category?: string; title?: string};
  OrderDetail: {orderId: number};
  Cart: undefined;
  Checkout: undefined;
  Profile: undefined;
  Settings: undefined;
  Search: {query?: string};
  WebView: {url: string; title?: string};
  Auth: NavigatorScreenParams<AuthStackParamList>;
};

// Main Tab Navigator (Bottom Tabs)
export type MainTabParamList = {
  Home: undefined;
  Products: undefined;
  Orders: undefined;
  Analytics: undefined;
  More: undefined;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: {token: string};
};

// Drawer Navigator (for More section)
export type DrawerParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  Support: undefined;
  About: undefined;
  Logout: undefined;
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type DrawerScreenProps<T extends keyof DrawerParamList> = 
  CompositeScreenProps<
    NativeStackScreenProps<DrawerParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// Navigation prop types for use in components
export type NavigationProps = RootStackScreenProps<keyof RootStackParamList>['navigation'];
export type RouteProps<T extends keyof RootStackParamList> = RootStackScreenProps<T>['route'];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}