import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { setStoredUser } from "../utils/authStorage";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

      setStoredUser(data);
      setUser(data);
      navigate(data.isAdmin ? "/admin" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page-container">
        <div className="auth-page-card">
          <div className="auth-page-brand">
            <div className="auth-brand-icon">
              <i className="fa-solid fa-right-to-bracket"></i>
            </div>
            <h1>SmartCart</h1>
            <p>Sign in to continue shopping</p>
          </div>

          <form className="auth-form" onSubmit={submitHandler}>
            {error && (
              <div className="auth-error-alert">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <div className="auth-form-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <div className="auth-input-wrapper">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : (
                <>
                  Login <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="auth-page-footer">
            <p>
              New here?
              <Link to="/register" className="auth-link">Create an account</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-bg-circle circle-1"></div>
      <div className="auth-bg-circle circle-2"></div>
    </div>
  );
}

export default Login;
