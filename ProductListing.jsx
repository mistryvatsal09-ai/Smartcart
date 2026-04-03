import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

function ProductListing() {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState(initialCategory);
    const [maxPrice, setMaxPrice] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [pages, setPages] = useState(1);
    const [searchTrigger, setSearchTrigger] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                keyword,
                category,
                maxPrice,
                pageNumber
            }).toString();

            const res = await fetch(`http://localhost:5000/api/products?${query}`);
            const data = await res.json();
            setProducts(data.products || []);
            setPages(data.pages || 1);

            const catRes = await fetch("http://localhost:5000/api/categories");
            setCategories(await catRes.json());

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [category, maxPrice, pageNumber, searchTrigger]); // Search triggered on button click

    const handleSearch = (e) => {
        e.preventDefault();
        setPageNumber(1);
        setSearchTrigger((prev) => prev + 1);
    };

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
            <header className="page-header" style={{ textAlign: 'center', position: 'relative' }}>
                <h1>Explore Our Collection</h1>
                <p>Find the best products tailored just for you.</p>

            </header>

            <div className="listing-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
                {/* Sidebar Filters */}
                <aside className="filters-sidebar">
                    <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '2rem' }}>
                        <h3><i className="fa-solid fa-filter"></i> Filters</h3>
                        <hr style={{ margin: '1rem 0', opacity: 0.1 }} />

                        <form onSubmit={handleSearch}>
                            <div className="form-group">
                                <label>Search</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input placeholder="Search products..." value={keyword} onChange={e => setKeyword(e.target.value)} />
                                    <button type="submit" className="btn-icon"><i className="fa-solid fa-magnifying-glass"></i></button>
                                </div>
                            </div>
                        </form>

                        <div className="form-group">
                            <label>Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="form-control">
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Max Price (₹{maxPrice || '∞'})</label>
                            <input type="range" min="0" max="100000" step="1000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ width: '100%' }} />
                        </div>

                        <button
                            className="btn-secondary"
                            style={{ width: '100%' }}
                            onClick={() => {
                                setKeyword("");
                                setCategory("");
                                setMaxPrice("");
                                setPageNumber(1);
                                setSearchTrigger((prev) => prev + 1);
                            }}
                        >
                            Clear All
                        </button>
                    </div>
                </aside>

                {/* Products Grid */}
                <section className="listing-content">
                    {loading ? (
                        <div className="loading-spinner">Loading products...</div>
                    ) : (
                        <>
                            <div className="product-grid">
                                {products.length === 0 ? (
                                    <p>No products found matching your criteria.</p>
                                ) : (
                                    products.map(p => (
                                        <div className="product-card" key={p._id}>
                                            <Link to={`/product/${p._id}`} className="product-img-wrapper">
                                                <img src={p.image} alt={p.name} className="product-img" />
                                                <div className="product-badge">{p.category?.name}</div>
                                            </Link>
                                            <div className="product-details">
                                                <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    <h3 title={p.name}>{p.name}</h3>
                                                </Link>
                                                <p className="product-desc">{p.description?.slice(0, 60)}...</p>
                                                <div className="product-footer">
                                                    <span className="price">₹{p.price}</span>
                                                    <button className="btn-icon" onClick={() => addToCart(p._id)} title="Add to Cart">
                                                        <i className="fa-solid fa-cart-shopping"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Pagination */}
                            <div className="pagination" style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                {[...Array(pages).keys()].map(x => (
                                    <button
                                        key={x + 1}
                                        className={`nav-btn ${x + 1 === pageNumber ? 'register-btn' : ''}`}
                                        onClick={() => setPageNumber(x + 1)}
                                    >
                                        {x + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}

export default ProductListing;
