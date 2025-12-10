import { Search, Filter, MoreHorizontal } from "lucide-react";
import "@/styles/pages.css";

const orders = [
  { id: "#1001", customer: "Sarah Johnson", date: "Dec 1, 2025", status: "Delivered", amount: "$129.00" },
  { id: "#1002", customer: "Michael Chen", date: "Dec 1, 2025", status: "Processing", amount: "$89.50" },
  { id: "#1003", customer: "Emily Davis", date: "Nov 30, 2025", status: "Shipped", amount: "$245.00" },
  { id: "#1004", customer: "James Wilson", date: "Nov 30, 2025", status: "Pending", amount: "$67.00" },
  { id: "#1005", customer: "Lisa Anderson", date: "Nov 29, 2025", status: "Delivered", amount: "$189.99" },
];

const statusBadgeClass: Record<string, string> = {
  Delivered: "badge-primary",
  Processing: "badge-accent",
  Shipped: "badge-blue",
  Pending: "badge-muted",
};

export default function Orders() {
  return (
    <div className="page-enter space-y-6">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and track customer orders.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary">Export Orders</button>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search orders..."
              className="search-input"
            />
          </div>
          <button className="btn btn-secondary">
            <Filter />
            Filter
          </button>
        </div>

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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td style={{ color: "var(--muted-foreground)" }}>{order.date}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{order.amount}</td>
                  <td>
                    <button className="table-action-btn">
                      <MoreHorizontal />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
