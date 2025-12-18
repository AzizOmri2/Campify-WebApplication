import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const { resetPassword } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await resetPassword(token, password);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <Link to="/" className="logo-link">
          <img src="./campify_logo.png" alt="Logo" className="login-logo" />
        </Link>
        <h1 className="login-title">Set New Password</h1>
        <p className="login-subtitle">Enter your new password below to update your account.</p>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              placeholder="New Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;