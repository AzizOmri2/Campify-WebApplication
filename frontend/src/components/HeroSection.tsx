import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Background Pattern */}
      <div className="hero-pattern" />

      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Gear Up for Your Next Adventure
          </h1>
          <p className="hero-description">
            Adventure confidently with our high-quality camping equipment and outdoor essentials, built for explorers who refuse to compromise.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="hero-button hero-button-primary">
              Shop Now
              <ArrowRight />
            </Link>
            <Link to="/contact" className="hero-button hero-button-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="hero-decoration" />
    </section>
  );
};

export default HeroSection;
