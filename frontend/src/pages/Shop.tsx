import { useState, useMemo } from 'react';
import ProductList from '@/components/ProductList';
import CategoryFilter from '@/components/CategoryFilter';
import productsData from '@/data/products.json';
import './Shop.css';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(productsData.map((p) => p.category)));
    return cats.sort();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return productsData;
    return productsData.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="shop-page">
      <div className="container">
        <div className="shop-header">
          <h1 className="shop-title">Shop All Products</h1>
          <p className="shop-description">
            Discover our complete range of premium camping equipment
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

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
