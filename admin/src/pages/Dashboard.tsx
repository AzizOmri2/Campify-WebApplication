import { TrendingUp, ShoppingCart, Package, Users, PackageX } from "lucide-react";
import "@/styles/pages.css";
import { useStats } from "@/contexts/StatContext";

export default function Dashboard() {

  const { stats, loading } = useStats();

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: TrendingUp,
    },
    {
      title: "Orders",
      value: stats.orders,
      change: stats.ordersChange,
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: stats.products,
      icon: Package,
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      change: stats.usersChange,
      icon: Users,
    },
  ];

  return (
    <div className="page-enter space-y-6">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid-stats">
        {dashboardStats.map((stat, index) => (
          <div key={stat.title} className={`card hoverable stagger-${index + 1}`}>
            <div className="stat-card">
              <div>
                <p className="stat-label">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
                {stat.change !== undefined && (
                  <p className={`stat-change ${stat.change >= 0 ? "positive" : "negative"}`}>
                    {stat.change >= 0 ? "+" : ""}
                    {stat.change}% from last month
                  </p>
                )}
              </div>
              <div className="stat-icon">
                <stat.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card hoverable stagger-5">
          <h2 className="section-title">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <div className="empty-state">
                <PackageX className="empty-icon" size={48} />
                <p className="empty-title">No recent orders.</p>
                <p className="empty-subtitle">No orders found.</p>
              </div>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="list-item">
                  <div>
                    <p className="list-item-title">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="list-item-subtitle">
                      {order.items_count} items • ${order.amount.toFixed(2)}
                    </p>
                    <p className="list-item-subtitle">By {order.user}</p>
                  </div>
                  <span className="badge badge-primary">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card hoverable stagger-5">
          <h2 className="section-title">Top Products</h2>
          <div className="space-y-3">
            {stats.topProducts.length === 0 ? (
              <div className="empty-state">
                <PackageX className="empty-icon" size={48} />
                <p className="empty-title">No products found.</p>
                <p className="empty-subtitle">No top products found in the catalog.</p>
              </div>
            ) : (
              stats.topProducts.map((product) => (
                <div key={product.name} className="list-item">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ height: "2.5rem", width: "2.5rem", borderRadius: "0.5rem" }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "2.5rem",
                          width: "2.5rem",
                          borderRadius: "0.5rem",
                          backgroundColor: "var(--muted)",
                        }}
                      />
                    )}
                    <div>
                      <p className="list-item-title">{product.name}</p>
                      <p className="list-item-subtitle">{product.sales} sales</p>
                    </div>
                  </div>
                  <span style={{ fontWeight: 500 }}>${product.price.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
