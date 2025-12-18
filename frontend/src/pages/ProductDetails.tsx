import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import './ProductDetails.css';
import { useEffect, useState } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { useProducts } from '@/contexts/ProductContext';


interface ProductType {
  _id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  description?: string;
  features?: string[];
}

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { apiUrl } = useApi();

  const { products, loading } = useProducts();
  
  const product = products.find((p) => p._id === id);
  const productNotFound = !loading && !product;

  return (
    <div className="product-details-page">
      <div className="container">
        {loading ? (
          <div>
            <div className="back-button skeleton skeleton-text"></div>
            <div className="product-details-grid">
              <div className="product-image-container skeleton skeleton-image"></div>
              <div className="product-info">
                <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                <div className="skeleton skeleton-button"></div>
              </div>
            </div>
          </div>
        ) : productNotFound ? (
          <div className="orders-empty">
            <ShoppingBag className="orders-empty-icon" />
            <h1 className="orders-empty-title">Product Not Found</h1>
            <p className="orders-empty-description">
              Oops! The product you're looking for isn’t available. Please check back soon!
            </p>
            <Link to="/shop" className="orders-empty-button">
              Browse Shop
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/shop" className="back-button">
              <ArrowLeft /> Back to Shop
            </Link>

            <div className="product-details-grid">
              {/* Product Image */}
              <div className="product-image-container">
                <img src={ product.image_url.startsWith("http://") || product.image_url.startsWith("https://")
                    ? product.image_url // full URL, use as-is
                    : `${apiUrl}/uploads/${product.image_url}` // local file
                  }
                  alt={product.name}
                />
              </div>

              {/* Product Info */}
              <div>
                <span className="product-badge">{product.category}</span>
                <h1 className="product-title">{product.name}</h1>

                <div className="product-price-wrapper">
                  <span className="product-price">{product.price.toFixed(2)} TND</span>
                  {product.stock < 10 && (
                    <span className="product-stock-warning">
                      Only {product.stock} left in stock
                    </span>
                  )}
                </div>

                <p className="product-description">{product.description}</p>

                {product.features && (
                  <div className="product-features">
                    <h3 className="product-features-title">Key Features</h3>
                    <ul className="product-features-list">
                      {product.features.map((feature, index) => (
                        <li key={index}>
                          <Check />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="product-actions">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="product-add-to-cart"
                  >
                    <ShoppingCart />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <Link to="/cart" className="product-view-cart">
                    View Cart
                  </Link>
                </div>

                <div className="product-availability">
                  <p>
                    <strong>Availability:</strong>{' '}
                    {product.stock > 0 ? (
                      <span className="product-in-stock">
                        In Stock ({product.stock} available)
                      </span>
                    ) : (
                      <span className="product-out-stock">Out of Stock</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;