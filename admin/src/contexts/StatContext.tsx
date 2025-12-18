import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useApi } from "./ApiContext";
import { useNotification } from "./NotificationContext";
import { useUser } from "./UserContext";

interface Order {
  id: string;
  user: string;
  amount: number;
  items_count: number;
  status: string;
  date: string;
}

interface ProductStats {
  name: string;
  price: number;
  sales: number;
  image_url?: string;
}

interface Stats {
  totalRevenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  products: number;
  activeUsers: number;
  usersChange: number;
  recentOrders: Order[];
  topProducts: ProductStats[];
}

interface StatContextType {
  stats: Stats | null;
  loading: boolean;
  fetchDashboardStats: (showNotification?: boolean) => Promise<void>;
}

const StatContext = createContext<StatContextType | undefined>(undefined);

export const StatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiUrl } = useApi();
  const { token } = useUser();
  const { success, error } = useNotification();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboardStats = async (showNotification = false) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/stats/dashboard/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      setStats({
        totalRevenue: data.totalRevenue,
        revenueChange: data.revenueChange,
        orders: data.orders,
        ordersChange: data.ordersChange,
        products: data.products,
        activeUsers: data.activeUsers,
        usersChange: data.usersChange,
        recentOrders: data.recentOrders || [],
        topProducts: data.topProducts || [],
      });

      if (showNotification) {
        success("Dashboard statistics loaded successfully.");
      }
    } catch (err) {
      setStats(null);
      error("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardStats(false);
    }
  }, [token, apiUrl]);

  return (
    <StatContext.Provider
      value={{
        stats,
        loading,
        fetchDashboardStats,
      }}
    >
      {children}
    </StatContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatContext);
  if (!context) {
    throw new Error("useStats must be used within StatProvider");
  }
  return context;
};