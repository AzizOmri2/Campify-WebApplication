import { createPortal } from "react-dom";
import { Image, FileText, Tag, DollarSign, Package, PlusCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import "./ProductModal.css";
import { useProduct } from "@/contexts/ProductContext";
import { useApi } from "@/contexts/ApiContext";


interface Product {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  features?: string[];
  imageUrl?: string;
}


interface ProductModalProps {
  productId?: string;
  onClose: () => void;
  onProduct: (product: FormData) => void;
}

const categories = [
  { label: "Tents" },
  { label: "Backpacks" },
  { label: "Sleeping Gear" },
  { label: "Lighting" },
  { label: "Hydration" },
  { label: "Camping Furniture" },
  { label: "Tools" },
  { label: "Safety" },
  { label: "Storage" },
];

export default function ProductModal({ productId, onClose, onProduct }: ProductModalProps) {
  const { apiUrl } = useApi();
  const { getProduct } = useProduct();
  const [formData, setFormData] = useState<any>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    features: [],
    featureInput: "",
    imageUrl: "",
    imageFile: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);


  // Fetch product for edit
  useEffect(() => {
  if (!productId) return;
  const fetchProduct = async () => {
    const product = await getProduct(productId);
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || 0,
        stock: product.stock || 0,
        description: product.description || "",
        features: product.features || [],
        featureInput: "",
        imageUrl: product.image_url || "", // <-- map image to imageUrl
        imageFile: null,
      });
    }
  };
  fetchProduct();
}, [productId]);


  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if(e.key === 'Escape') handleClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener('keydown', handleEsc);
    // Trigger fade-in after mount
    setShowModal(true);

    return () => { 
        document.body.style.overflow = "auto"; 
        window.removeEventListener('keydown', handleEsc);
    };
  }, []);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "imageFile") setFormData(prev => ({ ...prev, imageFile: files[0] || null }));
    else if (name === "featureInput") setFormData(prev => ({ ...prev, featureInput: value }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFeature = () => {
    if (formData.featureInput.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, prev.featureInput.trim()], featureInput: "" }));
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_: any, i: number) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("category", formData.category);
    fd.append("price", String(formData.price));
    fd.append("stock", String(formData.stock));
    fd.append("description", formData.description);
    formData.features.forEach(f => fd.append("features", f));

    if (formData.imageFile) {
      fd.append("image_file", formData.imageFile); // file upload
    } else if (formData.imageUrl) {
      fd.append("image_url", formData.imageUrl); // url
    }

    await onProduct(fd); // make sure your context or API function supports FormData
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleClear = () => {
    setFormData({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      features: [],
      featureInput: "",
      imageUrl: "",
      imageFile: null,
    });
  };

  return createPortal(
    <div className={`apm-overlay ${showModal ? "show" : ""} ${isClosing ? "closing" : ""}`} onClick={handleClose}>
      <div className={`apm-modal ${showModal ? "show" : ""} ${isClosing ? "closing" : ""}`} onClick={e => e.stopPropagation()}>
        <button className="apm-close-btn" onClick={handleClose} aria-label="Close modal">
          &times;
        </button>

        <div className="apm-modal-content">
          <h2>{productId ? "Update Product" : "Add New Product"}</h2>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
            Fill in the details below {productId ? "to update the product." : "to add a new product to your store."}
          </p>

          <form className="apm-form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="apm-form-group full-width">
              <label><Package size={16}/> Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter product name" />
            </div>

            {/* Category */}
            <div className="apm-form-group full-width">
              <label><Tag size={16}/> Category</label>
              <div className="category-options">
                {categories.map(cat => (
                  <label key={cat.label} className={`category-radio ${formData.category === cat.label ? 'selected' : ''}`} tabIndex={0}>
                    <input type="radio" name="category" value={cat.label} checked={formData.category === cat.label} onChange={handleChange} />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Price & Stock */}
            <div className="apm-form-row">
              <div className="apm-form-group">
                <label><DollarSign size={16}/> Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min={0} step={0.01} />
              </div>
              <div className="apm-form-group">
                <label><PlusCircle size={16}/> Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min={0} />
              </div>
            </div>

            {/* Features */}
            <div className="apm-form-group full-width">
              <label><Tag size={16}/> Features</label>
              <div className="features-input">
                <input type="text" name="featureInput" value={formData.featureInput} onChange={handleChange} placeholder="Type feature and press Enter to add" onKeyDown={(e) => { if(e.key === "Enter") { e.preventDefault(); addFeature(); } }} />
              </div>
              <div className="features-list">
                {formData.features.map((f, i) => (
                  <span key={i} className="feature-tag" onClick={() => removeFeature(i)} title="Click to remove">{f} <Trash2 size={12} /></span>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="apm-form-group full-width">
              <label><Image size={16}/> Image URL</label>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Paste image URL"/>
            </div>
            <div className="apm-form-group full-width">
              <label><Image size={16}/> Or Upload Image</label>
              <input type="file" name="imageFile" accept="image/*" onChange={handleChange}/>
            </div>
            
            {/* Image Preview */}
            {(formData.imageFile || formData.imageUrl) && (
              <div className="apm-image-preview">
                <img
                  src={
                    formData.imageFile
                      ? URL.createObjectURL(formData.imageFile) // newly uploaded file
                      : formData.imageUrl.startsWith("http://") || formData.imageUrl.startsWith("https://")
                      ? formData.imageUrl // full URL from backend
                      : `${apiUrl}/uploads/${formData.imageUrl}` // local backend file
                  }
                  alt="Preview"
                />
              </div>
            )}

            {/* Description */}
            <div className="apm-form-group full-width">
              <label><FileText size={16}/> Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Add description"/>
            </div>

            {/* Actions */}
            <div className="apm-actions">
              <button type="submit" className="btn btn-submit">
                {productId ? "Save Changes" : "Save Product"}
              </button>
              <button type="button" className="btn btn-cancel" onClick={handleClear}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
