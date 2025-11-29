import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <ShoppingBag className="cart-empty-icon" />
          <h1 className="cart-empty-title">Your Cart is Empty</h1>
          <p className="cart-empty-description">Start adding some great camping gear!</p>
          <Link to="/shop" className="cart-empty-button">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const total = cartTotal + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <button className="cart-clear-button" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-grid">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-content">
                  <div className="cart-item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  
                  <div className="cart-item-details">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="cart-item-name">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="cart-item-price">
                      ${item.price.toFixed(2)}
                    </p>
                    
                    <div className="cart-item-actions">
                      {/* Quantity Controls */}
                      <div className="cart-quantity-controls">
                        <button
                          className="cart-quantity-button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus />
                        </button>
                        <span className="cart-quantity">{item.quantity}</span>
                        <button
                          className="cart-quantity-button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        className="cart-remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>
              
              <div className="cart-summary-details">
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Subtotal</span>
                  <span className="cart-summary-value">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Shipping</span>
                  <span className="cart-summary-value">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="cart-summary-divider" />
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span className="cart-summary-total-value">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {cartTotal < 100 && (
                <p className="cart-summary-shipping-note">
                  Add ${(100 - cartTotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <Link to="/checkout" className="cart-checkout-button">
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="cart-continue-button">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
