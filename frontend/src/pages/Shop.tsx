import { useState, useMemo, useEffect } from 'react';
import ProductList from '@/components/ProductList';
import CategoryFilter from '@/components/CategoryFilter';
import { useApi } from '@/contexts/ApiContext';
import './Shop.css';
import { AlertCircle } from 'lucide-react';

interface ProductType {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

const Shop = () => {
  const { apiUrl } = useApi(); // get API base URL from context
  const [productsData, setProductsData] = useState<ProductType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
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


  const categories = useMemo(() => {
    const cats = Array.from(new Set(productsData.map((p) => p.category)));
    return cats.sort();
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return productsData;
    return productsData.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, productsData]);

  
  if (error) {
    return (
      <div className="shop-error">
        <div className="shop-error-content">
          <AlertCircle size={48} className="shop-error-icon" />
          <h2>Oops! Something went wrong.</h2>
          <p>{error}</p>
          <button className="shop-error-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="shop-page">
        <div className="container">
          <div className="shop-header">
            <h1 className="shop-title">Shop All Products</h1>
            <p className="shop-description">
              Discover our complete range of premium camping equipment
            </p>
          </div>
          <div className="loading-container">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="skeleton-card"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="container">
        <div className="shop-header">
          <h1 className="shop-title">Shop All Products</h1>
          <p className="shop-description">
            Discover our complete range of premium camping equipment
          </p>
        </div>

        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory}/>

        <div className="shop-count">
          <p>
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <ProductList products={filteredProducts} />
      </div>
    </div>
  );
};

export default Shop;
