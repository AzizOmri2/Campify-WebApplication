import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogIn, ShoppingCart, Menu, Tent, LogOut, Settings, Package } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import { useUser } from '@/contexts/UserContext';


const Navbar = ({ onLoginOpen }: { onLoginOpen: () => void }) => {
  const { cartCount } = useCart();
  const { user, logout } = useUser();
  
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);  

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  const userName = user?.full_name || "User";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) setDropdownOpen(false);
  }, [user]);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="campify_logo.png" alt="Campify Logo" className="navbar-logo-img" />
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Cart & Mobile Menu */}
        <div className="navbar-actions">
          <NavLink to="/cart" className={({ isActive }) => isActive ? "navbar-cart-button active" : "navbar-cart-button"} title="Check Cart">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="navbar-cart-badge">
                {cartCount}
              </span>
            )}
          </NavLink>

          {user ? (
            <div className="navbar-user-dropdown" ref={dropdownRef}>
              <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {userName} ▼
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => navigate('/orders')}>
                    <Package /> Orders
                  </button>
                  <button className="dropdown-item" onClick={() => navigate('/settings')}>
                    <Settings /> Settings
                  </button>
                  <button className="dropdown-item" onClick={logout} title="Logout">
                    <LogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar-login-button" onClick={onLoginOpen} title="Login">
              <LogIn />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button className="navbar-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="container navbar-mobile-menu">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
