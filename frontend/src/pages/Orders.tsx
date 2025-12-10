import { useOrders } from '@/contexts/OrderContext';
import './Orders.css';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';


const Orders = () => {
  const { orders, loading, fetchOrdersByUser } = useOrders();

  useEffect(() => {
    fetchOrdersByUser(true);
  }, []);

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="orders-empty">
            <div className="orders-loading">
              <ShoppingBag className="orders-loading-icon" />
              <p className="orders-loading-text">Getting your orders ready...</p>
            </div>
          </div>
        )}

        {/* No orders state */}
        {!loading && orders.length === 0 && (
          <div className="orders-empty">
            <ShoppingBag className="orders-empty-icon" />
            <h1 className="orders-empty-title">You have no orders yet</h1>
            <p className="orders-empty-description">
              Looks like you haven't placed any orders. Start shopping now!
            </p>
            <Link to="/cart" className="orders-empty-button">
              Check your Cart
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order, idx) => (
              <div
                key={order._id}
                className="order-card"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="order-header">
                  <span className="order-id">Order {idx + 1}</span>
                  <span className={`order-status ${order.status}`}>{order.status}</span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.product_id} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">{item.price.toFixed(2)} TND</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span className="order-total">Total: {order.amount.toFixed(2)} TND</span>
                  <span className="order-date">{new Date(order.date).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
