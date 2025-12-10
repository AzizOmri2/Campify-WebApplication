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
  const { success, error } = useNotification();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrdersByUser = async (showNotification = false) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/orders/${user.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data || []);
      if (showNotification) success('Your order history is now available.');
    } catch (err) {
      setOrders([]);
      error('Oops! Something went wrong while retrieving orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) fetchOrdersByUser(false);
  }, [user, token, apiUrl]);

  const featuredOrders = orders.slice(0, 4);

  return (
    <OrderContext.Provider value={{ orders, featuredOrders, loading, fetchOrdersByUser }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
