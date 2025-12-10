import { TrendingUp, ShoppingCart, Package, Users } from "lucide-react";
import "@/styles/pages.css";

const stats = [
  { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", icon: TrendingUp },
  { title: "Orders", value: "2,350", change: "+15.2%", icon: ShoppingCart },
  { title: "Products", value: "12,234", change: "+5.4%", icon: Package },
  { title: "Active Users", value: "573", change: "+12.3%", icon: Users },
];

export default function Dashboard() {
  return (
    <div className="page-enter space-y-6">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid-stats">
        {stats.map((stat, index) => (
          <div key={stat.title} className={`card hoverable stagger-${index + 1}`}>
            <div className="stat-card">
              <div>
                <p className="stat-label">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-change">{stat.change} from last month</p>
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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="list-item">
                <div>
                  <p className="list-item-title">Order #{1000 + i}</p>
                  <p className="list-item-subtitle">2 items • $129.00</p>
                </div>
                <span className="badge badge-primary">Processing</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card hoverable stagger-5">
          <h2 className="section-title">Top Products</h2>
          <div className="space-y-3">
            {["Organic Seeds Pack", "Garden Tools Set", "Plant Fertilizer", "Ceramic Pot Large"].map((product, i) => (
              <div key={product} className="list-item">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ height: "2.5rem", width: "2.5rem", borderRadius: "0.5rem", backgroundColor: "var(--muted)" }} />
                  <div>
                    <p className="list-item-title">{product}</p>
                    <p className="list-item-subtitle">{120 - i * 15} sales</p>
                  </div>
                </div>
                <span style={{ fontWeight: 500 }}>${(29.99 + i * 10).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
