import { Link } from "react-router-dom";
import { clearStoredUser } from "../utils/authStorage";

function Navbar({ user, setUser }) {
  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <i className="fa-solid fa-shop"></i> SmartCart
        </Link>

        <div className="nav-links">
          {/* Public Links */}
          <Link to="/" className="nav-item"><i className="fa-solid fa-house"></i> Home</Link>
          <Link to="/products" className="nav-item"><i className="fa-solid fa-boxes-stacked"></i> Products</Link>
          {(!user || !user.isAdmin) && (
            <>
              <Link to="/about" className="nav-item"><i className="fa-solid fa-circle-info"></i> About Us</Link>
            </>
          )}

          {user ? (
            <>
              {/* User Links */}
              {!user.isAdmin && (
                <>
                  <Link to="/orders" className="nav-item">
                    <i className="fa-solid fa-truck-fast"></i> Orders
                  </Link>
                  <Link to="/cart" className="nav-item">
                    <i className="fa-solid fa-cart-shopping"></i> Cart
                  </Link>
                  <Link to="/feedback" className="nav-item">
                    <i className="fa-solid fa-comment-dots"></i> Feedback
                  </Link>
                </>
              )}

              {/* Admin Links */}
              {user.isAdmin && (
                <>
                  <Link to="/admin" className="nav-item admin-link">
                    <i className="fa-solid fa-gauge-high"></i> Admin
                  </Link>
                  <Link to="/admin/categories" className="nav-item admin-link">
                    <i className="fa-solid fa-layer-group"></i> Categories
                  </Link>
                </>
              )}

              {/* Profile & Logout */}
              <Link to="/profile" className="nav-item profile-link">
                <i className="fa-solid fa-circle-user"></i> {user.name}
              </Link>
              <button onClick={logout} className="nav-btn logout-btn">
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item"><i className="fa-solid fa-right-to-bracket"></i> Login</Link>
              <Link to="/register" className="nav-btn register-btn"><i className="fa-solid fa-user-plus"></i> Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
