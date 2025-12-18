import { Plus, Search, Grid, List, Eye, Edit3, Trash2, PackageX } from "lucide-react";
import "@/styles/pages.css";
import { useEffect, useState } from "react";
import { useProduct } from "@/contexts/ProductContext";
import { Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import ShowProductModal from "@/components/ShowProductModal";
import ProductModal from "@/components/ProductModal";
import { useApi } from "@/contexts/ApiContext";


export default function Products() {

  const { products, loadingProducts, fetchProductsForAdmin, deleteProduct, getProduct, createProduct, updateProduct } = useProduct();
  const { apiUrl } = useApi();

  // Search & view states
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  // Delete modal animation state
  const [deleteModalAnimation, setDeleteModalAnimation] = useState({
    show: false,
    isClosing: false
  });

  // Show product modal
  const [showModal, setShowModal] = useState(false);
  const [productToShow, setProductToShow] = useState<any | null>(null);
  const [loadingProductDetails, setLoadingProductDetails] = useState(false);

  // Add/Update modal
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProductsForAdmin();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.price.toString().includes(searchQuery)
  );

  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setShowDeleteModal(true);

    // trigger fade-in after modal is in the DOM
    setTimeout(() => {
      setDeleteModalAnimation({ show: true, isClosing: false });
    }, 10);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      cancelDelete();
    }
  };

  const cancelDelete = () => {
    setDeleteModalAnimation({ show: true, isClosing: true });

    setTimeout(() => {
      setShowDeleteModal(false);
      setProductToDelete(null);
      setDeleteModalAnimation({ show: false, isClosing: false });
    }, 300);
  };

  // Show product
  const handleShowClick = async (id: string) => {
    setLoadingProductDetails(true);
    const product = await getProduct(id);
    if (product) setProductToShow(product);
    setShowModal(true);
    setLoadingProductDetails(false);
  };
  const closeModal = () => {
    setShowModal(false);
    setProductToShow(null);
  };

  // Add/Edit handlers
  const openAddModal = () => {
    setEditingProductId(null);
    setShowAddEditModal(true);
  };

  const openEditModal = (id: string) => {
    setEditingProductId(id);
    setShowAddEditModal(true);
  };

  const closeAddEditModal = () => {
    setShowAddEditModal(false);
    setEditingProductId(null);
  };

  const handleAddProduct = async (newProduct: any) => {
    await createProduct(newProduct);
    closeAddEditModal();
    fetchProductsForAdmin();
  };

  const handleUpdateProduct = async (updatedProduct: any) => {
    if (!editingProductId) return;
    await updateProduct(editingProductId, updatedProduct);
    closeAddEditModal();
    fetchProductsForAdmin();
  };



  return (
    <div className="page-enter space-y-6">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product inventory.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openAddModal} title="Add Product">
            <Plus />
            Add Product
          </button>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input type="text" placeholder="Search products..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>
          <div className="view-toggle">
            <button className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grid View">
              <Grid />
            </button>
            <button className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="List View">
              <List />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loadingProducts && (
          <div className="loading-wrapper">
            <div className="spinner"></div>
            <p className="loading-text">Loading products...</p>
          </div>
        )}

        {!loadingProducts && filteredProducts.length === 0 && (
          <div className="empty-state">
            <PackageX className="empty-icon" size={48} />
            <p className="empty-title">No products found</p>
            <p className="empty-subtitle">No products found in the catalog.</p>
          </div>
        )}

        {/* Product Grid */}
        {!loadingProducts && (
          <div className={viewMode === "grid" ? "grid-3" : "list-view"}>
            {filteredProducts.map((product, index) => (
              <div key={`${product._id}-${index}`} className="card hoverable">
                <div className="product-card-header">
                  <div className="product-icon">
                    {product.image_url ? (
                      <img src={ product.image_url.startsWith("http://") || product.image_url.startsWith("https://")
                          ? product.image_url // full URL, use as-is
                          : `${apiUrl}/uploads/${product.image_url}` // local file
                        }
                        alt={product.name}
                        className="product-img"
                      />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <span className="badge badge-muted">
                    {product.category}
                  </span>
                </div>

                <h3 className="product-name">{product.name}</h3>

                <div className="product-footer">
                  <div className="product-info">
                    <span className="product-price">${product.price}</span>
                    <span className="product-stock">{product.stock} in stock</span>
                  </div>
                  <div className="product-actions">
                    <button className="action-btn btn-show" title="Show" onClick={() => handleShowClick(product._id)}>
                      <Eye />
                    </button>
                    <button className="action-btn btn-edit" title="Edit" onClick={() => openEditModal(product._id)}>
                      <Edit3 />
                    </button>
                    <button className="action-btn btn-delete" title="Delete" onClick={() => handleDeleteClick(product._id)}>
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && createPortal(
        <div className={`modal-overlay ${deleteModalAnimation.show ? "show" : ""} ${deleteModalAnimation.isClosing ? "closing" : ""}`}>
          <div className={`modal ${deleteModalAnimation.show ? "show" : ""} ${deleteModalAnimation.isClosing ? "closing" : ""}`}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this product?</p>

            <div className="modal-actions">
              <button className="btn btn-delete-confirm" onClick={confirmDelete} title="Delete">
                <Trash2 className="delete-icon" size={18} />
                Delete
              </button>
              <button className="btn btn-cancel" onClick={cancelDelete} title="Cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body  // render in <body> instead of inside Products
      )}

      {/* Show Product Modal */}
      {showModal && productToShow && !loadingProductDetails && (
        <ShowProductModal product={productToShow} onClose={closeModal} />
      )}

      {/* Add/Edit Product */}
      {showAddEditModal && (
        <ProductModal
          onClose={closeAddEditModal}
          productId={editingProductId}
          onProduct={editingProductId ? handleUpdateProduct : handleAddProduct}
        />
      )}

    </div>
  );
}