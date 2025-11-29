import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useNotification } from '@/contexts/NotificationContext';
import { CreditCard } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { success } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      success('Order placed successfully! Thank you for your purchase. Order confirmation sent to your email.');
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const total = cartTotal + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-grid">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Shipping Information */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">Shipping Information</h2>
              <div className="checkout-form-grid">
                <div className="checkout-form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input id="firstName" type="text" required />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input id="lastName" type="text" required />
                </div>
                <div className="checkout-form-group checkout-form-group-full">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" required />
                </div>
                <div className="checkout-form-group checkout-form-group-full">
                  <label htmlFor="address">Address</label>
                  <input id="address" type="text" required />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="city">City</label>
                  <input id="city" type="text" required />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="zip">ZIP Code</label>
                  <input id="zip" type="text" required />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">Payment Information</h2>
              <div className="checkout-form-grid">
                <div className="checkout-form-group checkout-form-group-full">
                  <label htmlFor="cardName">Name on Card</label>
                  <input id="cardName" type="text" required />
                </div>
                <div className="checkout-form-group checkout-form-group-full">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input id="cardNumber" type="text" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="expiry">Expiry Date</label>
                  <input id="expiry" type="text" placeholder="MM/YY" required />
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input id="cvv" type="text" placeholder="123" required />
                </div>
              </div>
            </div>

            <button type="submit" className="checkout-submit-button" disabled={loading}>
              <CreditCard />
              {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div>
            <div className="checkout-summary">
              <h2 className="checkout-summary-title">Order Summary</h2>
              
              <div className="checkout-items">
                {cart.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <span className="checkout-item-name">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="checkout-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-divider" />

              <div className="checkout-summary-details">
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">Subtotal</span>
                  <span className="checkout-summary-value">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span className="checkout-summary-label">Shipping</span>
                  <span className="checkout-summary-value">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="checkout-divider" />
                <div className="checkout-summary-total">
                  <span>Total</span>
                  <span className="checkout-summary-total-value">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;