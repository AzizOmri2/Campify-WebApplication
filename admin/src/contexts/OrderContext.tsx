import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useApi } from './ApiContext';
import { useNotification } from './NotificationContext';
import { useUser } from './UserContext';


interface User {
  _id: string;
  name: string;
  email: string;
}

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
  user: User,
  items: OrderItem[];
  amount: number;
  address: Address;
  status: string;
  payment: boolean;
  date: string;
}

interface OrderContextType {
  orders: OrderType[];
  allOrders: OrderType[];
  featuredOrders: OrderType[];
  loading: boolean;
  fetchOrdersByUser: (showNotification?: boolean) => void;
  fetchAllOrders: (showNotification?: boolean) => void;
  deleteOrder: (orderId: string) => Promise<void>;
  getOrder: (orderId: string) => Promise<OrderType | null>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiUrl } = useApi();
  const { user, token } = useUser();
  const { success, error } = useNotification();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [allOrders, setAllOrders] = useState<OrderType[]>([]);
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

  // 👉 Fetch ALL orders (admin)
  const fetchAllOrders = async (showNotification = false) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllOrders(response.data || []);

      if (showNotification) success('All orders loaded successfully.');
    } catch (err) {
      setAllOrders([]);
      error('Unable to load all orders.');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`${apiUrl}/api/orders/${orderId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from both lists (for admin + user dashboard)
      setOrders(prev => prev.filter(order => order._id !== orderId));
      setAllOrders(prev => prev.filter(order => order._id !== orderId));

      success("Order deleted successfully.");
    } catch (err) {
      error("Unable to delete order.");
    }
  };

  const getOrder = async (orderId: string) => {
    try {
      const response = await axios.get(`${apiUrl}/api/orders/order/${orderId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data; // return the order details
    } catch (err) {
      error("Failed to load order details.");
      return null;
    }
  };

  useEffect(() => {
    if (user && token) fetchOrdersByUser(false);
  }, [user, token, apiUrl]);

  const featuredOrders = orders.slice(0, 4);

  return (
    <OrderContext.Provider value={{ orders, allOrders, featuredOrders, loading, fetchOrdersByUser, fetchAllOrders, deleteOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
