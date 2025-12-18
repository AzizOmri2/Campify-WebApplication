import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNotification } from "./NotificationContext";
import { useApi } from "./ApiContext";

interface User {
  id: string;
  full_name: string;
  email: string;
  joined: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: { full_name?: string; email?: string }) => Promise<void>;
  updatePassword: (data: { old_password: string; new_password: string; confirm_password: string; }) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const { apiUrl } = useApi();
  const { success, error } = useNotification();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const login = (user: User, token: string) => {
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("campify-cart");
    setUser(null);
    setToken(null);

    window.location.href = "/";
  };


  const updateUser = async (data: { full_name?: string; email?: string }) => {
    if (!user) return;

    try {
      const res = await axios.put(
        `${apiUrl}/api/users/${user.id}/update/`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        success("Profile updated successfully!");
      } else {
        error(res.data.message || "Failed to update profile.");
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // Update password
  const updatePassword = async (data: { old_password: string; new_password: string; confirm_password: string; }) => {
    if (!user) throw new Error("Not authenticated");

    try {
      const res = await axios.put(
        `${apiUrl}/api/users/${user.id}/update-password/`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update password");
      }

      success("Password updated successfully!");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update password";

      error(message);
      throw new Error(message); // 🔴 THIS IS THE KEY
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      const res = await axios.post(`${apiUrl}/api/users/forgot-password/`, {
        email,
      });

      if (res.data.success) {
        success(res.data.message || "Reset link sent! Check your inbox.");
        return { success: true, message: res.data.message };
      } else {
        error(res.data.message || "Failed to send reset link.");
        return { success: false, message: res.data.message };
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to send reset link.";

      error(message);
      return { success: false, message };
    }
  };


  // Reset password using token
  const resetPassword = async (token: string, password: string) => {
    try {
      const res = await axios.post(`${apiUrl}/api/users/reset-password/`, {
        token,
        password,
      });

      if (res.data.success) {
        success(res.data.message || "Password reset successfully.");
        return { success: true, message: res.data.message };
      } else {
        error(res.data.message || "Failed to reset password.");
        return { success: false, message: res.data.message };
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to reset password.";

      error(message);
      return { success: false, message };
    }
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, updateUser, updatePassword, requestPasswordReset, resetPassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};