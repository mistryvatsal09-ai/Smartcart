import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";
import { clearStoredUser } from "../utils/authStorage";

function AdminDashboard({ user, setUser }) {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
    const [view, setView] = useState("overview");
    const [editingProduct, setEditingProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackFilter, setFeedbackFilter] = useState({ category: "", status: "" });

    const [productForm, setProductForm] = useState({
        name: "", price: "", description: "", image: "", countInStock: "", category: ""
    });

    const logoutHandler = () => {
        clearStoredUser();
        setUser(null);
    };

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const [pRes, uRes, oRes, sRes, cRes, fRes] = await Promise.all([
                fetch("http://localhost:5000/api/products?pageSize=1000"),
                fetch("http://localhost:5000/api/users", config),
                fetch("http://localhost:5000/api/users/orders/all", config),
                fetch("http://localhost:5000/api/users/dashboard/stats", config),
                fetch("http://localhost:5000/api/categories"),
                fetch(`http://localhost:5000/api/feedback?category=${feedbackFilter.category}&status=${feedbackFilter.status}`, config)
            ]);

            const pData = await pRes.json();
            setProducts(pData.products || []);
            setUsers(await uRes.json());
            setOrders(await oRes.json());
            setStats(await sRes.json());
            setCategories(await cRes.json());
            setFeedbacks(await fRes.json());
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [feedbackFilter]);

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const url = editingProduct ? `http://localhost:5000/api/products/${editingProduct}` : "http://localhost:5000/api/products";
        const method = editingProduct ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify(productForm)
        });

        if (res.ok) {
            setEditingProduct(null);
            setProductForm({ name: "", price: "", description: "", image: "", countInStock: "", category: "" });
            fetchData();
        }
    };

    const handleOrderStatus = async (orderId, status) => {
        const res = await fetch(`http://localhost:5000/api/users/orders/${orderId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({ status })
        });
        if (res.ok) fetchData();
    };

    const handleUserAction = async (userId, action) => {
        const url = action === 'delete' ? `http://localhost:5000/api/users/${userId}` : `http://localhost:5000/api/users/${userId}/block`;
        const method = action === 'delete' ? "DELETE" : "PUT";

        const res = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) fetchData();
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Admin </span>
                </div>
                <nav className="sidebar-nav">
                    <button className={view === 'overview' ? 'active' : ''} onClick={() => setView('overview')}>
                        <i className="fa-solid fa-chart-pie"></i> Overview
                    </button>
                    <button className={view === 'products' ? 'active' : ''} onClick={() => setView('products')}>
                        <i className="fa-solid fa-box"></i> Products
                    </button>
                    <button className={view === 'categories' ? 'active' : ''} onClick={() => setView('categories')}>
                        <i className="fa-solid fa-layer-group"></i> Categories
                    </button>
                    <button className={view === 'users' ? 'active' : ''} onClick={() => setView('users')}>
                        <i className="fa-solid fa-users"></i> Users
                    </button>
                    <button className={view === 'orders' ? 'active' : ''} onClick={() => setView('orders')}>
                        <i className="fa-solid fa-cart-shopping"></i> Orders
                    </button>
                    <button className={view === 'feedback' ? 'active' : ''} onClick={() => setView('feedback')}>
                        <i className="fa-solid fa-comments"></i> Feedback
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <Link to="/" className="back-to-store">
                        <i className="fa-solid fa-arrow-left"></i> Back to Store
                    </Link>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h2>{view.charAt(0).toUpperCase() + view.slice(1)} Dashboard</h2>
                    <div className="admin-profile-container">
                        <div className="admin-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                            <span>Welcome Admin</span>
                            <div className="status-indicator"></div>
                            <i className={`fa-solid fa-chevron-down dropdown-arrow ${showProfileMenu ? 'open' : ''}`}></i>
                        </div>
                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                <button className="dropdown-item logout" onClick={logoutHandler}>
                                    <i className="fa-solid fa-power-off"></i> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="admin-content">
                    {view === "overview" && (
                        <div className="stats-grid">
                            <div className="stat-card revenue">
                                <div className="stat-icon"><i className="fa-solid fa-indian-rupee-sign"></i></div>
                                <div className="stat-info">
                                    <h3>Total Revenue</h3>
                                    <p>₹{stats.totalRevenue.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="stat-card orders">
                                <div className="stat-icon"><i className="fa-solid fa-bag-shopping"></i></div>
                                <div className="stat-info">
                                    <h3>Orders</h3>
                                    <p>{stats.totalOrders}</p>
                                </div>
                            </div>
                            <div className="stat-card products">
                                <div className="stat-icon"><i className="fa-solid fa-boxes-stacked"></i></div>
                                <div className="stat-info">
                                    <h3>Products</h3>
                                    <p>{stats.totalProducts}</p>
                                </div>
                            </div>
                            <div className="stat-card users">
                                <div className="stat-icon"><i className="fa-solid fa-user-group"></i></div>
                                <div className="stat-info">
                                    <h3>Total Users</h3>
                                    <p>{stats.totalUsers}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === "products" && (
                        <div className="products-view">
                            <div className="form-card-premium">
                                <h3>{editingProduct ? "Update Product" : "Add New Product"}</h3>
                                <form onSubmit={handleProductSubmit} className="premium-form">
                                    <div className="form-row">
                                        <div className="input-group">
                                            <label>Product Name</label>
                                            <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                                        </div>
                                        <div className="input-group">
                                            <label>Category</label>
                                            <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required>
                                                <option value="">Select Category</option>
                                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="input-group">
                                            <label>Price (₹)</label>
                                            <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                                        </div>
                                        <div className="input-group">
                                            <label>Stock Count</label>
                                            <input type="number" value={productForm.countInStock} onChange={e => setProductForm({ ...productForm, countInStock: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Image URL</label>
                                        <input value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Description</label>
                                        <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows="3"></textarea>
                                    </div>
                                    <div className="button-row">
                                        <button type="submit" className="submit-btn">{editingProduct ? "Update" : "Create"} Product</button>
                                        {editingProduct && <button type="button" onClick={() => setEditingProduct(null)} className="cancel-btn">Cancel</button>}
                                    </div>
                                </form>
                            </div>

                            <div className="data-table-container">
                                <h3>Manage Products</h3>
                                <table className="premium-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p._id}>
                                                <td><img src={p.image} alt="" className="table-img" /></td>
                                                <td>{p.name}</td>
                                                <td>₹{p.price}</td>
                                                <td>{p.countInStock}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button
                                                            onClick={() => {
                                                                setEditingProduct(p._id);
                                                                setProductForm({
                                                                    name: p.name || "",
                                                                    price: p.price || "",
                                                                    description: p.description || "",
                                                                    image: p.image || "",
                                                                    countInStock: p.countInStock || "",
                                                                    category: p.category?._id || p.category || ""
                                                                });
                                                            }}
                                                            className="edit-icon"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                        <button onClick={async () => { if (window.confirm("Delete this product?")) { await fetch(`http://localhost:5000/api/products/${p._id}`, { method: "DELETE", headers: { Authorization: `Bearer ${user.token}` } }); fetchData(); } }} className="delete-icon"><i className="fa-solid fa-trash-can"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {view === "categories" && (
                        <div className="products-view">
                            <div className="form-card-premium">
                                <h3>Add New Category</h3>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const name = e.target.catName.value;
                                    const res = await fetch("http://localhost:5000/api/categories", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
                                        body: JSON.stringify({ name })
                                    });
                                    if (res.ok) { e.target.reset(); fetchData(); }
                                }} className="premium-form">
                                    <div className="input-group">
                                        <label>Category Name</label>
                                        <input name="catName" required />
                                    </div>
                                    <button type="submit" className="submit-btn">Create Category</button>
                                </form>
                            </div>

                            <div className="data-table-container">
                                <h3>Store Categories</h3>
                                <table className="premium-table">
                                    <thead><tr><th>Name</th><th>Action</th></tr></thead>
                                    <tbody>
                                        {categories.map(c => (
                                            <tr key={c._id}>
                                                <td className="font-bold">{c.name}</td>
                                                <td>
                                                    <button onClick={async () => { if (window.confirm("Delete category?")) { await fetch(`http://localhost:5000/api/categories/${c._id}`, { method: "DELETE", headers: { Authorization: `Bearer ${user.token}` } }); fetchData(); } }} className="delete-icon"><i className="fa-solid fa-trash-can"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {view === "users" && (
                        <div className="data-table-container">
                            <h3>Portal Users</h3>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id}>
                                            <td className="font-bold">{u.name}</td>
                                            <td>{u.email}</td>
                                            <td><span className={`pill ${u.isAdmin ? 'admin' : 'user'}`}>{u.isAdmin ? 'Admin' : 'User'}</span></td>
                                            <td><span className={`status-dot ${u.isBlocked ? 'blocked' : 'active'}`}></span> {u.isBlocked ? 'Blocked' : 'Active'}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button onClick={() => handleUserAction(u._id, 'block')} className="action-link">{u.isBlocked ? 'Unblock' : 'Block'}</button>
                                                    <button onClick={() => handleUserAction(u._id, 'delete')} className="delete-icon"><i className="fa-solid fa-trash-can"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {view === "orders" && (
                        <div className="data-table-container">
                            <h3>Transaction History</h3>
                            <table className="premium-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Update Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o._id}>
                                            <td className="id-cell">#{o._id.slice(-8).toUpperCase()}</td>
                                            <td>{o.user?.name}</td>
                                            <td className="font-bold">₹{o.totalPrice}</td>
                                            <td><span className={`status-pill ${o.status.toLowerCase()}`}>{o.status}</span></td>
                                            <td>
                                                <select value={o.status} onChange={(e) => handleOrderStatus(o._id, e.target.value)} className="status-select">
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {view === "feedback" && (
                        <div className="feedback-view">
                            <div className="filter-bar">
                                <div className="filter-group">
                                    <label>Category</label>
                                    <select
                                        value={feedbackFilter.category}
                                        onChange={(e) => setFeedbackFilter({ ...feedbackFilter, category: e.target.value })}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Product">Product</option>
                                        <option value="Service">Service</option>
                                        <option value="Website">Website</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label>Status</label>
                                    <select
                                        value={feedbackFilter.status}
                                        onChange={(e) => setFeedbackFilter({ ...feedbackFilter, status: e.target.value })}
                                    >
                                        <option value="">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Reviewed">Reviewed</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>

                            <div className="data-table-container">
                                <h3>User Feedback</h3>
                                <div className="table-responsive">
                                    <table className="premium-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Category</th>
                                                <th>Subject / Message</th>
                                                <th>Rating</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feedbacks.map(f => (
                                                <tr key={f._id}>
                                                    <td>
                                                        <div className="user-info">
                                                            <span className="user-name">{f.user?.name}</span>
                                                            <span className="user-email">{f.user?.email}</span>
                                                        </div>
                                                    </td>
                                                    <td><span className="category-badge">{f.category}</span></td>
                                                    <td>
                                                        <div className="feedback-content-cell">
                                                            <strong>{f.subject}</strong>
                                                            <p className="truncated-msg">{f.message}</p>
                                                            {f.reply && <div className="reply-preview">Reply: {f.reply}</div>}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="rating-stars">
                                                            {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={f.status}
                                                            onChange={async (e) => {
                                                                const res = await fetch(`http://localhost:5000/api/feedback/${f._id}`, {
                                                                    method: "PUT",
                                                                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
                                                                    body: JSON.stringify({ status: e.target.value })
                                                                });
                                                                if (res.ok) fetchData();
                                                            }}
                                                            className={`status-select-inline ${f.status.toLowerCase()}`}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Reviewed">Reviewed</option>
                                                            <option value="Resolved">Resolved</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <div className="table-actions">
                                                            <button
                                                                onClick={async () => {
                                                                    const reply = window.prompt("Enter your reply:", f.reply || "");
                                                                    if (reply !== null) {
                                                                        const res = await fetch(`http://localhost:5000/api/feedback/${f._id}`, {
                                                                            method: "PUT",
                                                                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
                                                                            body: JSON.stringify({ reply })
                                                                        });
                                                                        if (res.ok) fetchData();
                                                                    }
                                                                }}
                                                                className="reply-btn"
                                                                title="Reply"
                                                            >
                                                                <i className="fa-solid fa-reply"></i>
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (window.confirm("Delete this feedback?")) {
                                                                        await fetch(`http://localhost:5000/api/feedback/${f._id}`, {
                                                                            method: "DELETE",
                                                                            headers: { Authorization: `Bearer ${user.token}` }
                                                                        });
                                                                        fetchData();
                                                                    }
                                                                }}
                                                                className="delete-icon"
                                                                title="Delete"
                                                            >
                                                                <i className="fa-solid fa-trash-can"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
