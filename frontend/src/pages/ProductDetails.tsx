import { useParams, Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import './ProductDetails.css';
import { useEffect, useState } from 'react';
import { useApi } from '@/contexts/ApiContext';


interface ProductType {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  description?: string;
  features?: string[];
}

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const { apiUrl } = useApi(); 
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    console.log("Fetching product with id:", id); // <- log id
  if (id) {
    fetch(`${apiUrl}/api/products/${id}`)
      .then(res => res.json())
      .then(data => console.log("Fetched data:", data))
      .catch(err => console.error(err));
  }

  
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`Product not found`);
        }
        const data: ProductType = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="container">
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
      </div>
    );
  }
  
  if (error || !product) {
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
          <ArrowLeft /> Back to Shop
        </Link>

        <div className="product-details-grid">
          {/* Product Image */}
          <div className="product-image-container">
            <img src={product.image} alt={product.name} />
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
    </div>
  );
};

export default ProductDetails;