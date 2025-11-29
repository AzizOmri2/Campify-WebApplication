import HeroSection from '@/components/HeroSection';
import ProductList from '@/components/ProductList';
import { Link } from 'react-router-dom';
import productsData from '@/data/products.json';
import { ArrowRight, Shield, Truck, Award } from 'lucide-react';
import './Home.css';

const Home = () => {
  const featuredProducts = productsData.slice(0, 4);

  return (
    <div className="home-page">
      <HeroSection />

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <Truck />
              </div>
              <h3 className="feature-title">Free Shipping</h3>
              <p className="feature-description">On orders over $100</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-description">100% secure transactions</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Award />
              </div>
              <h3 className="feature-title">Quality Guaranteed</h3>
              <p className="feature-description">Premium outdoor gear</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <div className="featured-title-wrapper">
              <h2>Featured Products</h2>
              <p className="featured-subtitle">Explore our most popular camping gear</p>
            </div>
            <Link to="/shop" className="featured-view-all">
              View All
              <ArrowRight />
            </Link>
          </div>
          <ProductList products={featuredProducts} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">
            Ready for Your Next Adventure?
          </h2>
          <p className="cta-description">
            Browse our full collection of premium camping equipment
          </p>
          <Link to="/shop" className="cta-button">
            Explore All Products
            <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
