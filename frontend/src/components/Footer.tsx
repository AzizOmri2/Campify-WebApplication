import { Link } from 'react-router-dom';
import { Tent, Facebook, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" className="navbar-logo">
              <img src="campify_logo.png" alt="Campify Logo" className="navbar-logo-img" />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-section-title">Quick Links</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <Link to="/">
                  Home
                </Link>
              </li>
              <li className="footer-link">
                <Link to="/shop">
                  Shop
                </Link>
              </li>
              <li className="footer-link">
                <Link to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="footer-section-title">Customer Service</h3>
            <ul className="footer-links">
              <li className="footer-link">Shipping Information</li>
              <li className="footer-link">Returns & Exchanges</li>
              <li className="footer-link">FAQ</li>
              <li className="footer-link">Size Guide</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="footer-section-title">Connect With Us</h3>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <Facebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <Instagram />
              </a>
              <a href="https://linkedin.com/in/med-aziz-omri" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                <Linkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          Developed By <a className="footer-link" href="https://mohamedazizomri.netlify.app" target="_blank" rel="noopener noreferrer">Mohamed Aziz Omri</a> | Copyright © {new Date().getFullYear()} Campify. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
