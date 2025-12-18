import { useEffect, useState } from 'react';
import './LoginModal.css';
import { useApi } from '@/contexts/ApiContext';
import axios from 'axios';
import { useNotification } from "@/contexts/NotificationContext";
import { useUser } from '@/contexts/UserContext';
import { useLocation } from "react-router-dom";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal = ({ onClose, onLoginSuccess }: LoginModalProps) => {
  const { apiUrl } = useApi();
  const { success, error } = useNotification();
  const { login, requestPasswordReset, resetPassword } = useUser();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlToken = params.get("token");

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(!!urlToken);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: ""
  });

  useEffect(() => {
    if (urlToken) {
      setIsResetPassword(true);
      setIsRegister(false);
      setIsForgotPassword(false);
    }
  }, [urlToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /** REGISTER & LOGIN SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isResetPassword) return handleResetPassword(e);

    setLoading(true);
    const url = isRegister 
      ? `${apiUrl}/api/users/register`
      : `${apiUrl}/api/users/login`;

    try {
      const response = await axios.post(url, formData);

      if (response.data.success) {
        if (isRegister) {
          success("Account created successfully 🎉", "Registration");
          setFormData({ full_name: "", email: "", password: "", confirm: "" });
          setIsRegister(false);
        } else {
          login(response.data.user, response.data.token);
          success("Logged in successfully! 🔓", "Welcome back");

          setTimeout(() => {
            closeModal();
            onLoginSuccess?.();
          }, 800);
        }
      } else {
        error(response.data.message, "Authentication Failed");
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  /** FORGOT PASSWORD SUBMIT */
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await requestPasswordReset(formData.email);
      if (res.success) {
        success("Reset link sent! Check your inbox.");
        setIsForgotPassword(false);
      }
    } catch (err: any) {
      error(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  /** RESET PASSWORD SUBMIT */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm) {
      error("Passwords do not match ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(urlToken!, formData.password);

      if (res.success) {
        success("Password updated 🎉", "Success");

        setFormData({ email: "", password: "", confirm: "", full_name: "" });
        setIsResetPassword(false);
      } else {
        error(res.message || "Failed to reset password.");
      }
    } catch (err: any) {
      error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`} onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>&times;</button>

        <h2>
          {isResetPassword 
            ? "Reset Password"
            : isRegister
              ? "Register"
              : isForgotPassword
                ? "Reset Password"
                : "Login"}
        </h2>

        <form
          className="modal-form"
          onSubmit={
            isForgotPassword
              ? handleForgotSubmit
              : isResetPassword
                ? handleResetPassword
                : handleSubmit
          }
        >

          {isRegister && !isResetPassword && (
            <input
              type="text"
              placeholder="Full Name"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              disabled={loading}
            />
          )}

          {!isResetPassword && (
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          )}

          {!isForgotPassword && !isResetPassword && (
            <input
              type="password"
              placeholder="Password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          )}

          {isResetPassword && (
            <>
              <input
                type="password"
                placeholder="New Password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                name="confirm"
                required
                value={formData.confirm}
                onChange={handleChange}
                disabled={loading}
              />
            </>
          )}

          {!isRegister && !isForgotPassword && !isResetPassword && (
            <p className="forgot-password" onClick={() => setIsForgotPassword(true)}>
              Forgot Password?
            </p>
          )}

          <button type="submit" className="modal-submit" disabled={loading}>
            {loading
              ? <span className="spinner"></span>
              : isResetPassword
                ? "Reset Password"
                : isForgotPassword
                  ? "Send Reset Link"
                  : isRegister
                    ? "Create Account"
                    : "Login"}
          </button>
        </form>

        {isResetPassword || isForgotPassword ? (
          <p className="modal-switch">
            {isResetPassword || isForgotPassword ? 'Back to your account?' : "Back to your account?"}{' '}
            <span
              onClick={() => {
                setIsResetPassword(false);
                setIsForgotPassword(false);
                setFormData({
                  full_name: "",
                  email: "",
                  password: "",
                  confirm: ""
                });
              }}
            >
              Login
            </span>
          </p>
        ) : (
          <p className="modal-switch">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              onClick={() => {
                setIsRegister(!isRegister);
                setIsForgotPassword(false);
              }}
            >
              {isRegister ? 'Login' : 'Register'}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
