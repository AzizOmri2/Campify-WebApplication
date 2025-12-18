import { useState, useMemo, useEffect } from 'react';
import ProductList from '@/components/ProductList';
import CategoryFilter from '@/components/CategoryFilter';
import './Shop.css';
import { ShoppingBag } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useApi } from '@/contexts/ApiContext';


const Shop = () => {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { apiUrl } = useApi();


  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return cats.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  
  return (
    <div className="shop-page">
      <div className="container">
        {/* Header */}
        <div className="shop-header">
          <h1 className="shop-title">Shop All Products</h1>
          <p className="shop-description">
            Discover our complete range of premium camping equipment
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="global-loading">
            <div className="global-loading-icon-wrapper">
              <ShoppingBag className="global-loading-icon" />
              <p className="global-loading-text">Getting products ready for you...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <div className="shop-count">
              <p>
                Showing {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            <ProductList products={filteredProducts} />
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
