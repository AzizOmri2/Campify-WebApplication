import { createPortal } from "react-dom";
import "./ShowOrderModal.css";
import { useEffect, useState } from "react";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  amount: number;
  address: {
    first_name: string;
    last_name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  status: string;
  payment: string;
  date: string;
}

interface ShowOrderModalProps {
  order: OrderData | null;
  onClose: () => void;
}

export default function ShowOrderModal({ order, onClose }: ShowOrderModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  if (!order) return null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    setShowModal(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return createPortal(
    <div className={`som-overlay ${showModal ? "show" : ""} ${isClosing ? "closing" : ""}`} onClick={handleClose}>
      <div className={`som-modal ${showModal ? "show" : ""} ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        <button className="som-close-btn" onClick={handleClose} title="Close">
          &times;
        </button>

        <div className="som-modal-content fade-in">
          {/* Header */}
          <div className="som-header">
            <h2 className="som-title">Order #{order._id.slice(-6).toUpperCase()}</h2>
            <span className="som-badge som-status">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Badges */}
          <div className="som-badges">
            <span className="som-badge som-badge-gray">Payment: {order.payment}</span>
            <span className="som-badge som-badge-blue">
              {new Date(order.date).toLocaleString()}
            </span>
            <span className="som-badge som-badge-green">${order.amount.toFixed(2)}</span>
          </div>

          {/* User Info */}
          <div className="som-section">
            <h3>User Information :</h3>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
          </div>

          {/* Address */}
          <div className="som-section">
            <h3>Delivery Address :</h3>
            <p><strong>Full Name:</strong> {order.address.first_name} {order.address.last_name}</p>
            <p><strong>Email:</strong> {order.address.email}</p>
            <p><strong>Address:</strong> {order.address.address}</p>
            <p><strong>City:</strong> {order.address.city}</p>
            <p><strong>ZIP:</strong> {order.address.zip}</p>
          </div>

          {/* Items */}
          <div className="som-section">
            <h3>Items :</h3>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>
                  <strong>{item.name}</strong> — {item.quantity} × ${item.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
