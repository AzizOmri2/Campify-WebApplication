import HeroSection from '@/components/HeroSection';
import ProductList from '@/components/ProductList';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Award, ShoppingBag, AlertCircle } from 'lucide-react';
import './Home.css';
import { useProducts } from '@/contexts/ProductContext';

const Home = () => {
  const { products, featuredProducts, loading } = useProducts();

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
              <p className="feature-description">On orders over 100 TND</p>
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

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <div className="featured-title-wrapper">
              <h2>Featured Products</h2>
              <p className="featured-subtitle">Explore our most popular camping gear</p>
            </div>
            {!loading && (
              <Link to="/shop" className="featured-view-all">
                View All <ArrowRight />
              </Link>
            )}
          </div>

          {/* Global Loading State */}
          {loading && (
            <div className="global-loading">
              <div className="global-loading-icon-wrapper">
                <ShoppingBag className="global-loading-icon" />
                <p className="global-loading-text">Getting everything ready for your shopping experience...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="orders-empty">
              <ShoppingBag className="orders-empty-icon" />
              <h1 className="orders-empty-title">No products available</h1>
              <p className="orders-empty-description">
                Looks like we don't have any products yet. Check back soon!
              </p>
              <Link to="/shop" className="orders-empty-button">
                Browse Shop
              </Link>
            </div>
          )}

          {/* Products */}
          {!loading && <ProductList products={featuredProducts} />}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready for Your Next Adventure?</h2>
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
