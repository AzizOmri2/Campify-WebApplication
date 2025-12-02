import { useEffect, useState } from 'react';
import './LoginModal.css';
import { useApi } from '@/contexts/ApiContext';
import axios from 'axios';
import { useNotification } from "@/contexts/NotificationContext";
import { useUser } from '@/contexts/UserContext';


interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void; // optional callback
}

const LoginModal = ({ onClose, onLoginSuccess }: LoginModalProps) => {
  const { apiUrl } = useApi();
  const { success, error } = useNotification();
  const { login } = useUser();

  const [isRegister, setIsRegister] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = isRegister 
      ? `${apiUrl}/api/users/register`
      : `${apiUrl}/api/users/login`;

    try {
      const response = await axios.post(url, formData);

      if (response.data.success) {
        if (isRegister) {
          success("Account created successfully 🎉", "Registration");
          setFormData({ full_name: "", email: "", password: "" }); // clear form
          setIsRegister(false); // switch to login
        } else {
          login(response.data.user, response.data.token);
          success("Logged in successfully! 🔓", "Welcome back");
          setFormData({ full_name: "", email: "", password: "" });

          // Close modal
          setTimeout(() => {
            closeModal();
            onLoginSuccess?.(); // Notify navbar
          }, 800);
        }
      } else {
        error(response.data.message, "Authentication Failed");
      }
    } catch (err: any) {
      error(err.response?.data?.message || "Request failed", isRegister ? "Registration Failed" : "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // Lock scrolling & handle Escape
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`} onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>&times;</button>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          {isRegister && (
            <input type="text" placeholder="Full Name" name="full_name" required value={formData.full_name} onChange={handleChange} disabled={loading}/>
          )}
          <input type="email" placeholder="Email" name="email" required value={formData.email} onChange={handleChange} disabled={loading}/>
          <input type="password"
            placeholder="Password" name="password" required value={formData.password} onChange={handleChange} disabled={loading} />
          <button type="submit" className="modal-submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>
        <p className="modal-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
