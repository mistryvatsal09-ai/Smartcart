import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Cart({ user }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/cart`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const data = await res.json();
            setCartItems(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const removeFromCart = async (productId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/cart/${productId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(data);
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ productId, quantity })
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * (item.product?.price || 0), 0);

    if (loading) return <div className="loading-spinner">Loading Cart...</div>;

    return (
        <main className="main-container">
            <header className="page-header">
                <h1>
                    <i className="fa-solid fa-cart-shopping"></i> Your Shopping Cart
                </h1>
                <p>Review your items and proceed to checkout.</p>
            </header>

            <div className="cart-container">
                {cartItems.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-cart-arrow-down"></i>
                        <p>Your cart is empty.</p>
                        <Link to="/products" className="btn-primary">Browse Products</Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div className="cart-item" key={item.product?._id}>
                                    <img src={item.product?.image || "https://placehold.co/100"} alt={item.product?.name} className="cart-item-img" />
                                    <div className="cart-item-info">
                                        <h3>{item.product?.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                            <div className="qty-selector" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                                                <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)} style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>-</button>
                                                <span style={{ padding: '0 0.5rem', fontWeight: 'bold' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)} style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>+</button>
                                            </div>
                                            <p className="cart-item-price">₹{item.product?.price} each</p>
                                        </div>
                                    </div>
                                    <div className="cart-item-actions" style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '800', margin: '0 0 0.5rem 0' }}>₹{item.product?.price * item.quantity}</p>
                                        <button className="btn-remove" onClick={() => removeFromCart(item.product?._id)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <button className="btn-checkout" onClick={() => navigate("/checkout")}>
                                Proceed to Checkout
                            </button>
                            <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#666', textDecoration: 'none' }}>
                                <i className="fa-solid fa-arrow-left"></i> Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default Cart;
