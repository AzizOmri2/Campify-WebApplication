import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";
import "@/styles/AdminSidebar.css";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Products", url: "/products", icon: Package },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
}

export function AdminSidebar({ collapsed, onToggle, mobileOpen }: AdminSidebarProps) {
  const location = useLocation();

  const sidebarClass = `sidebar ${collapsed ? "collapsed" : "expanded"} ${mobileOpen ? "mobile-open" : ""}`;

  return (
    <aside className={sidebarClass}>
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <img src="/campify_icon.png" alt="Campify Logo"/>
          </div>
          <img src="/campify_logo_title_admin_panel.png" alt="Campify Title" className="sidebar-logo-text"/>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <item.icon />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={onToggle} className="sidebar-toggle">
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    </aside>
  );
}
