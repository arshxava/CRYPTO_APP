import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {RootState, AppDispatch} from '../store/index';
import {fetchOrders, fetchOrderSummary} from '../store/slices/ordersSlice';
import {MainTabScreenProps} from '../types/Navigation';
import {Order} from '../types/Order';
import {Colors} from '../constants/Colors';
import {Typography} from '../constants/Typography';
import {Layout} from '../constants/Layout';

import LoadingScreen from '../components/common/LoadingScreen';
import OrderCard from '../components/order/OrderCard';
import OrderSummaryCard from '../components/order/OrderSummaryCard';

type OrdersScreenProps = MainTabScreenProps<'Orders'>;

const OrdersScreen: React.FC<OrdersScreenProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    orders,
    orderSummary,
    isLoading,
    error,
    currentPage,
    hasMore,
  } = useSelector((state: RootState) => state.orders);

  const statusFilters = [
    {key: 'all', label: 'All Orders', count: orders.length},
    {key: 'pending', label: 'Pending', count: orders.filter(o => o.financial_status === 'pending').length},
    {key: 'paid', label: 'Paid', count: orders.filter(o => o.financial_status === 'paid').length},
    {key: 'fulfilled', label: 'Fulfilled', count: orders.filter(o => o.fulfillment_status === 'fulfilled').length},
    {key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.cancelled_at).length},
  ];

  useEffect(() => {
    loadOrders();
    loadOrderSummary();
  }, [selectedStatus]);

  const loadOrders = async (page = 1, append = false) => {
    try {
      const status = selectedStatus === 'all' ? undefined : selectedStatus;
      await dispatch(fetchOrders({page, status, append}));
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadOrderSummary = async () => {
    try {
      await dispatch(fetchOrderSummary());
    } catch (error) {
      console.error('Error loading order summary:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadOrders(1, false), loadOrderSummary()]);
    setRefreshing(false);
  };

  const loadMoreOrders = async () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      await loadOrders(currentPage + 1, true);
      setLoadingMore(false);
    }
  };

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', {orderId: order.id});
  };

  const handleStatusFilterPress = (status: string) => {
    setSelectedStatus(status);
  };

  const getFilteredOrders = () => {
    if (selectedStatus === 'all') return orders;
    
    switch (selectedStatus) {
      case 'pending':
        return orders.filter(order => order.financial_status === 'pending');
      case 'paid':
        return orders.filter(order => order.financial_status === 'paid');
      case 'fulfilled':
        return orders.filter(order => order.fulfillment_status === 'fulfilled');
      case 'cancelled':
        return orders.filter(order => order.cancelled_at);
      default:
        return orders;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Orders</Text>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('Search')}>
        <Icon name="search" size={24} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderOrderSummary = () => {
    if (!orderSummary) return null;
    
    return (
      <OrderSummaryCard
        summary={orderSummary}
        style={styles.summaryCard}
      />
    );
  };

  const renderStatusFilters = () => (
    <View style={styles.statusFilters}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusFiltersContainer}>
        {statusFilters.map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.statusFilter,
              selectedStatus === filter.key && styles.statusFilterActive,
            ]}
            onPress={() => handleStatusFilterPress(filter.key)}>
            <Text
              style={[
                styles.statusFilterText,
                selectedStatus === filter.key && styles.statusFilterTextActive,
              ]}>
              {filter.label}
            </Text>
            <Text
              style={[
                styles.statusFilterCount,
                selectedStatus === filter.key && styles.statusFilterCountActive,
              ]}>
              {filter.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderOrderItem = ({item}: {item: Order}) => (
    <OrderCard
      order={item}
      onPress={() => handleOrderPress(item)}
      style={styles.orderCard}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>Loading more orders...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="receipt-outline" size={64} color={Colors.gray400} />
      <Text style={styles.emptyStateTitle}>No orders found</Text>
      <Text style={styles.emptyStateDescription}>
        {selectedStatus === 'all'
          ? 'You haven\'t placed any orders yet'
          : `No ${selectedStatus} orders found`}
      </Text>
    </View>
  );

  if (isLoading && orders.length === 0) {
    return <LoadingScreen message="Loading orders..." />;
  }

  const filteredOrders = getFilteredOrders();

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreOrders}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View>
            {renderOrderSummary()}
            {renderStatusFilters()}
          </View>
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        contentContainerStyle={styles.ordersList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  searchButton: {
    padding: Layout.spacing.sm,
  },
  summaryCard: {
    margin: Layout.spacing.md,
  },
  statusFilters: {
    backgroundColor: Colors.white,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusFiltersContainer: {
    paddingHorizontal: Layout.spacing.md,
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.full,
    marginRight: Layout.spacing.sm,
    backgroundColor: Colors.white,
  },
  statusFilterActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusFilterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    marginRight: Layout.spacing.xs,
  },
  statusFilterTextActive: {
    color: Colors.white,
  },
  statusFilterCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    backgroundColor: Colors.gray200,
    borderRadius: 10,
    paddingHorizontal: Layout.spacing.xs,
    paddingVertical: 2,
    minWidth: 20,
    textAlign: 'center',
  },
  statusFilterCountActive: {
    color: Colors.primary,
    backgroundColor: Colors.white,
  },
  ordersList: {
    paddingBottom: Layout.spacing.xl,
  },
  orderCard: {
    marginHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  loadingFooter: {
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing['3xl'],
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  emptyStateDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default OrdersScreen;