import HeroSection from '@/components/HeroSection';
import ProductList from '@/components/ProductList';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Award } from 'lucide-react';
import './Home.css';
import { useApi } from '@/contexts/ApiContext';
import { useEffect, useState } from 'react';

interface ProductType {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

const Home = () => {
  const { apiUrl } = useApi(); // get API base URL from context
  const [productsData, setProductsData] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/products/`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: ProductType[] = await response.json();
        setProductsData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  const featuredProducts = productsData.slice(0, 4);

  if (loading) {
    return (
      <div className="home-page">
        <HeroSection />
        <div className="container">
          <h2>Featured Products</h2>
          <div className="loading-container">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <HeroSection />
        <div className="container">
          <p className="error-message">Failed to load products: {error}</p>
        </div>
      </div>
    );
  }

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
