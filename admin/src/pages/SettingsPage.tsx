import { User as UserIcon, Bell, Shield, Palette, Globe, CreditCard } from "lucide-react";
import "@/styles/pages.css";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({
    emailNotifications: true,
    desktopNotifications: false,
    marketingEmails: false,
  });

  const settingsSections = [
    { title: "Profile", description: "Manage your personal information and preferences", icon: UserIcon, path: "/profile"},
    { title: "Notifications", description: "Configure how you receive alerts and updates", icon: Bell, path: "/settings"},
    { title: "Security", description: "Password, two-factor authentication, and sessions", icon: Shield, path: "/profile"},
    { title: "Appearance", description: "Customize the look and feel of your dashboard", icon: Palette, path: "/settings" },
    { title: "Language & Region", description: "Set your preferred language and timezone", icon: Globe, path: "/settings" },
    { title: "Billing", description: "Manage your subscription and payment methods", icon: CreditCard, path: "/settings" },
  ];

  const handleToggle = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCardClick = (section: typeof settingsSections[0]) => {
    if (section.path) {
      navigate(section.path);
    }
  };

  return (
    <div className="page-enter space-y-6">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your application preferences{user ? `, ${user.full_name}` : ""}.</p>
        </div>
      </div>

      <div className="grid-3">
        {settingsSections.map((section, index) => (
          <div key={section.title} className={`card hoverable stagger-${Math.min(index + 1, 5)}`} 
            onClick={() => handleCardClick(section)} 
            style={{ cursor: section.path ? "pointer" : "default" }}>

            <div className="settings-card">
              <div className="settings-icon">
                <section.icon />
              </div>
              <div>
                <h3 className="settings-title">{section.title}</h3>
                <p className="settings-description">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="section-title">Quick Settings</h2>
        <div className="space-y-4">
          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Receive email updates about your orders" },
            { key: "desktopNotifications", label: "Desktop Notifications", desc: "Show alerts on your desktop" },
            { key: "marketingEmails", label: "Marketing Emails", desc: "Receive tips and product updates" },
          ].map((item) => (
            <div key={item.key} className="toggle-item">
              <div>
                <p className="toggle-label">{item.label}</p>
                <p className="toggle-description">{item.desc}</p>
              </div>
              <button
                className={`toggle-switch ${toggles[item.key] ? "on" : "off"}`}
                onClick={() => handleToggle(item.key)}
              >
                <span className="toggle-knob" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
