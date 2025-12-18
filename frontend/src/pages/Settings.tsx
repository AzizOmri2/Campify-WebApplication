import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNotification } from '@/contexts/NotificationContext';
import './Settings.css';
import { User, Lock, Bell } from 'lucide-react';

const Settings = () => {
  const { user, updateUser, updatePassword } = useUser();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullName = (document.getElementById('full_name') as HTMLInputElement).value;
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const oldPassword = (document.getElementById('oldPassword') as HTMLInputElement)?.value;
      const newPassword = (document.getElementById('password') as HTMLInputElement)?.value;
      const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement)?.value;

      const anyPasswordFilled = oldPassword || newPassword || confirmPassword;

      // Password validation
      if (anyPasswordFilled) {
        if (!oldPassword) {
          error("Please enter your current password.");
          return;
        }

        if (!newPassword) {
          error("Please enter a new password.");
          return;
        }

        if (!confirmPassword) {
          error("Please confirm your new password.");
          return;
        }

        if (newPassword !== confirmPassword) {
          error("New password and confirmation do not match.");
          return;
        }

        // Call API to update password
        try {
          await updatePassword({
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword
          });
        } catch (err: any) {
          return; // stop profile update if password fails
        }
      }

      // Update profile only if password validation passed
      await updateUser({ full_name: fullName, email });

    } catch (err: any) {
      console.error(err);
      error(err.message || "Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="container">
        <h1 className="settings-title">Settings</h1>

        <form onSubmit={handleSubmit} className="settings-form">
          {/* Profile Section */}
          <div className="settings-section">
            <h2 className="settings-section-title">
              <User /> Profile
            </h2>
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label htmlFor="full_name">Full Name</label>
                <input id="full_name" type="text" defaultValue={user.full_name} required />
              </div>
              <div className="settings-form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" defaultValue={user.email} required />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="settings-section">
            <h2 className="settings-section-title">
              <Lock /> Password
            </h2>
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label htmlFor="oldPassword">Current Password</label>
                <input id="oldPassword" type="password" placeholder="Enter current password" />
              </div>
              <div className="settings-form-group">
                <label htmlFor="password">New Password</label>
                <input id="password" type="password" placeholder="Enter new password" />
              </div>
              <div className="settings-form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="settings-section">
            <h2 className="settings-section-title">
              <Bell /> Notifications
            </h2>
            <div className="settings-form-group">
              <label htmlFor="notifications">
                <input
                  id="notifications"
                  type="checkbox"
                  />
                Enable email notifications
              </label>
            </div>
          </div>

          <button type="submit" className="settings-submit-button" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
