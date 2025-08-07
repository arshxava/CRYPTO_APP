import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {shopifyAPI} from '@services/shopifyAPI';
import {Order, OrderSummary, OrderAnalytics} from '@types/Order';

export interface OrdersState {
  orders: Order[];
  orderSummary: OrderSummary | null;
  orderAnalytics: OrderAnalytics | null;
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

const initialState: OrdersState = {
  orders: [],
  orderSummary: null,
  orderAnalytics: null,
  currentOrder: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: true,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: {page?: number; append?: boolean; status?: string}, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getOrders({
        page: params.page || 1,
        limit: 20,
        status: params.status,
      });
      return {
        ...response.data,
        append: params.append || false,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: number, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getOrder(orderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.createOrder(orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (params: {orderId: number; updateData: any}, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.updateOrder(params.orderId, params.updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: number, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.cancelOrder(orderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

export const fetchOrderSummary = createAsyncThunk(
  'orders/fetchOrderSummary',
  async (_, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getOrderSummary();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order summary');
    }
  }
);

export const fetchOrderAnalytics = createAsyncThunk(
  'orders/fetchOrderAnalytics',
  async (params: {startDate?: string; endDate?: string}, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.getOrderAnalytics(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order analytics');
    }
  }
);

export const fulfillOrder = createAsyncThunk(
  'orders/fulfillOrder',
  async (params: {orderId: number; fulfillmentData: any}, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.fulfillOrder(params.orderId, params.fulfillmentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fulfill order');
    }
  }
);

export const refundOrder = createAsyncThunk(
  'orders/refundOrder',
  async (params: {orderId: number; refundData: any}, {rejectWithValue}) => {
    try {
      const response = await shopifyAPI.refundOrder(params.orderId, params.refundData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refund order');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrders: (state) => {
      state.orders = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        const {orders, totalPages, currentPage, append} = action.payload;
        
        if (append) {
          state.orders = [...state.orders, ...orders];
        } else {
          state.orders = orders;
        }
        
        state.currentPage = currentPage;
        state.totalPages = totalPages;
        state.hasMore = currentPage < totalPages;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Order By ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.order;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload.order);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Order
    builder
      .addCase(updateOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order;
        const index = state.orders.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.currentOrder?.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Cancel Order
    builder
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const cancelledOrder = action.payload.order;
        const index = state.orders.findIndex(order => order.id === cancelledOrder.id);
        if (index !== -1) {
          state.orders[index] = cancelledOrder;
        }
        if (state.currentOrder?.id === cancelledOrder.id) {
          state.currentOrder = cancelledOrder;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Order Summary
    builder
      .addCase(fetchOrderSummary.fulfilled, (state, action) => {
        state.orderSummary = action.payload;
      })
      .addCase(fetchOrderSummary.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Order Analytics
    builder
      .addCase(fetchOrderAnalytics.fulfilled, (state, action) => {
        state.orderAnalytics = action.payload;
      })
      .addCase(fetchOrderAnalytics.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fulfill Order
    builder
      .addCase(fulfillOrder.fulfilled, (state, action) => {
        const fulfilledOrder = action.payload.order;
        const index = state.orders.findIndex(order => order.id === fulfilledOrder.id);
        if (index !== -1) {
          state.orders[index] = fulfilledOrder;
        }
        if (state.currentOrder?.id === fulfilledOrder.id) {
          state.currentOrder = fulfilledOrder;
        }
      })
      .addCase(fulfillOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Refund Order
    builder
      .addCase(refundOrder.fulfilled, (state, action) => {
        const refundedOrder = action.payload.order;
        const index = state.orders.findIndex(order => order.id === refundedOrder.id);
        if (index !== -1) {
          state.orders[index] = refundedOrder;
        }
        if (state.currentOrder?.id === refundedOrder.id) {
          state.currentOrder = refundedOrder;
        }
      })
      .addCase(refundOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {clearError, clearCurrentOrder, resetOrders} = ordersSlice.actions;
export default ordersSlice.reducer;