import { Link, NavLink } from 'react-router-dom';
import { LogIn, ShoppingCart, Menu, Tent } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import './Navbar.css';
import LoginModal from './LoginModal';


interface NavbarProps {
  onLoginOpen: () => void; // Add this
}

const Navbar = ({ onLoginOpen }: NavbarProps) => {
  const { cartCount } = useCart();
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

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

          {/* Login button calls the prop function */}
          <button className="navbar-login-button" onClick={onLoginOpen} title="Login">
            <LogIn />
          </button>

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
