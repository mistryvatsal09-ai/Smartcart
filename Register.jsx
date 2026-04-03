import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { setStoredUser } from "../utils/authStorage";

function Register({ setUser }) {
  const [name, setName] = useState("");
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
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
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
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h1>Join SmartCart</h1>
            <p>Start your shopping journey today</p>
          </div>

          <form className="auth-form" onSubmit={submitHandler}>
            {error && (
              <div className="auth-error-alert">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <div className="auth-form-group">
              <label>Full Name</label>
              <div className="auth-input-wrapper">
                <i className="fa-solid fa-user"></i>
                <input
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating account..." : (
                <>
                  Register <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="auth-page-footer">
            <p>
              Already have an account?
              <Link to="/login" className="auth-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-bg-circle circle-1"></div>
      <div className="auth-bg-circle circle-2"></div>
    </div>
  );
}

export default Register;
