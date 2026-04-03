import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { setStoredUser } from "../utils/authStorage";

function AdminLogin({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (!data.isAdmin) {
        throw new Error("Access denied. Admin privileges required.");
      }

      setStoredUser(data);
      setUser(data);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-brand">
            <div className="brand-icon">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h1>Admin Panel</h1>
            <p>Secure Enterprise Portal</p>
          </div>

          <form className="admin-form" onSubmit={submitHandler}>
            {error && (
              <div className="alert-error">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <div className="form-input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-envelope"></i>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-input-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <i className="fa-solid fa-lock"></i>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? (
                <span className="loader"></span>
              ) : (
                <>
                  Login to Dashboard
                  <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="admin-footer">
            <p>&copy; 2026 Admin Panel. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="bg-shape shape-3"></div>
    </div>
  );
}

export default AdminLogin;
