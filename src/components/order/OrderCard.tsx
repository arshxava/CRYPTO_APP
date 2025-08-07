import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {Order} from '../../types/Order';
import {Colors} from '@/constants/Colors';
import {Typography} from '@/constants/Typography';
import {Layout} from '@/constants/Layout';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
  style?: ViewStyle;
}

const OrderCard: React.FC<OrderCardProps> = ({order, onPress, style}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'refunded':
      case 'voided':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'refunded':
      case 'voided':
        return 'close-circle';
      default:
        return 'ellipse';
    }
  };

  const getFulfillmentStatusColor = (status: string | null) => {
    switch (status) {
      case 'fulfilled':
        return Colors.success;
      case 'partial':
        return Colors.warning;
      case 'restocked':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: string, currency: string = 'USD') => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(numAmount);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>#{order.order_number}</Text>
          <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.status, {backgroundColor: getStatusColor(order.financial_status)}]}>
            <Icon
              name={getStatusIcon(order.financial_status)}
              size={12}
              color={Colors.white}
            />
            <Text style={styles.statusText}>
              {order.financial_status.charAt(0).toUpperCase() + order.financial_status.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>
            {order.billing_address.first_name} {order.billing_address.last_name}
          </Text>
          <Text style={styles.customerEmail}>{order.email}</Text>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Items:</Text>
            <Text style={styles.detailValue}>{order.line_items.length}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total:</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(order.total_price, order.currency)}
            </Text>
          </View>
        </View>

        {order.fulfillment_status && (
          <View style={styles.fulfillmentStatus}>
            <View
              style={[
                styles.fulfillmentBadge,
                {backgroundColor: getFulfillmentStatusColor(order.fulfillment_status)},
              ]}>
              <Text style={styles.fulfillmentText}>
                {order.fulfillment_status.charAt(0).toUpperCase() + 
                 order.fulfillment_status.slice(1)}
              </Text>
            </View>
          </View>
        )}

        {order.line_items.slice(0, 2).map((item, index) => (
          <View key={item.id} style={styles.lineItem}>
            <Text style={styles.lineItemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.lineItemQuantity}>Qty: {item.quantity}</Text>
          </View>
        ))}

        {order.line_items.length > 2 && (
          <Text style={styles.moreItems}>
            +{order.line_items.length - 2} more items
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.viewDetails}>View Details</Text>
        <Icon name="chevron-forward" size={16} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.lg,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  orderDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.full,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    marginLeft: Layout.spacing.xs,
  },
  content: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  customerInfo: {
    marginBottom: Layout.spacing.sm,
  },
  customerName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  customerEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginRight: Layout.spacing.xs,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  fulfillmentStatus: {
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  fulfillmentBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  fulfillmentText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xs,
  },
  lineItemName: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    marginRight: Layout.spacing.sm,
  },
  lineItemQuantity: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  moreItems: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Layout.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.md,
  },
  viewDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    marginRight: Layout.spacing.xs,
  },
});

export default OrderCard;