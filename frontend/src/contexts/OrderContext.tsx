import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useApi } from './ApiContext';
import { useNotification } from './NotificationContext';
import { useUser } from './UserContext';

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Address {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

export interface OrderType {
  _id: string;
  items: OrderItem[];
  amount: number;
  address: Address;
  status: string;
  payment: boolean;
  date: string;
}

interface OrderContextType {
  orders: OrderType[];
  featuredOrders: OrderType[];
  loading: boolean;
  fetchOrdersByUser: (showNotification?: boolean) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiUrl } = useApi();
  const { user, token } = useUser();
  const { success, error, info } = useNotification();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrdersByUser = async (showNotification = false) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/orders/${user.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If backend returns empty list → NOT an error
      const data = response.data || [];
      setOrders(data);

      if (data.length === 0 && showNotification) {
        info("You don't have any orders yet.");
      } else if (showNotification) {
        success("Your order history is now available.");
      }
    } catch (err: any) {
      // Handle only REAL errors
      if (err.response?.status === 404) {
        // No orders found → valid case
        setOrders([]);
        if (showNotification) {
          info("You have no orders yet.");
        }
      } else {
        error('Oops! Something went wrong while loading your orders.');
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    if (user && token) fetchOrdersByUser(false);
  }, [user, token, apiUrl]);

  const featuredOrders = orders.slice(0, 4); // first 4 as featured

  return (
    <OrderContext.Provider value={{ orders, featuredOrders, loading, fetchOrdersByUser }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrdersProvider');
  return context;
};
