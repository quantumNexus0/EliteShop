import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CartItem } from '../types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByUser: (userId: string) => Order[];
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([
    // Sample orders for demo
    {
      id: 'ORD-001',
      userId: '2',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      items: [
        {
          product: {
            id: '1',
            name: 'Classic Denim Jacket',
            price: 89.99,
            images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'],
            category: 'Men',
            brand: 'UrbanStyle',
            rating: 4.5,
            reviewCount: 234,
            inStock: true,
            tags: ['casual', 'denim', 'jacket'],
            featured: true,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Blue', 'Black', 'Light Blue'],
            description: 'Timeless denim jacket',
            material: '100% Cotton Denim',
            gender: 'men'
          },
          quantity: 1,
          selectedSize: 'L',
          selectedColor: 'Blue'
        }
      ],
      total: 89.99,
      status: 'confirmed',
      createdAt: new Date('2025-01-15'),
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-002',
      userId: '3',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      items: [
        {
          product: {
            id: '6',
            name: 'Floral Midi Dress',
            price: 69.99,
            images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'],
            category: 'Women',
            brand: 'FloralFashion',
            rating: 4.8,
            reviewCount: 342,
            inStock: true,
            tags: ['dress', 'floral', 'midi'],
            featured: true,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Pink Floral', 'Blue Floral', 'Black Floral'],
            description: 'Elegant floral midi dress',
            material: '100% Viscose',
            gender: 'women'
          },
          quantity: 1,
          selectedSize: 'M',
          selectedColor: 'Pink Floral'
        }
      ],
      total: 69.99,
      status: 'shipped',
      createdAt: new Date('2025-01-14'),
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      paymentMethod: 'PayPal',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-003',
      userId: '4',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      items: [
        {
          product: {
            id: '11',
            name: 'Rainbow Striped T-Shirt',
            price: 19.99,
            images: ['https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'],
            category: 'Kids',
            brand: 'KidsFun',
            rating: 4.8,
            reviewCount: 423,
            inStock: true,
            tags: ['t-shirt', 'colorful', 'cotton'],
            featured: true,
            sizes: ['2T', '3T', '4T', '5T', '6', '7', '8'],
            colors: ['Rainbow', 'Pastel Rainbow'],
            description: 'Fun rainbow striped t-shirt',
            material: '100% Organic Cotton',
            gender: 'kids'
          },
          quantity: 2,
          selectedSize: '5T',
          selectedColor: 'Rainbow'
        }
      ],
      total: 39.98,
      status: 'pending',
      createdAt: new Date('2025-01-16'),
      shippingAddress: {
        street: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      },
      paymentMethod: 'Credit Card'
    }
  ]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const getOrdersByUser = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getAllOrders = () => {
    return orders;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
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