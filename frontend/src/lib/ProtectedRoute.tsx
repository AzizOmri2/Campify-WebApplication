import { ReactNode, useEffect, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNotification } from '@/contexts/NotificationContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUser();
  const { error } = useNotification();
  const notificationShown = useRef(false);

  // Show notification once
  useEffect(() => {
    if (!user && !notificationShown.current) {
      error('Oops! You need an account to access this page.');
      notificationShown.current = true;
    }
  }, [user, error]);

  // If not logged in, redirect to home
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
