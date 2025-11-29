import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import productsData from '@/data/products.json';
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const product = productsData.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="product-not-found">
        <div className="product-not-found-content">
          <h1>Product Not Found</h1>
          <Link to="/shop" className="product-not-found-button">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="container">
        <Link to="/shop" className="back-button">
          <ArrowLeft />
          Back to Shop
        </Link>

        <div className="product-details-grid">
          {/* Product Image */}
          <div className="product-image-container">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>

          {/* Product Info */}
          <div>
            <span className="product-badge">{product.category}</span>
            <h1 className="product-title">
              {product.name}
            </h1>
            
            <div className="product-price-wrapper">
              <span className="product-price">
                ${product.price.toFixed(2)}
              </span>
              {product.stock < 10 && (
                <span className="product-stock-warning">
                  Only {product.stock} left in stock
                </span>
              )}
            </div>

            <p className="product-description">
              {product.description}
            </p>

            {/* Features */}
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

            {/* Stock Status */}
            <div className="product-availability">
              <p>
                <strong>Availability:</strong>{' '}
                {product.stock > 0 ? (
                  <span className="product-in-stock">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="product-out-stock">Out of Stock</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
