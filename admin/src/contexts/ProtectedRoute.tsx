import { useUser } from "@/contexts/UserContext";
import { useNotification } from "@/contexts/NotificationContext";
import Login from "@/pages/Login";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, logout } = useUser();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      error("You must be logged in to access this page");
    } else if (user.role !== "Admin") {
      navigate("/");
      error("Access denied. Admins only!");
    }
  }, [user, error]);

  if (!user) return <Login />;

  if (user.role !== "Admin") {
    navigate("/");
    error("⛔ Access denied. Admins only!");
    logout();
  }

  return children;
};

export default ProtectedRoute;

