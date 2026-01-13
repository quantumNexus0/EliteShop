import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order } from '../types';
import { fetchOrderHistory, placeOrder } from '../services/api';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (orderData: any) => Promise<boolean>;
  refreshOrders: () => Promise<void>;
  getOrdersByUser: (userId: string) => Order[];
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchOrderHistory();
      // Transform backend order to frontend Order type if necessary
      const transformedOrders: Order[] = data.map((o: any) => ({
        ...o,
        total: parseFloat(o.total_amount),
        createdAt: new Date(o.created_at),
        updatedAt: new Date(o.created_at),
        items: o.items.map((item: any) => ({
          product: {
            ...item,
            price: parseFloat(item.price_at_purchase),
            images: item.images // Already parsed as array in backend router
          },
          quantity: item.quantity
        }))
      }));
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const addOrder = async (orderData: any): Promise<boolean> => {
    try {
      await placeOrder(orderData);
      await refreshOrders();
      return true;
    } catch (error) {
      console.error('Order placement failed:', error);
      return false;
    }
  };

  const getOrdersByUser = (userId: string) => {
    return orders.filter(order => order.userId === userId || order.userId === undefined); // fallback for transformed data
  };

  const getAllOrders = () => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      addOrder,
      refreshOrders,
      getOrdersByUser,
      getAllOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};