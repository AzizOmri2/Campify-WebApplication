import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useApi } from "./ApiContext";
import { useNotification } from "./NotificationContext";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  logout: () => void;
  users: User[];
  loadingUsers: boolean;
  fetchUsersForAdmin: () => void;
  loginUser: (email: string, password: string) => Promise<{
    success: boolean;
    user?: User;
    token?: string;
    message?: string;
  }>;
  deleteUser: (userId: string) => Promise<void>;
  banUser: (userId: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  const { apiUrl } = useApi();
  const { success, error } = useNotification();

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));


  const loginUser = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${apiUrl}/api/users/login`, {
        email,
        password,
      });

      if (res.data.success) {
        const user = res.data.user;

        // Check if the user is Admin
        if (user.role !== "Admin") {
          return {
            success: false,
            message: "Access denied. Only admins can log in.",
          };
        }

        const token = res.data.token;

        // Save user and token
        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem("token", token);
        setUser(user);
        setToken(token);

        return { success: true, user, token };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };


  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);

    window.location.href = "/";
  };


  const fetchUsersForAdmin = async () => {
    
    setLoadingUsers(true);
    try {
      const res = await axios.get(`${apiUrl}/api/users/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err: any) {
      setUsers([]);
      error("Unable to load users. Please try again.");
    } finally {
      setLoadingUsers(false);
    }
  };


  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`${apiUrl}/api/users/admin/${userId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove user from local state
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      success("User deleted successfully.");
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const banUser = async (userId: string) => {
    try {
      await axios.put(`${apiUrl}/api/users/admin/${userId}/ban/`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update user status locally
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "Inactive" } : u))
      );
      success("User has been banned.");
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to ban user.");
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      await axios.put(`${apiUrl}/api/users/admin/${userId}/unban/`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update user status locally
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: "Active" } : u))
      );
      success("User has been unbanned.");
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to unban user.");
    }
  };

  return (
    <UserContext.Provider value={{ user, token, logout, users, loadingUsers, fetchUsersForAdmin, loginUser, deleteUser, banUser, unbanUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};