import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {RootState, AppDispatch} from '../store/index';
import {logoutUser} from '../store/slices/authSlice';
import {clearCart} from '../store/slices/cartSlice';
import {clearWishlist} from '../store/slices/wishlistSlice';
import {MainTabScreenProps} from '../types/Navigation';
import {Colors} from '@/constants/Colors';
import {Typography} from '@/constants/Typography';
import {Layout} from '@/constants/Layout';

type MoreScreenProps = MainTabScreenProps<'More'>;

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  showChevron?: boolean;
  color?: string;
}

const MoreScreen: React.FC<MoreScreenProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.totalItems);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.totalItems);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
            dispatch(clearCart());
            dispatch(clearWishlist());
          },
        },
      ],
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      title: 'Profile',
      subtitle: user?.email || 'Manage your account',
      icon: 'person',
      onPress: () => navigation.navigate('Profile'),
      showChevron: true,
    },
    {
      id: 'cart',
      title: 'Shopping Cart',
      subtitle: `${cartItems} items`,
      icon: 'bag',
      onPress: () => navigation.navigate('Cart'),
      showChevron: true,
    },
    {
      id: 'orders',
      title: 'Order History',
      subtitle: 'View your past orders',
      icon: 'receipt',
      onPress: () => navigation.navigate('Orders'),
      showChevron: true,
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and configuration',
      icon: 'settings',
      onPress: () => navigation.navigate('Settings'),
      showChevron: true,
    },
  ];

  const supportItems: MenuItem[] = [
    {
      id: 'support',
      title: 'Customer Support',
      subtitle: 'Get help with your orders',
      icon: 'help-circle',
      onPress: () => navigation.navigate('WebView', {
        url: 'https://thecryptomerchant.com/support',
        title: 'Customer Support',
      }),
      showChevron: true,
    },
    {
      id: 'about',
      title: 'About Us',
      subtitle: 'Learn more about The Crypto Merchant',
      icon: 'information-circle',
      onPress: () => navigation.navigate('WebView', {
        url: 'https://thecryptomerchant.com/about',
        title: 'About Us',
      }),
      showChevron: true,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'How we protect your data',
      icon: 'shield-checkmark',
      onPress: () => navigation.navigate('WebView', {
        url: 'https://thecryptomerchant.com/privacy-policy',
        title: 'Privacy Policy',
      }),
      showChevron: true,
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      subtitle: 'Our terms and conditions',
      icon: 'document-text',
      onPress: () => navigation.navigate('WebView', {
        url: 'https://thecryptomerchant.com/terms-of-service',
        title: 'Terms of Service',
      }),
      showChevron: true,
    },
  ];

  const appItems: MenuItem[] = [
    {
      id: 'logout',
      title: 'Sign Out',
      subtitle: 'Sign out of your account',
      icon: 'log-out',
      onPress: handleLogout,
      showChevron: false,
      color: Colors.error,
    },
  ];

  const renderUserHeader = () => (
    <View style={styles.userHeader}>
      <View style={styles.avatarContainer}>
        <Icon name="person" size={32} color={Colors.white} />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : 'User'}
        </Text>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
      </View>
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={() => navigation.navigate('Profile')}>
        <Icon name="pencil" size={16} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View
          style={[
            styles.menuItemIcon,
            item.color && {backgroundColor: `${item.color}20`},
          ]}>
          <Icon
            name={item.icon}
            size={20}
            color={item.color || Colors.primary}
          />
        </View>
        <View style={styles.menuItemText}>
          <Text
            style={[
              styles.menuItemTitle,
              item.color && {color: item.color},
            ]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      {item.showChevron && (
        <Icon name="chevron-forward" size={16} color={Colors.gray400} />
      )}
    </TouchableOpacity>
  );

  const renderSection = (title: string, items: MenuItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map(renderMenuItem)}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderUserHeader()}
      
      {renderSection('Account', menuItems)}
      {renderSection('Support', supportItems)}
      {renderSection('App', appItems)}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          The Crypto Merchant v1.0.0
        </Text>
        <Text style={styles.footerText}>
          Your trusted hardware wallet partner
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  editProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.sm,
    marginLeft: Layout.spacing.md,
  },
  sectionContent: {
    backgroundColor: Colors.white,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  menuItemSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.md,
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
});

export default MoreScreen;