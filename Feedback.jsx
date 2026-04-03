import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feedback.css";

const Feedback = ({ user }) => {
    const [activeTab, setActiveTab] = useState("submit");
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        category: "Product",
        subject: "",
        message: "",
        rating: 5,
    });

    useEffect(() => {
        if (activeTab === "view") {
            fetchMyFeedbacks();
        }
    }, [activeTab]);

    const fetchMyFeedbacks = async () => {
        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get("http://localhost:5000/api/feedback/myfeedback", config);
            setFeedbacks(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch feedbacks");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post("http://localhost:5000/api/feedback", formData, config);
            setSuccess("Thank you! Your feedback has been submitted successfully.");
            setFormData({
                category: "Product",
                subject: "",
                message: "",
                rating: 5,
            });
            setTimeout(() => setSuccess(""), 5000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-container">
            <div className="feedback-header">
                <h1>User Feedback</h1>
                <p>We value your thoughts and suggestions to improve our service.</p>
            </div>

            <div className="feedback-tabs">
                <button
                    className={activeTab === "submit" ? "active" : ""}
                    onClick={() => setActiveTab("submit")}
                >
                    Submit Feedback
                </button>
                <button
                    className={activeTab === "view" ? "active" : ""}
                    onClick={() => setActiveTab("view")}
                >
                    My Feedback Status
                </button>
            </div>

            <div className="feedback-content">
                {activeTab === "submit" ? (
                    <div className="feedback-form-card">
                        <h2>Send us your feedback</h2>
                        {error && <div className="alert alert-error">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Product">Product</option>
                                    <option value="Service">Service</option>
                                    <option value="Website">Website</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="What is this about?"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    name="message"
                                    rows="5"
                                    placeholder="Tell us more about your experience..."
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Rating (1-5)</label>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <label key={star} className="star-label">
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={star}
                                                checked={parseInt(formData.rating) === star}
                                                onChange={handleInputChange}
                                            />
                                            <span className="star-icon">{star} ★</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="feedback-list">
                        <h2>Your Previous Feedbacks</h2>
                        {loading ? (
                            <p>Loading your feedbacks...</p>
                        ) : feedbacks.length === 0 ? (
                            <p className="no-data">You haven't submitted any feedback yet.</p>
                        ) : (
                            <div className="feedback-cards">
                                {feedbacks.map((item) => (
                                    <div key={item._id} className="feedback-card">
                                        <div className="card-header">
                                            <span className={`status-badge ${item.status.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                            <span className="feedback-date">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3>{item.subject}</h3>
                                        <p className="category-tag">{item.category}</p>
                                        <p className="message-preview">{item.message}</p>
                                        <div className="rating-display">
                                            {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                                        </div>
                                        {item.reply && (
                                            <div className="admin-reply">
                                                <strong>Admin Response:</strong>
                                                <p>{item.reply}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;
