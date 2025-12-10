import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import './ProductCard.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-card-image-wrapper">
          <img src={product.image_url} alt={product.name} className="product-card-image"/>
        </div>
      </Link>
      
      <div className="product-card-content">
        <div className="product-card-category">{product.category}</div>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-card-title">
            {product.name}
          </h3>
        </Link>
        <div className="product-card-details">
          <span className="product-card-price">
            {product.price.toFixed(2)} TND
          </span>
          {product.stock < 10 && (
            <span className="product-card-stock">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>

      <div className="product-card-footer">
        <button onClick={() => addToCart(product)} className="product-card-button" disabled={product.stock === 0}>
          <ShoppingCart />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
