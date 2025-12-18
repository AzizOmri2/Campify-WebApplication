import { useState, useRef, useEffect } from "react";
import { Bell, User, LogOut, ChevronDown, Menu, Settings } from "lucide-react";
import "@/styles/AdminNavbar.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface AdminNavbarProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
}

export function AdminNavbar({ sidebarCollapsed, onMobileMenuToggle }: AdminNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useUser();

  const navigate = useNavigate();

  const goToSettings = () => {
    navigate("/settings");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navbarClass = `navbar ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`;

  return (
    <header className={navbarClass}>
      <button onClick={onMobileMenuToggle} className="navbar-mobile-btn">
        <Menu />
      </button>

      <div />

      <div className="navbar-actions">
        <button className="navbar-notification-btn">
          <Bell />
          <span className="navbar-notification-badge" />
        </button>

        <div ref={dropdownRef} className="navbar-user">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="navbar-user-btn">
            <div className="navbar-user-avatar">
              <User />
            </div>
            <span className="navbar-user-name">{user.full_name}</span>
            <ChevronDown className={`navbar-user-chevron ${dropdownOpen ? "open" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="navbar-dropdown">
              <button className="navbar-dropdown-item" onClick={goToProfile} title="Profile">
                <User />
                Profile
              </button>
              <button className="navbar-dropdown-item" onClick={goToSettings} title="Settings">
                <Settings />
                Settings
              </button>
              <button className="navbar-dropdown-item danger" onClick={logout} title="Logout">
                <LogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
