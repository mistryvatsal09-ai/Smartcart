import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";
import { getStoredUser } from "../utils/authStorage";

function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [carouselSlides, setCarouselSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const pRes = await fetch("http://localhost:5000/api/products");
            const pData = await pRes.json();
            setProducts(pData.products || []);

            const cRes = await fetch("http://localhost:5000/api/categories");
            setCategories(await cRes.json());

            const carRes = await fetch("http://localhost:5000/api/carousel");
            const carData = await carRes.json();
            if (carData.length > 0) setCarouselSlides(carData);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addToCart = async (productId) => {
        const user = getStoredUser();
        if (!user) {
            alert("Please login to add items to cart");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/users/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ productId, quantity: 1 }),
            });
            if (res.ok) alert("Added to cart!");
            else alert("Failed to add");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="main-container">
            {/* HERO SECTION */}
            <Carousel slides={carouselSlides.length > 0 ? carouselSlides : undefined} />

            {/* CATEGORIES PREVIEW */}
            <section className="categories-section" style={{ marginBottom: '4rem' }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem' }}>Popular Categories</h2>
                    <p>Browser products by their niche</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    {categories.map(cat => (
                        <Link key={cat._id} to={`/products?category=${cat._id}`} className="card" style={{ padding: '1.5rem', textAlign: 'center', textDecoration: 'none', transition: 'transform 0.3s ease' }}>
                            <div style={{ width: '80px', height: '80px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <i className="fa-solid fa-layer-group" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                            </div>
                            <h3 style={{ margin: 0 }}>{cat.name}</h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Explore Collection</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="featured-section">
                <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem' }}>Latest Hardware</h2>
                        <p>Fresh items just arrived in our store</p>
                    </div>
                    <Link to="/products" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>View All <i className="fa-solid fa-arrow-right"></i></Link>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading products...</div>
                ) : (
                    <div className="product-grid">
                        {products.slice(0, 4).map((p) => (
                            <div className="product-card" key={p._id}>
                                <Link to={`/product/${p._id}`} className="product-img-wrapper">
                                    <img src={p.image} alt={p.name} className="product-img" />
                                    <div className="product-badge">Stock: {p.countInStock}</div>
                                </Link>
                                <div className="product-details">
                                    <h3 title={p.name}>{p.name}</h3>
                                    <p className="product-desc">{p.description?.slice(0, 60)}...</p>
                                    <div className="product-footer">
                                        <span className="price">₹{p.price}</span>
                                        <div className="card-actions">
                                            <button className="btn-add-cart" onClick={() => addToCart(p._id)} disabled={!p.countInStock}>
                                                <i className="fa-solid fa-cart-plus"></i>
                                            </button>
                                            <Link to={`/product/${p._id}`} className="btn-icon">
                                                <i className="fa-solid fa-eye"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;
