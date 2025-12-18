import { createPortal } from "react-dom";
import "./ShowProductModal.css";
import { useApi } from "@/contexts/ApiContext";
import { useEffect, useState } from "react";

interface ShowProductModalProps {
  product: {
    _id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
    features?: string[];
    image_url?: string;
  } | null;
  onClose: () => void;
}



export default function ShowProductModal({ product, onClose }: ShowProductModalProps) {
  const { apiUrl } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  if (!product) return null;

  // Prevent body scroll
  useEffect(() => {
    // Prevent body scroll and show modal
    document.body.style.overflow = "hidden";
    setShowModal(true);

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Cleanup
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true); // trigger fade-out animation
    setTimeout(() => {
      onClose();
    }, 300); // match CSS transition duration
  };

  return createPortal(
    <div className={`spm-overlay ${showModal ? "show" : ""} ${isClosing ? "closing" : ""}`} onClick={handleClose}>
      <div className={`spm-modal ${showModal ? "show" : ""} ${isClosing ? "closing" : ""}`} onClick={(e) => e.stopPropagation()}>
        <button className="spm-close-btn" onClick={handleClose} title="Close">
          &times;
        </button>

        <div className="spm-modal-content fade-in">
          {/* Header */}
          <div className="spm-header">
            <h2 className="spm-title">{product.name}</h2>
            <span className="spm-badge spm-category">{product.category}</span>
          </div>

          {/* Badges */}
          <div className="spm-badges">
            <span className={`spm-badge ${product.stock > 0 ? "spm-stock-available" : "spm-stock-out"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
            <span className="spm-badge spm-price">${product.price}</span>
            {product.features && product.features.length > 0 && (
              <span className="spm-badge spm-features">{product.features.length} features</span>
            )}
          </div>

          {/* Product Image */}
          {(product.image_url) && (
            <div className="spm-image-wrapper">
              <img src={ product.image_url.startsWith("http://") || product.image_url.startsWith("https://")
                  ? product.image_url // full URL, use as-is
                  : `${apiUrl}/uploads/${product.image_url}` // local file
                }
                alt={product.name}
                className="spm-image"
              />
            </div>
          )}

          {/* Details */}
          <div className="spm-details">
            {product.description && 
              <p><strong>Description: </strong>{product.description}</p>
            }
            {product.features && product.features.length > 0 && (
              <div>
                <strong>Features:</strong>
                <ul>
                  {product.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
