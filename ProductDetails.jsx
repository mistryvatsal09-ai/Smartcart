import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const user = getStoredUser();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!user) {
            alert("Please login to add items to cart");
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/users/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ productId: id, quantity: qty }),
            });
            if (res.ok) {
                alert("Product added to cart!");
                navigate("/cart");
            } else {
                const error = await res.json();
                alert(error.message || "Failed to add to cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("An error occurred");
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to write a review");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ rating, comment }),
            });
            if (res.ok) {
                alert("Review submitted!");
                window.location.reload();
            } else {
                const error = await res.json();
                alert(error.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    if (loading) return <div className="loading-spinner">Loading Product...</div>;
    if (!product) return <div className="main-container">Product not found</div>;

    const renderStars = (num) => {
        return [...Array(5)].map((_, i) => (
            <i key={i} className={i < Math.floor(num) ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
        ));
    };

    return (
        <main className="main-container">
            <div className="product-details-page">
                <div className="details-grid">
                    <div className="details-image">
                        <img
                            src={product.image || "https://placehold.co/600x400?text=No+Image"}
                            alt={product.name}
                            onError={(e) => (e.target.src = "https://placehold.co/600x400?text=Error")}
                        />
                    </div>
                    <div className="details-content">
                        <header className="details-header">
                            <span className="details-category">{product.category?.name || 'Smart Collection'}</span>
                            <h1>{product.name}</h1>
                            <div className="details-rating">
                                {renderStars(product.rating)}
                                <span>({product.numReviews} Reviews)</span>
                            </div>
                        </header>

                        <div className="details-price-row">
                            <span className="details-price">₹{product.price}</span>
                            <span className="details-stock-status">
                                {product.countInStock > 0 ? (
                                    <span className="stock-in"><i className="fa-solid fa-check"></i> {product.countInStock} Left in Stock</span>
                                ) : (
                                    <span className="stock-out"><i className="fa-solid fa-xmark"></i> Out of Stock</span>
                                )}
                            </span>
                        </div>

                        <div className="details-description">
                            <h3>Description</h3>
                            <p>{product.description || "No description provided."}</p>
                        </div>

                        {product.countInStock > 0 && (
                            <div className="qty-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <h3>Quantity:</h3>
                                <select value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
                                    {[...Array(Math.min(product.countInStock, 10)).keys()].map(x => (
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="details-actions">
                            <button
                                className="btn-primary btn-large"
                                onClick={addToCart}
                                disabled={product.countInStock <= 0}
                            >
                                <i className="fa-solid fa-cart-plus"></i> Add to Cart
                            </button>
                            <button className="btn-secondary btn-large" onClick={() => navigate(-1)}>
                                <i className="fa-solid fa-arrow-left"></i> Back to Shop
                            </button>
                        </div>

                        <div className="details-features">
                            <div className="feature-item">
                                <i className="fa-solid fa-truck-fast"></i>
                                <span>Fast Shipping</span>
                            </div>
                            <div className="feature-item">
                                <i className="fa-solid fa-shield-halved"></i>
                                <span>Secure Checkout</span>
                            </div>
                            <div className="feature-item">
                                <i className="fa-solid fa-rotate-left"></i>
                                <span>7-Day Return</span>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="reviews-section card" style={{ marginTop: '2rem' }}>
                    <div className="card-header">
                        <h2><i className="fa-solid fa-comments"></i> Customer Reviews</h2>
                    </div>
                    <div style={{ padding: '2rem' }}>
                        <div className="reviews-grid">
                            <div className="reviews-list">
                                {product.reviews.length === 0 ? (
                                    <p>No reviews yet. Be the first to review!</p>
                                ) : (
                                    product.reviews.map((r, idx) => (
                                        <div key={idx} className="review-item">
                                            <div className="review-meta">
                                                <strong>{r.name}</strong>
                                                <div className="review-stars">{renderStars(r.rating)}</div>
                                                <small>{new Date(r.createdAt).toLocaleDateString()}</small>
                                            </div>
                                            <p>{r.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {user ? (
                                <div className="review-form card">
                                    <div className="card-header">
                                        <h3>Write a Review</h3>
                                    </div>
                                    <form onSubmit={submitReview} style={{ padding: '1.5rem' }}>
                                        <div className="form-group">
                                            <label>Rating</label>
                                            <select
                                                className="form-control"
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                                required
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                            >
                                                <option value="">Select...</option>
                                                <option value="1">1 - Poor</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="3">3 - Good</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="5">5 - Excellent</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Comment</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                required
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                                            ></textarea>
                                        </div>
                                        <button className="btn-primary" type="submit">Submit Review</button>
                                    </form>
                                </div>
                            ) : (
                                <div className="alert-info">Please login to write a review</div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default ProductDetails;
