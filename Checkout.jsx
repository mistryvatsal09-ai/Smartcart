import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ user }) {
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/cart`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            const data = await res.json();
            setCartItems(data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchCart();
    }, [user]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (contactNumber.length !== 10) {
            alert("Please enter a valid 10-digit contact number.");
            return;
        }

        const orderData = {
            orderItems: cartItems.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                image: item.product.image,
                price: item.product.price,
                product: item.product._id
            })),
            shippingAddress: { address, city, postalCode, country },
            contactNumber,
            totalPrice: cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0)
        };

        try {
            const res = await fetch("http://localhost:5000/api/users/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                alert("Order placed successfully!");
                navigate("/orders");
            } else {
                const error = await res.json();
                alert(error.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * (item.product?.price || 0), 0);

    return (
        <main className="main-container">
            <header className="page-header">
                <h1><i className="fa-solid fa-truck-ramp-box"></i> Checkout</h1>
                <p>Provide your shipping details to complete the purchase.</p>
            </header>

            <div className="dashboard-grid">
                <section className="form-section">
                    <div className="card form-card">
                        <div className="card-header">
                            <h2>Shipping Information</h2>
                        </div>
                        <form onSubmit={handlePlaceOrder} className="product-form">
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    placeholder="House No, Street name"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input value={city} onChange={(e) => setCity(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input value={country} onChange={(e) => setCountry(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
                                <input
                                    type="tel"
                                    placeholder="10-digit mobile number"
                                    value={contactNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, ""); // Only digits
                                        if (val.length <= 10) setContactNumber(val);
                                    }}
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit mobile number"
                                    required
                                />
                                {contactNumber.length > 0 && contactNumber.length < 10 && (
                                    <small style={{ color: 'red' }}>Must be 10 digits</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Payment Method</label>
                                <input value="Cash on Delivery" disabled className="form-control" />
                            </div>
                            <button type="submit" className="btn-primary btn-large" style={{ width: '100%' }}>
                                <i className="fa-solid fa-check-double"></i> Confirm & Place Order
                            </button>
                        </form>
                    </div>
                </section>

                <section className="list-section">
                    <div className="card">
                        <div className="card-header">
                            <h2>Order Summary</h2>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            {cartItems.map(item => (
                                <div key={item.product?._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <img src={item.product?.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                        <div>
                                            <p style={{ fontWeight: '600', margin: 0 }}>{item.product?.name}</p>
                                            <small>{item.quantity} x ₹{item.product?.price}</small>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: '600' }}>₹{item.quantity * item.product?.price}</span>
                                </div>
                            ))}
                            <div style={{ marginTop: '1.5rem', borderTop: '2px solid #555', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800' }}>
                                    <span>Total Amount</span>
                                    <span style={{ color: 'var(--primary-color)' }}>₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Checkout;
