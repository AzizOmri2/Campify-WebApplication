import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApi } from "@/contexts/ApiContext";
import { useNotification } from "@/contexts/NotificationContext";
import { useUser } from "@/contexts/UserContext";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { success, error } = useNotification();
  const { resetPassword } = useUser();
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      error("Invalid or expired reset link.");
      return;
    }

    if (password !== confirm) {
      error("Passwords do not match ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(token, password);

      if (res.success) {
        success("Your password has been updated 🎉", "Password Reset");

        setTimeout(() => {
          navigate("/"); // return to home or login
        }, 1200);
      } else {
        error(res.message || "Unable to reset password.");
      }
    } catch (err: any) {
      error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-wrapper fade-in">
      <div className="reset-card">
        <h2>Reset Password 🔐</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;