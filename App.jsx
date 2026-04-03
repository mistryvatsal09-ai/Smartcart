import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryManagement from "./pages/CategoryManagement";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Feedback from "./pages/Feedback";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import { getStoredUser, setStoredUser, clearStoredUser } from "./utils/authStorage";

import "./App.css";

function App() {
    const [user, setUser] = useState(getStoredUser());
    const location = useLocation();

    useEffect(() => {
        if (user) {
            setStoredUser(user);
        } else {
            clearStoredUser();
        }
    }, [user]);

    // Check if current path is an admin route
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar user={user} setUser={setUser} />}
            <Routes>
                {/* Public & User Routes */}
                <Route path="/" element={<Home user={user} />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<Register setUser={setUser} />} />
                <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
                <Route path="/cart" element={user ? <Cart user={user} /> : <Navigate to="/login" />} />
                <Route path="/checkout" element={user ? <Checkout user={user} /> : <Navigate to="/login" />} />
                <Route path="/orders" element={user ? <Orders user={user} /> : <Navigate to="/login" />} />
                <Route path="/feedback" element={user ? <Feedback user={user} /> : <Navigate to="/login" />} />

                {/* Separate Admin Portal Routes */}
                <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
                <Route
                    path="/admin"
                    element={user && user.isAdmin ? <AdminDashboard user={user} setUser={setUser} /> : <Navigate to="/admin/login" />}
                />
                <Route
                    path="/admin/categories"
                    element={user && user.isAdmin ? <CategoryManagement user={user} /> : <Navigate to="/admin/login" />}
                />

                {/* Catch-all or Redirects */}
                <Route path="/admin/*" element={user && user.isAdmin ? <AdminDashboard user={user} setUser={setUser} /> : <Navigate to="/admin/login" />} />
            </Routes>
            {!isAdminRoute && <Footer />}
        </>
    );
}

export default App;
