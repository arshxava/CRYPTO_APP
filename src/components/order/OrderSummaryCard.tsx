import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {OrderSummary} from '../../types/Order';
import {Colors} from '@/constants/Colors';
import {Typography} from '@/constants/Typography';
import {Layout} from '@/constants/Layout';

interface OrderSummaryCardProps {
  summary: OrderSummary;
  style?: ViewStyle;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({summary, style}) => {
  const formatCurrency = (amount: string, currency: string = 'USD') => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(numAmount);
  };

  const renderSummaryItem = (
    icon: string,
    title: string,
    value: string | number,
    color: string = Colors.primary,
  ) => (
    <View style={styles.summaryItem}>
      <View style={[styles.iconContainer, {backgroundColor: color}]}>
        <Icon name={icon} size={24} color={Colors.white} />
      </View>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryValue}>{value}</Text>
        <Text style={styles.summaryTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Order Summary</Text>
      
      <View style={styles.summaryGrid}>
        {renderSummaryItem(
          'receipt',
          'Total Orders',
          summary.totalOrders,
          Colors.primary,
        )}
        
        {renderSummaryItem(
          'cash',
          'Total Revenue',
          formatCurrency(summary.totalRevenue),
          Colors.success,
        )}
        
        {renderSummaryItem(
          'trending-up',
          'Average Order',
          formatCurrency(summary.averageOrderValue),
          Colors.info,
        )}
      </View>
      
      {summary.recentOrders.length > 0 && (
        <View style={styles.recentOrdersSection}>
          <Text style={styles.recentOrdersTitle}>Recent Orders</Text>
          {summary.recentOrders.slice(0, 3).map((order, index) => (
            <View key={order.id} style={styles.recentOrderItem}>
              <View style={styles.recentOrderInfo}>
                <Text style={styles.recentOrderNumber}>#{order.order_number}</Text>
                <Text style={styles.recentOrderCustomer}>
                  {order.billing_address.first_name} {order.billing_address.last_name}
                </Text>
              </View>
              <View style={styles.recentOrderAmount}>
                <Text style={styles.recentOrderPrice}>
                  {formatCurrency(order.total_price, order.currency)}
                </Text>
                <View
                  style={[
                    styles.recentOrderStatus,
                    {
                      backgroundColor:
                        order.financial_status === 'paid'
                          ? Colors.success
                          : order.financial_status === 'pending'
                          ? Colors.warning
                          : Colors.error,
                    },
                  ]}>
                  <Text style={styles.recentOrderStatusText}>
                    {order.financial_status.charAt(0).toUpperCase() + 
                     order.financial_status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Layout.spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xl,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recentOrdersSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Layout.spacing.lg,
  },
  recentOrdersTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  recentOrderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  recentOrderInfo: {
    flex: 1,
  },
  recentOrderNumber: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  recentOrderCustomer: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  recentOrderAmount: {
    alignItems: 'flex-end',
  },
  recentOrderPrice: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  recentOrderStatus: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  recentOrderStatusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
});

export default OrderSummaryCard;