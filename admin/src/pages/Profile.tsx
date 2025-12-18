import { User } from "lucide-react";
import "@/styles/pages.css";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";


export default function Profile() {
  const { user, updateUser, updatePassword } = useUser();
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({ 
        name: user.full_name, 
        email: user.email,
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setSaving(true);

    const wantsPasswordChange =
      formData.oldPassword ||
      formData.newPassword ||
      formData.confirmNewPassword;

    // ----- PASSWORD LOGIC -----
    if (wantsPasswordChange) {
      try {
        await updatePassword({
          old_password: formData.oldPassword,
          new_password: formData.newPassword,
          confirm_password: formData.confirmNewPassword,
        });

        // Clear password fields ONLY on success
        setFormData(prev => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));
      } catch (err: any) {
        setSaving(false);
        return; // ⛔ STOP PROFILE UPDATE
      }
    }

    // ----- PROFILE UPDATE (ONLY IF PASSWORD OK OR EMPTY) -----
    await updateUser({
      full_name: formData.name,
      email: formData.email,
    });

    setSaving(false);
  };

  return (
    <div className="page-enter space-y-6">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>View and manage your personal information.</p>
        </div>
      </div>

      <div className="grid-3">
        <div className="card hoverable">
          <div className="profile-card">
            <div className="profile-icon">
              <User />
            </div>
            <div>
              <h3 className="profile-name">{user.full_name}</h3>
              <p className="profile-role">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Profile Details</h2>
        <form className="profile-form space-y-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input"/>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input"/>
          </div>

          {/* Password update section */}
          <div className="section-subtitle">Change Password</div>

          <div className="form-group">
            <label htmlFor="oldPassword">Old Password:</label>
            <input type="password" id="oldPassword" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="form-input"/>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} className="form-input"/>
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} className="form-input"/>
          </div>

          <div className="form-group">
            <label>Role:</label>
            <input type="text" value={user.role} disabled className="form-input disabled" />
          </div>

          <div className="form-group">
            <label>Joined On:</label>
            <input type="text"
              value={new Date(user.joined).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })} disabled className="form-input disabled"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}