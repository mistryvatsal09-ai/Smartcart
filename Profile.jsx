import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { setStoredUser } from "../utils/authStorage";

function Profile({ user, setUser }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/myorders`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (res.ok) {
        setStoredUser(data);
        setUser(data);
        alert("Profile Updated!");
        setPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return (
    <div className="main-container">
      <div className="empty-state">
        <i className="fa-solid fa-lock"></i>
        <h2>Access Denied</h2>
        <p>Please login to view your profile.</p>
      </div>
    </div>
  );

  return (
    <main className="main-container">
      <header className="page-header">
        <h1><i className="fa-solid fa-user-gear"></i> User Settings</h1>
        <p>Manage your account information and view order history.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {/* Profile Update Form */}
        <section className="card">
          <div className="card-header">
            <h2>Update Profile</h2>
          </div>
          <form className="auth-form" onSubmit={submitHandler} style={{ padding: '1.5rem' }}>
            <div className="form-group">
              <label>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <button className="btn-primary" type="submit">Update Account</button>
          </form>
        </section>

        {/* Orders Overview */}
        <section className="card">
          <div className="card-header">
            <h2>Order Overview</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666' }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                <p>No orders found.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.slice(-5).reverse().map((order) => (
                  <div key={order._id} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <span>Order #{order._id.slice(-6)}</span>
                      <span className={`badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>₹{order.totalPrice}</span>
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <Link to="/orders" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>View All Orders</Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
