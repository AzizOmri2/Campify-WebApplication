import { User, Bell, Shield, Palette, Globe, CreditCard } from "lucide-react";
import "@/styles/pages.css";

const settingsSections = [
  { title: "Profile", description: "Manage your personal information and preferences", icon: User },
  { title: "Notifications", description: "Configure how you receive alerts and updates", icon: Bell },
  { title: "Security", description: "Password, two-factor authentication, and sessions", icon: Shield },
  { title: "Appearance", description: "Customize the look and feel of your dashboard", icon: Palette },
  { title: "Language & Region", description: "Set your preferred language and timezone", icon: Globe },
  { title: "Billing", description: "Manage your subscription and payment methods", icon: CreditCard },
];

export default function SettingsPage() {
  return (
    <div className="page-enter space-y-6">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and application preferences.</p>
        </div>
      </div>

      <div className="grid-3">
        {settingsSections.map((section, index) => (
          <div key={section.title} className={`card hoverable stagger-${Math.min(index + 1, 5)}`}>
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
          <div className="toggle-item">
            <div>
              <p className="toggle-label">Email Notifications</p>
              <p className="toggle-description">Receive email updates about your orders</p>
            </div>
            <button className="toggle-switch on">
              <span className="toggle-knob" />
            </button>
          </div>
          <div className="toggle-item">
            <div>
              <p className="toggle-label">Desktop Notifications</p>
              <p className="toggle-description">Show alerts on your desktop</p>
            </div>
            <button className="toggle-switch off">
              <span className="toggle-knob" />
            </button>
          </div>
          <div className="toggle-item">
            <div>
              <p className="toggle-label">Marketing Emails</p>
              <p className="toggle-description">Receive tips and product updates</p>
            </div>
            <button className="toggle-switch off">
              <span className="toggle-knob" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
