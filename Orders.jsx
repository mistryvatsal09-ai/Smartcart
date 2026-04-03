import { useState, useEffect } from "react";

function Orders({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users/myorders", {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const data = await res.json();
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    if (loading) return <div className="loading-spinner">Loading Orders...</div>;

    return (
        <main className="main-container">
            <header className="page-header">
                <h1><i className="fa-solid fa-box-open"></i> My Orders</h1>
                <p>Track your purchases and order status.</p>
            </header>

            <div className="orders-list">
                {orders.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-box-archive"></i>
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="card" style={{ marginBottom: '2rem' }}>
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                                <div>
                                    <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>ORDER ID: </span>
                                    <span style={{ fontWeight: '700' }}>#{order._id.toUpperCase()}</span>
                                </div>
                                <span className={`badge status-${order.status.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                    {order.status}
                                </span>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <div className="order-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                            <div>
                                                <h4 style={{ margin: 0 }}>{item.name}</h4>
                                                <p style={{ margin: 0, color: '#6b7280' }}>Qty: {item.quantity} | ₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h5 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Shipping Address</h5>
                                        <p style={{ margin: 0 }}>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                        <p style={{ margin: 0 }}>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                                        <p style={{ margin: '0.5rem 0 0 0', fontWeight: '600' }}><i className="fa-solid fa-phone"></i> {order.contactNumber}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, color: '#6b7280' }}>Total Amount</p>
                                        <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem' }}>₹{order.totalPrice}</h3>
                                        <p style={{ margin: '0.25rem 0 0 0', color: '#10b981', fontSize: '0.8rem' }}>
                                            <i className="fa-solid fa-circle-check"></i> {order.paymentMethod}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}

export default Orders;
