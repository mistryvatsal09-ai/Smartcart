const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./db");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Server is running");
});

/* ✅ PRODUCTS ROUTE */
app.use("/api/products", require("./routes/productRoutes"));

/* ✅ USERS (LOGIN / REGISTER) ROUTE */
app.use("/api/users", require("./routes/userRoutes"));

/* ✅ CATEGORIES ROUTE */
app.use("/api/categories", require("./routes/categoryRoutes"));

/* ✅ CAROUSEL ROUTE */
app.use("/api/carousel", require("./routes/carouselRoutes"));

/* ✅ FEEDBACK ROUTE */
app.use("/api/feedback", require("./routes/feedbackRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
