import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import "../styles/Login.css";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const res = await loginUser(form.email, form.password);

        if (!res || !res.success) {
        // Show error returned from loginUser
        setError(res?.message || "Login failed");
        setLoading(false);
        return;
        }

        // Success → navigate
        navigate("/dashboard");
    } catch (err) {
        setError("An unexpected error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to access your admin panel</p>

        <form onSubmit={handleSubmit} className="login-form">

          {/* Email */}
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Error */}
          {error && <p className="login-error">{error}</p>}

          {/* Submit */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="loader"></span>
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;
