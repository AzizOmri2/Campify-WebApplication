import { useEffect, useState } from 'react';
import './LoginModal.css';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal = ({ onClose }: LoginModalProps) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Controls fade-out

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
    setIsVisible(false); // Trigger fade-out
    setTimeout(() => {
      onClose(); // Actually unmount modal after animation
    }, 300); // Match duration of fadeOut animation
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'fade-in' : 'fade-out'}`} onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form className="modal-form">
          {isRegister && (
            <input type="text" placeholder="Full Name" required />
          )}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="modal-submit">
            {isRegister ? 'Register' : 'Login'}
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