const express = require("express");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const generateToken = require("../utils/generateToken");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("cart.product");

    if (user && (await user.matchPassword(password))) {
      if (user.isBlocked) {
        return res.status(403).json({ message: "Account is blocked. Contact administrator." });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        cart: user.cart,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET USER PROFILE (Protected) */
router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

/* UPDATE USER PROFILE (Protected) */
router.put("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

/* ADMIN: GET ALL USERS */
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ADMIN: BLOCK/UNBLOCK USER */
router.put("/:id/block", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json({ message: user.isBlocked ? "User blocked" : "User unblocked" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ADMIN: DELETE USER */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* CART & ORDERS (Existing logic updated with protect) */
router.get("/cart", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  res.json(user.cart);
});

router.post("/cart", protect, async (req, res) => {
  const { productId, quantity } = req.body;
  const hasExplicitQuantity = quantity !== undefined && quantity !== null;
  const requestedQty = Number(hasExplicitQuantity ? quantity : 1);

  if (!productId || Number.isNaN(requestedQty) || requestedQty < 1) {
    return res.status(400).json({ message: "Invalid product or quantity" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  const user = await User.findById(req.user._id);
  const existItem = user.cart.find((x) => x.product.toString() === productId);

  if (existItem) {
    const nextQty = hasExplicitQuantity ? requestedQty : existItem.quantity + 1;
    if (nextQty > product.countInStock) {
      return res.status(400).json({ message: "Requested quantity exceeds stock" });
    }
    existItem.quantity = nextQty;
  } else {
    if (requestedQty > product.countInStock) {
      return res.status(400).json({ message: "Requested quantity exceeds stock" });
    }
    user.cart.push({ product: productId, quantity: requestedQty });
  }

  await user.save();
  const updatedUser = await User.findById(req.user._id).populate("cart.product");
  res.json(updatedUser.cart);
});

router.delete("/cart/:productId", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((x) => x.product.toString() !== req.params.productId);
  await user.save();
  const updatedUser = await User.findById(req.user._id).populate("cart.product");
  res.json(updatedUser.cart);
});

/* PLACE ORDER */
router.post("/order", protect, async (req, res) => {
  const { orderItems, shippingAddress, contactNumber } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  }

  try {
    // Validate products and stock before creating the order.
    const normalizedItems = [];
    let calculatedTotal = 0;

    for (const item of orderItems) {
      if (!item.product || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ message: "Invalid order item payload" });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (item.quantity > product.countInStock) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      normalizedItems.push({
        name: product.name,
        quantity: item.quantity,
        image: product.image,
        price: product.price,
        product: product._id,
      });
      calculatedTotal += product.price * item.quantity;
    }

    const order = new Order({
      user: req.user._id,
      orderItems: normalizedItems,
      shippingAddress,
      contactNumber,
      totalPrice: calculatedTotal,
    });

    const createdOrder = await order.save();

    // Update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.quantity;
        await product.save();
      }
    }

    // Clear user cart
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET USER ORDERS */
router.get("/myorders", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

/* ADMIN: GET ALL ORDERS */
router.get("/orders/all", protect, admin, async (req, res) => {
  const orders = await Order.find({}).populate("user", "name email");
  res.json(orders);
});

/* ADMIN: UPDATE ORDER STATUS */
router.put("/orders/:id/status", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status;
      if (req.body.status === "Delivered") {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ADMIN: GET DASHBOARD STATS */
router.get("/dashboard/stats", protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalProducts = await Product.countDocuments({});
    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
