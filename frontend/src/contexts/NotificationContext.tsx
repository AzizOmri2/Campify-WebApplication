import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification, { NotificationType } from '../components/Notification';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback(
    (type: NotificationType, message: string, title?: string, duration: number = 3000) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const notification: NotificationItem = { id, type, message, title, duration };
      
      setNotifications((prev) => [...prev, notification]);
    },
    []
  );

  const success = useCallback((message: string, title?: string) => {
    showNotification('success', message, title);
  }, [showNotification]);

  const error = useCallback((message: string, title?: string) => {
    showNotification('error', message, title);
  }, [showNotification]);

  const info = useCallback((message: string, title?: string) => {
    showNotification('info', message, title);
  }, [showNotification]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, success, error, info }}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};