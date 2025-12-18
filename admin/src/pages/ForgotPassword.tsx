import { useState } from "react";
import { Mail } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { requestPasswordReset } = useUser(); // <-- we add this

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await requestPasswordReset(email);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <Link to="/" className="logo-link">
          <img src="./campify_logo.png" alt="Logo" className="login-logo" />
        </Link>
        <h1 className="login-title">Reset Password</h1>
        <p className="login-subtitle">Enter your email to receive reset link</p>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Send Reset Link
          </button>
        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;