import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {LineChart, BarChart, PieChart} from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';

import {RootState, AppDispatch} from '../store/index';
import {fetchOrderAnalytics, fetchOrderSummary} from '../store/slices/ordersSlice';
import {MainTabScreenProps} from '../types/Navigation';
import {Colors} from '../constants/Colors';
import {Typography} from '../constants/Typography';
import {Layout} from '../constants/Layout';

import LoadingScreen from '../components/common/LoadingScreen';
import AnalyticsCard from '../components/analytics/AnalyticsCard';

const {width} = Dimensions.get('window');

type AnalyticsScreenProps = MainTabScreenProps<'Analytics'>;

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({navigation}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const {
    orderAnalytics,
    orderSummary,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.orders);

  const periods = [
    {key: '7d', label: '7 Days'},
    {key: '30d', label: '30 Days'},
    {key: '90d', label: '90 Days'},
  ];

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      await Promise.all([
        dispatch(fetchOrderAnalytics({
          startDate: startDate.toISOString(),
          endDate,
        })),
        dispatch(fetchOrderSummary()),
      ]);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const handlePeriodChange = (period: '7d' | '30d' | '90d') => {
    setSelectedPeriod(period);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Analytics</Text>
      <TouchableOpacity
        style={styles.exportButton}
        onPress={() => {/* Handle export */}}>
        <Icon name="download-outline" size={24} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {periods.map(period => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.periodButton,
            selectedPeriod === period.key && styles.periodButtonActive,
          ]}
          onPress={() => handlePeriodChange(period.key as any)}>
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === period.key && styles.periodButtonTextActive,
            ]}>
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSummaryCards = () => {
    if (!orderSummary) return null;

    const averageOrderValue = parseFloat(orderSummary.averageOrderValue);
    const totalRevenue = parseFloat(orderSummary.totalRevenue);
    const totalOrders = orderSummary.totalOrders;
    const conversionRate = 3.2; // Mock data

    return (
      <View style={styles.summaryCards}>
        <View style={styles.summaryRow}>
          <AnalyticsCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+12.5%"
            isPositive={true}
            icon="cash"
            style={styles.summaryCard}
          />
          <AnalyticsCard
            title="Total Orders"
            value={totalOrders.toString()}
            change="+8.2%"
            isPositive={true}
            icon="receipt"
            style={styles.summaryCard}
          />
        </View>
        <View style={styles.summaryRow}>
          <AnalyticsCard
            title="Avg Order Value"
            value={`$${averageOrderValue.toFixed(2)}`}
            change="+5.1%"
            isPositive={true}
            icon="trending-up"
            style={styles.summaryCard}
          />
          <AnalyticsCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            change="-0.8%"
            isPositive={false}
            icon="analytics"
            style={styles.summaryCard}
          />
        </View>
      </View>
    );
  };

  const renderRevenueChart = () => {
    if (!orderAnalytics?.dailyOrders) return null;

    const chartData = {
      labels: orderAnalytics.dailyOrders.slice(-7).map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
      }),
      datasets: [
        {
          data: orderAnalytics.dailyOrders.slice(-7).map(item => parseFloat(item.revenue)),
          color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Revenue Trend</Text>
        <LineChart
          data={chartData}
          width={width - 32}
          height={220}
          chartConfig={{
            backgroundColor: Colors.white,
            backgroundGradientFrom: Colors.white,
            backgroundGradientTo: Colors.white,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(108, 117, 125, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: Colors.primary,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  const renderOrdersChart = () => {
    if (!orderAnalytics?.dailyOrders) return null;

    const chartData = {
      labels: orderAnalytics.dailyOrders.slice(-7).map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
      }),
      datasets: [
        {
          data: orderAnalytics.dailyOrders.slice(-7).map(item => item.count),
        },
      ],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Orders</Text>
        <BarChart
          data={chartData}
          width={width - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: Colors.white,
            backgroundGradientFrom: Colors.white,
            backgroundGradientTo: Colors.white,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(108, 117, 125, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
        />
      </View>
    );
  };

  const renderOrderStatusChart = () => {
    if (!orderAnalytics?.ordersByStatus) return null;

    const colors = [Colors.success, Colors.warning, Colors.error, Colors.info];
    const chartData = orderAnalytics.ordersByStatus.map((item, index) => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      count: item.count,
      color: colors[index % colors.length],
      legendFontColor: Colors.textSecondary,
      legendFontSize: 12,
    }));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Orders by Status</Text>
        <PieChart
          data={chartData}
          width={width - 32}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(26, 26, 26, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>
    );
  };

  const renderTopProducts = () => {
    if (!orderAnalytics?.topProducts) return null;

    return (
      <View style={styles.topProductsContainer}>
        <Text style={styles.chartTitle}>Top Products</Text>
        {orderAnalytics.topProducts.slice(0, 5).map((product, index) => (
          <View key={index} style={styles.topProductItem}>
            <View style={styles.topProductRank}>
              <Text style={styles.topProductRankText}>{index + 1}</Text>
            </View>
            <View style={styles.topProductInfo}>
              <Text style={styles.topProductName} numberOfLines={1}>
                {product.product}
              </Text>
              <Text style={styles.topProductStats}>
                {product.quantity} sold • ${parseFloat(product.revenue).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (isLoading && !orderAnalytics) {
    return <LoadingScreen message="Loading analytics..." />;
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {renderPeriodSelector()}
        {renderSummaryCards()}
        {renderRevenueChart()}
        {renderOrdersChart()}
        {renderOrderStatusChart()}
        {renderTopProducts()}
      </ScrollView>
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
  exportButton: {
    padding: Layout.spacing.sm,
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.lg,
    backgroundColor: Colors.white,
  },
  periodButton: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.full,
    marginHorizontal: Layout.spacing.xs,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    fontWeight: Typography.fontWeight.medium,
  },
  periodButtonTextActive: {
    color: Colors.white,
  },
  summaryCards: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  summaryCard: {
    width: '48%',
  },
  chartContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  chart: {
    borderRadius: Layout.borderRadius.md,
  },
  topProductsContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  topProductRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  topProductRankText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  topProductStats: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});

export default AnalyticsScreen;