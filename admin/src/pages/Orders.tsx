import { useEffect, useState } from "react";
import { Search, Filter, MoreHorizontal, PackageX, Eye, Trash2 } from "lucide-react";
import "@/styles/pages.css";
import { useOrders } from "@/contexts/OrderContext";
import { createPortal } from "react-dom";
import ShowOrderModal from "@/components/ShowOrderModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const statusBadgeClass: Record<string, string> = {
  delivered: "badge-primary",
  processing: "badge-accent",
  shipped: "badge-blue",
  pending: "badge-muted",
  paid: "badge-primary",
};

export default function Orders() {
  const { allOrders, fetchAllOrders, loading, deleteOrder, getOrder } = useOrders();
  const [search, setSearch] = useState("");


  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  // Delete modal animation state
  const [deleteModalAnimation, setDeleteModalAnimation] = useState({
    show: false,
    isClosing: false
  });


  // Show order modal
  const [showModal, setShowModal] = useState(false);
  const [orderToShow, setOrderToShow] = useState<any | null>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const filteredOrders = allOrders.filter((order) => {
    return (
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.status?.toLowerCase().includes(search.toLowerCase())
    );
  });


  // Delete handlers
  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setShowDeleteModal(true);

    // trigger fade-in after modal is in the DOM
    setTimeout(() => {
      setDeleteModalAnimation({ show: true, isClosing: false });
    }, 10);
  };

  const confirmDelete = async () => {
    if (orderToDelete) {
      await deleteOrder(orderToDelete);
      cancelDelete();
    }
  };

  const cancelDelete = () => {
    setDeleteModalAnimation({ show: true, isClosing: true });

    setTimeout(() => {
      setShowDeleteModal(false);
      setOrderToDelete(null);
      setDeleteModalAnimation({ show: false, isClosing: false });
    }, 300);
  };


  // Show Order
  const handleShowClick = async (id: string) => {
    setLoadingOrderDetails(true);
    const order = await getOrder(id);
    if (order) setOrderToShow(order);
    setShowModal(true);
    setLoadingOrderDetails(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setOrderToShow(null);
  };


  const exportOrdersToPDF = () => {
    const doc = new jsPDF();

    const primaryColor: [number, number, number] = [51, 102, 26]; // hsl(100,60%,25%)

    // ---- LOGO (TOP RIGHT) ----
    const logo = new Image();
    logo.src = "/campify_logo.png";

    doc.addImage(
      logo,
      "PNG",
      doc.internal.pageSize.getWidth() - 60, // right aligned
      10,
      47,
      20
    );

    // ---- TITLE ----
    doc.setFontSize(18);
    doc.setTextColor(...primaryColor);
    doc.text("Orders Report", 14, 20);

    // ---- DATE ----
    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(
      `Generated on: ${new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`,
      14,
      28
    );

    // ---- TABLE DATA ----
    const tableData = filteredOrders.map((order) => [
      `#${order._id.slice(-6).toUpperCase()}`,
      order.user?.name || "-",
      order.user?.email || "-",
      new Date(order.date).toLocaleDateString("en-US"),
      order.status.charAt(0).toUpperCase() + order.status.slice(1),
      `$${order.amount?.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["Order", "Customer", "Email", "Date", "Status", "Amount"]],
      body: tableData,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 4,
        textColor: [60, 60, 60],
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 245],
      },
      columnStyles: {
        5: { halign: "right" },
      },
    });

    // ---- FOOTER ----
    const finalY = (doc as any).lastAutoTable.finalY || 35;
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(
      `Total Orders: ${filteredOrders.length}`,
      14,
      finalY + 10
    );

    // ---- SAVE ----
    doc.save(`orders_${Date.now()}.pdf`);
  };

  return (
    <div className="page-enter space-y-6">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track customer orders.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" title="Export Orders" onClick={exportOrdersToPDF}>Export Orders</button>
        </div>
      </div>

      <div className="card">
        {/* SEARCH + FILTER */}
        <div className="filter-row">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input type="text" placeholder="Search orders..." className="search-input" value={search} onChange={(e) => setSearch(e.target.value)}/>
          </div>
        </div>

        {/* LOADING STATE OUTSIDE TABLE */}
        {loading && (
          <div className="loading-wrapper" style={{ padding: "2rem", textAlign: "center" }}>
            <div className="spinner"></div>
            <p className="loading-text">Loading orders...</p>
          </div>
        )}

        {/* EMPTY STATE OUTSIDE TABLE */}
        {!loading && filteredOrders.length === 0 && (
          <div className="empty-state">
            <PackageX className="empty-icon" size={48} />
            <p className="empty-title">No orders found</p>
            <p className="empty-subtitle">No orders match your search.</p>
          </div>
        )}

        {/* TABLE IS DISPLAYED ONLY WHEN THERE ARE ORDERS */}
        {!loading && filteredOrders.length > 0 && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6).toUpperCase()}</td>

                    <td>
                      <div style={{ fontWeight: 500 }}>{order.user?.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>
                        {order.user?.email}
                      </div>
                    </td>

                    <td style={{ color: "var(--muted-foreground)" }}>
                      {new Date(order.date).toLocaleDateString()}
                    </td>

                    <td>
                      <span className={`badge ${statusBadgeClass[order.status.toLowerCase()] || "badge-muted"}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>

                    <td style={{ fontWeight: 500 }}>
                      ${order.amount?.toFixed(2)}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn show" title="Show" onClick={() => handleShowClick(order._id)}>
                          <Eye size={16} />
                        </button>

                        <button className="icon-btn remove" title="Delete" onClick={() => handleDeleteClick(order._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        document.body  // render in <body> instead of inside Orders
      )}

      {/* Show Order Modal */}
      {showModal && orderToShow && !loadingOrderDetails && (
        <ShowOrderModal order={orderToShow} onClose={closeModal} />
      )}
    </div>
  );
}
