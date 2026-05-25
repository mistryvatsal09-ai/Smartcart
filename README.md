# 🛒 E-Commerce Website(Smartcart)

A full-stack online shopping platform where users can browse products, manage their cart, place orders, and make secure payments — all in one place. Built with a modern tech stack and a clean, role-based system for both customers and admins.

---

## 🚀 Live Demo

> Coming soon 

---

## 📌 About the Project

This project is a complete e-commerce solution designed to make online shopping simple and efficient. Whether you're a customer looking for products or an admin managing the store, the platform handles everything smoothly.

**Two main roles:**
- 👤 **User** — Browse, search, cart, order, feedback
- 🛠️ **Admin** — Manage products, categories, orders, users, and analytics

---

## ✨ Features

### 👤 User Features
- Register & login with JWT-based authentication
- Browse and search products by name or category
- Add products to cart and place orders
- View order history and track order status
- Submit feedback and ratings
- Manage profile information

### 🛠️ Admin Features
- Secure admin login (`isAdmin` flag based)
- Full CRUD on products and categories
- Manage homepage carousel/banner images
- View and update order statuses (Pending → Shipped → Delivered)
- Block/unblock user accounts
- View all customer feedbacks
- Dashboard with analytics counters

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, MongoDB Compass |
| Auth | JWT (JSON Web Token) |


---

## 🗃️ Database Collections

| Collection | Purpose |
|---|---|
| `users` | Stores user info, cart, auth flags |
| `products` | Product listings with images & stock |
| `orders` | Order records with status tracking |
| `categories` | Product categories |
| `carousels` | Homepage banner images |
| `feedbacks` | User reviews and ratings |
| `counters` | Dashboard analytics data |

---

## 🧪 Testing

All core modules were manually tested. Here's a summary:

| Module | Test | Status |
|---|---|---|
| Auth | Register, Login, JWT protection | ✅ Pass |
| Products | Get, Add, Delete (Admin) | ✅ Pass |
| Cart | Add item, update cart | ✅ Pass |
| Orders | Place order, update status | ✅ Pass |
| Users | Block/unblock via admin | ✅ Pass |
| Feedback | Submit and view feedback | ✅ Pass |

---

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── index.html
└── README.md
```

---

## 🙋‍♂️ Author

**Vatsal Suthar**
- GitHub: [Vatsal Suthar](https://github.com/mistryvatsal09-ai?tab=repositories)

---
