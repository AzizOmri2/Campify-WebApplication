import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import "@/styles/AdminLayout.css";
import ShowUserModal from "../ShowUserModal";
import { AdminFooter } from "./AdminFooter";

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // --- Global modal state ---
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalUser, setModalUser] = useState<any | null>(null);

  const openShowUserModal = (user: any) => {
    setModalUser(user);
    setShowUserModal(true);
  };

  const closeShowUserModal = () => {
    setModalUser(null);
    setShowUserModal(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-layout">
      {mobileMenuOpen && (
        <div
          className="admin-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
      />

      <div className={`admin-main ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
        <AdminNavbar
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="admin-content">
          <Outlet context={{ openShowUserModal }} />
        </main>

      </div>
      <AdminFooter />

      {/* Global ShowUserModal */}
      <ShowUserModal isOpen={showUserModal} onClose={closeShowUserModal} user={modalUser} />

    </div>
  );
}
