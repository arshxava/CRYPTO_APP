import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

import {RootState, AppDispatch} from '../store/index';
import {fetchFeaturedProducts, fetchBestSellers, fetchNewArrivals} from '../store/slices/productsSlice';
import {Colors} from '../constants/Colors';
import {Typography} from '../constants/Typography';
import {Layout} from '../constants/Layout';
import {MainTabScreenProps} from '../types/Navigation';

import LoadingScreen from '../components/common/LoadingScreen';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import TestimonialCard from '../components/home/TestimonialCard';

const {width} = Dimensions.get('window');

type HomeScreenProps = MainTabScreenProps<'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  
  const {
    featuredProducts,
    bestSellers,
    newArrivals,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.products);

  const cartItems = useSelector((state: RootState) => state.cart.totalItems);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      await Promise.all([
        dispatch(fetchFeaturedProducts()),
        dispatch(fetchBestSellers()),
        dispatch(fetchNewArrivals()),
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    navigation.navigate('Search');
  };

  const handleCart = () => {
    navigation.navigate('Cart');
  };

  const handleViewAllProducts = (category?: string) => {
    navigation.navigate('ProductList', {category, title: category || 'All Products'});
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetail', {product});
  };

  if (isLoading && featuredProducts.length === 0) {
    return <LoadingScreen message="Loading The Crypto Merchant..." />;
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerText}>Free 2-4 day shipping on all U.S Orders</Text>
        <Text style={styles.phoneNumber}>US: 386 222 2954</Text>
      </View>
      <View style={styles.headerMain}>
        <Text style={styles.logoText}>CRYPTO MERCHANT</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSearch}>
            <Icon name="search" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleCart}>
            <Icon name="bag-outline" size={24} color={Colors.text} />
            {cartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHeroBanner = () => (
    <HeroBanner
      title="The Crypto Merchant Your Trusted Partner!"
      subtitle="Industry leading hardware wallets. Never let your crypto assets slip away"
      description="As a leading online platform dedicated to all things crypto, The Crypto Merchant offers an extensive range of hardware wallets. Our commitment to security and customer satisfaction makes us an ideal choice for purchasing crypto hardware wallets."
      buttonText="Shop Now"
      onButtonPress={() => handleViewAllProducts()}
      backgroundImage="https://cdn.shopify.com/s/files/1/0234/5678/files/hero-banner.jpg"
    />
  );

  const renderSecuritySection = () => (
    <View style={styles.securitySection}>
      <LinearGradient
        colors={[Colors.primary, Colors.gray800]}
        style={styles.securityGradient}>
        <View style={styles.securityContent}>
          <Icon name="shield-checkmark" size={48} color={Colors.white} />
          <Text style={styles.securityTitle}>Security, Privacy, Peace of Mind.</Text>
          <Text style={styles.securityDescription}>
            Experience utmost security through TheCryptoMerchant.com: your reliable destination for fortifying your cryptocurrency investments. As an authorized distributor of Trezor hardware wallets, we hold the safety of your digital assets as paramount.
          </Text>
          <Button
            title="Shop Now"
            onPress={() => handleViewAllProducts('Trezor')}
            variant="outline"
            style={styles.securityButton}
            textStyle={{color: Colors.white}}
          />
        </View>
      </LinearGradient>
    </View>
  );

  const renderUSADistributorSection = () => (
    <View style={styles.distributorSection}>
      <View style={styles.distributorContent}>
        <Icon name="location" size={48} color={Colors.primary} />
        <Text style={styles.distributorTitle}>USA Distributor</Text>
        <Text style={styles.distributorDescription}>
          Discover peace of mind with TheCryptoMerchant.com, your premier destination for securing your cryptocurrency investments. As an authorized distributor of Secux hardware wallets, we prioritize your crypto safety above all else.
        </Text>
        <Button
          title="Shop Now"
          onPress={() => handleViewAllProducts('SecuX')}
          variant="primary"
          style={styles.distributorButton}
        />
      </View>
      <Image
        source={{uri: 'https://cdn.shopify.com/s/files/1/0234/5678/files/usa-flag.png'}}
        style={styles.distributorImage}
      />
    </View>
  );

  const renderBrandLogos = () => (
    <View style={styles.brandLogosSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandLogosContainer}>
        {[
          'trezor', 'ledger', 'bitbox', 'keepkey', 'arculus', 'billfodl',
          'cryptotag', 'ellipal', 'onekey', 'secux', 'tangem', 'coolwallet'
        ].map((brand, index) => (
          <TouchableOpacity
            key={index}
            style={styles.brandLogo}
            onPress={() => handleViewAllProducts(brand)}>
            <Image
              source={{uri: `https://cdn.shopify.com/s/files/1/0234/5678/files/${brand}-logo.png`}}
              style={styles.brandLogoImage}
              defaultSource={undefined}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProductSection = (title: string, products: any[], onViewAll: () => void) => (
    <View style={styles.productSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}>
        {products.slice(0, 10).map((product, index) => (
          <ProductCard
            key={product.id || index}
            product={product}
            onPress={() => handleProductPress(product)}
            style={styles.productCard}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderGuaranteeSection = () => (
    <View style={styles.guaranteeSection}>
      <Text style={styles.guaranteeSectionTitle}>The Crypto Merchant Guarantee</Text>
      <Text style={styles.guaranteeSectionSubtitle}>Our U.S. based team of crypto experts has your back.</Text>
      
      <View style={styles.guaranteeGrid}>
        {[
          {
            icon: 'checkmark-circle',
            title: '1. Authorized Retailer',
            description: 'All wallets are brand new, sourced directly from our partners, and verified secure.',
          },
          {
            icon: 'airplane',
            title: '2. Free 2-4 day shipping',
            description: 'Free 2-4 day USA shipping with tracking on all orders.',
          },
          {
            icon: 'return-up-back',
            title: '3. 30 day returns',
            description: 'No hassle 30 day returns on unopened packages.',
          },
          {
            icon: 'people',
            title: '4. Dedicated Service',
            description: 'Questions? Our U.S.-based team is ready to assist you with dedicated support via email.',
          },
        ].map((item, index) => (
          <View key={index} style={styles.guaranteeItem}>
            <Icon name={item.icon} size={32} color={Colors.primary} />
            <Text style={styles.guaranteeItemTitle}>{item.title}</Text>
            <Text style={styles.guaranteeItemDescription}>{item.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTestimonialsSection = () => (
    <View style={styles.testimonialsSection}>
      <Text style={styles.sectionTitle}>See What People Are Saying</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.testimonialsContainer}>
        {[
          {
            name: 'Milton Pozo',
            review: 'I bought a trezor wallet which is very useful to store my cryptocurrencies. They were very friendly and helpful during their customer service.',
            rating: 5,
          },
          {
            name: 'Tyler Pingleton',
            review: 'Good price, fast delivery and friendly customer service. Got an email to make sure I was able to setup my hardware wallet and see if I had questions.',
            rating: 5,
          },
          {
            name: 'Thomas Perham',
            review: 'My hardware wallet was delivered quickly and securely. When my product arrived, they helped me via phone support set up my device and transfer my various cryptocurrencies onto the device. Would highly recommend',
            rating: 5,
          },
          {
            name: 'John Ounjian',
            review: 'My go-to crypto shop. Great customer service and helpful at every step, got my hardware wallets and very cool apparels. Highly recommend them.',
            rating: 5,
          },
          {
            name: 'Jimmy Li',
            review: 'My order arrived quickly and I am enjoying my Trezor, didn\'t need any help but would buy my next wallet from The Crypto Merchant in a heartbeat.',
            rating: 5,
          },
        ].map((testimonial, index) => (
          <TestimonialCard
            key={index}
            name={testimonial.name}
            review={testimonial.review}
            rating={testimonial.rating}
            style={styles.testimonialCard}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderWhyHardwareWalletSection = () => (
    <View style={styles.whySection}>
      <Text style={styles.sectionTitle}>Why Get A Hardware Wallet?</Text>
      <Button
        title="All Wallets"
        onPress={() => handleViewAllProducts()}
        variant="outline"
        style={styles.allWalletsButton}
      />
      
      <View style={styles.whyGrid}>
        {[
          {
            icon: 'shield-checkmark',
            title: 'Secure Your Future.',
            description: 'Keeping your cryptocurrency on a software wallet or exchange puts your holdings at risk. For cryptocurrency merchants, getting a hardware wallet is the only way to outsmart hackers and avoid losing assets.',
          },
          {
            icon: 'eye-off',
            title: 'Total Privacy.',
            description: 'With a hardware wallet, your private keys remain completely offline, making it a top choice for any wallet merchant. Even when sending and receiving transactions, your information remains sealed off from your computer and the internet.',
          },
          {
            icon: 'key',
            title: 'Peace of Mind.',
            description: 'If your wallet falls into the hands of a third party, full encryption of your data via PIN numbers and other additional layers of security prevents them from ever accessing your funds.',
          },
        ].map((item, index) => (
          <View key={index} style={styles.whyItem}>
            <Icon name={item.icon} size={48} color={Colors.primary} />
            <Text style={styles.whyItemTitle}>{item.title}</Text>
            <Text style={styles.whyItemDescription}>{item.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {renderHeader()}
      {renderHeroBanner()}
      {renderSecuritySection()}
      {renderUSADistributorSection()}
      {renderBrandLogos()}
      
      {featuredProducts.length > 0 && renderProductSection(
        'Customer Favorites',
        featuredProducts,
        () => handleViewAllProducts('featured')
      )}
      
      {renderGuaranteeSection()}
      
      {bestSellers.length > 0 && renderProductSection(
        'Bundle Deals',
        bestSellers,
        () => handleViewAllProducts('bundles')
      )}
      
      {renderTestimonialsSection()}
      {renderWhyHardwareWalletSection()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    backgroundColor: Colors.gray100,
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  phoneNumber: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  headerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  logo: {
    width: 180,
    height: 40,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Layout.spacing.sm,
    marginLeft: Layout.spacing.sm,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  securitySection: {
    marginVertical: Layout.spacing.lg,
  },
  securityGradient: {
    padding: Layout.spacing.xl,
  },
  securityContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  securityTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
    marginVertical: Layout.spacing.md,
  },
  securityDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
    lineHeight: 24,
  },
  securityButton: {
    borderColor: Colors.white,
  },
  distributorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xl,
    backgroundColor: Colors.surface,
  },
  distributorContent: {
    flex: 1,
    paddingRight: Layout.spacing.md,
  },
  distributorTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginVertical: Layout.spacing.md,
  },
  distributorDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.lg,
    lineHeight: 24,
  },
  distributorButton: {
    alignSelf: 'flex-start',
  },
  distributorImage: {
    width: 120,
    height: 80,
    resizeMode: 'contain',
  },
  brandLogosSection: {
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.white,
  },
  brandLogosContainer: {
    paddingHorizontal: Layout.spacing.md,
  },
  brandLogo: {
    marginRight: Layout.spacing.md,
    padding: Layout.spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Layout.borderRadius.md,
  },
  brandLogoImage: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  productSection: {
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  viewAllText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  productsContainer: {
    paddingLeft: Layout.spacing.md,
  },
  productCard: {
    marginRight: Layout.spacing.md,
    width: Layout.productCard.width,
  },
  guaranteeSection: {
    padding: Layout.spacing.xl,
    backgroundColor: Colors.surface,
  },
  guaranteeSectionTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  guaranteeSectionSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  guaranteeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  guaranteeItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
    padding: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guaranteeItemTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginVertical: Layout.spacing.sm,
  },
  guaranteeItemDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  testimonialsSection: {
    paddingVertical: Layout.spacing.xl,
    backgroundColor: Colors.white,
  },
  testimonialsContainer: {
    paddingLeft: Layout.spacing.md,
  },
  testimonialCard: {
    marginRight: Layout.spacing.md,
    width: width * 0.8,
  },
  whySection: {
    padding: Layout.spacing.xl,
    backgroundColor: Colors.surface,
  },
  allWalletsButton: {
    alignSelf: 'center',
    marginVertical: Layout.spacing.lg,
  },
  whyGrid: {
    marginTop: Layout.spacing.lg,
  },
  whyItem: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
    padding: Layout.spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whyItemTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginVertical: Layout.spacing.md,
  },
  whyItemDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;