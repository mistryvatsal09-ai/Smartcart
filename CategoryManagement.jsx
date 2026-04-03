import { useState, useEffect } from "react";

function CategoryManagement({ user }) {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setName("");
        setDescription("");
        setImage("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId
            ? `http://localhost:5000/api/categories/${editingId}`
            : "http://localhost:5000/api/categories";

        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ name, description, image })
            });

            if (res.ok) {
                alert(editingId ? "Category updated" : "Category created");
                resetForm();
                fetchCategories();
            } else {
                const data = await res.json();
                alert(data.message || "Operation failed");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (cat) => {
        setName(cat.name);
        setDescription(cat.description);
        setImage(cat.image);
        setEditingId(cat._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            if (res.ok) {
                fetchCategories();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="main-container">
            <header className="page-header">
                <h1><i className="fa-solid fa-layer-group"></i> Category Management</h1>
                <p>Organize your products into categories.</p>
            </header>

            <div className="dashboard-grid">
                <section className="form-section">
                    <div className="card form-card">
                        <div className="card-header">
                            <h2>{editingId ? "Edit Category" : "Add Category"}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="form-group">
                                <label>Category Name</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input value={image} onChange={(e) => setImage(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingId ? "Update" : "Create"}
                                </button>
                                {editingId && <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>}
                            </div>
                        </form>
                    </div>
                </section>

                <section className="list-section">
                    <div className="card">
                        <div className="card-header">
                            <h2>All Categories</h2>
                        </div>
                        <div style={{ padding: '1rem' }}>
                            {categories.map(cat => (
                                <div key={cat._id} className="review-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        {cat.image && <img src={cat.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />}
                                        <div>
                                            <h4 style={{ margin: 0 }}>{cat.name}</h4>
                                            <small>{cat.description}</small>
                                        </div>
                                    </div>
                                    <div className="admin-actions">
                                        <button className="btn-icon btn-edit" onClick={() => handleEdit(cat)}><i className="fa-solid fa-pen"></i></button>
                                        <button className="btn-icon btn-delete" onClick={() => handleDelete(cat._id)}><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default CategoryManagement;
