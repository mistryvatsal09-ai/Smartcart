import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/authStorage";

function AddProduct() {
    const user = getStoredUser();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [productForm, setProductForm] = useState({
        name: "", price: "", description: "", image: "", countInStock: "", category: ""
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        const fetchCategories = async () => {
            const res = await fetch("http://localhost:5000/api/categories");
            const data = await res.json();
            setCategories(data);
        };
        fetchCategories();
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(productForm)
            });

            if (res.ok) {
                alert("Product Added Successfully!");
                navigate("/products");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to add product");
            }
        } catch (error) {
            console.error(error);
            alert("Error adding product");
        }
    };

    return (
        <main className="main-container">
            <header className="page-header">
                <h1>Add New Product</h1>
                <p>Fill in the details below to list a new product for sale.</p>
            </header>

            <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            value={productForm.name}
                            onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                            required
                            placeholder="Enter product name"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                value={productForm.price}
                                onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                                required
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-group">
                            <label>Stock Count</label>
                            <input
                                type="number"
                                value={productForm.countInStock}
                                onChange={e => setProductForm({ ...productForm, countInStock: e.target.value })}
                                required
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={productForm.category}
                            onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            value={productForm.image}
                            onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={productForm.description}
                            onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                            rows="4"
                            placeholder="Tell us about the product..."
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Add Product
                    </button>
                </form>
            </div>
        </main>
    );
}

export default AddProduct;
