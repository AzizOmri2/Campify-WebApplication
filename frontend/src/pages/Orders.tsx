import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useApi } from '@/contexts/ApiContext';
import { useNotification } from '@/contexts/NotificationContext';
import axios from 'axios';
import './Orders.css';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Address {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  amount: number;
  address: Address;
  status: string;
  payment: boolean;
  date: string;
}

const Orders = () => {
  const { user, token } = useUser();
  const { apiUrl } = useApi();
  const { error } = useNotification();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/orders/${user.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err: any) {
        error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  if (loading) return <p className="orders-loading">Loading your orders...</p>;

  if (!loading && orders.length === 0) {
    return (
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
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
        </div>
        <div className="orders-list">
          {orders.map((order, idx) => (
            <div key={order._id} className="order-card" style={{ animationDelay: `${idx * 0.1}s` }}>
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
      </div>
    </div>
  );
};

export default Orders;
