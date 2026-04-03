const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./db");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Category = require("./models/Category");
const Feedback = require("./models/Feedback");
const Carousel = require("./models/Carousel");

const counterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true, default: 0 },
    description: String,
  },
  { timestamps: true }
);

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

dotenv.config();

const categorySeeds = [
  {
    name: "Electronics",
    description: "Smartphones, audio gear, and connected devices",
    image: "https://images.example.com/categories/electronics.jpg",
  },
  {
    name: "Home & Kitchen",
    description: "Home decor, smart lighting, and countertop essentials",
    image: "https://images.example.com/categories/home-kitchen.jpg",
  },
  {
    name: "Fashion & Apparel",
    description: "Wardrobe staples for every season",
    image: "https://images.example.com/categories/fashion.jpg",
  },
  {
    name: "Beauty & Personal Care",
    description: "Skin care, hair care, and daily wellness",
    image: "https://images.example.com/categories/beauty.jpg",
  },
  {
    name: "Sports & Outdoors",
    description: "Gear for trails, gyms, and everything in between",
    image: "https://images.example.com/categories/sports.jpg",
  },
  {
    name: "Books & Media",
    description: "Curated reads and creative inspiration",
    image: "https://images.example.com/categories/books.jpg",
  },
  {
    name: "Toys & Games",
    description: "STEM kits, puzzles, and family fun",
    image: "https://images.example.com/categories/toys.jpg",
  },
  {
    name: "Automotive",
    description: "Accessories that keep every drive organized",
    image: "https://images.example.com/categories/automotive.jpg",
  },
  {
    name: "Grocery & Gourmet",
    description: "Artisanal pantry picks and specialty coffee",
    image: "https://images.example.com/categories/grocery.jpg",
  },
  {
    name: "Pet Supplies",
    description: "Comfort and care products for dogs and cats",
    image: "https://images.example.com/categories/pets.jpg",
  },
];

const userTemplates = [
  { name: "Ava Patel", email: "ava.patel@example.com", password: "Password123!", isAdmin: true },
  { name: "Liam Rodriguez", email: "liam.rodriguez@example.com", password: "Password123!" },
  { name: "Mia Thompson", email: "mia.thompson@example.com", password: "Password123!" },
  { name: "Noah Garcia", email: "noah.garcia@example.com", password: "Password123!" },
  { name: "Sophia Lee", email: "sophia.lee@example.com", password: "Password123!" },
  { name: "Ethan Martinez", email: "ethan.martinez@example.com", password: "Password123!" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@example.com", password: "Password123!" },
  { name: "William Johnson", email: "william.johnson@example.com", password: "Password123!", isBlocked: true },
  { name: "Olivia Brown", email: "olivia.brown@example.com", password: "Password123!" },
  { name: "James Wilson", email: "james.wilson@example.com", password: "Password123!" },
];

const carouselSeeds = [
  {
    image: "https://images.example.com/carousel/spring-style.jpg",
    title: "Spring Refresh",
    subtitle: "Layerable looks ready for sunny days",
  },
  {
    image: "https://images.example.com/carousel/home-office.jpg",
    title: "Build Your Dream Desk",
    subtitle: "Monitors, lamps, storage, and more",
  },
  {
    image: "https://images.example.com/carousel/beauty-event.jpg",
    title: "Beauty Event Week",
    subtitle: "Glow-boosting skincare bundles from $29",
  },
  {
    image: "https://images.example.com/carousel/outdoor-adventure.jpg",
    title: "Trail-Ready Picks",
    subtitle: "Hydration packs, trail shoes, and sun gear",
  },
  {
    image: "https://images.example.com/carousel/toy-lab.jpg",
    title: "STEM Toy Lab",
    subtitle: "Spark curiosity with kid-approved kits",
  },
  {
    image: "https://images.example.com/carousel/grocery-finds.jpg",
    title: "Pantry Upgrades",
    subtitle: "Organic brews and small-batch snacks",
  },
  {
    image: "https://images.example.com/carousel/pet-comfort.jpg",
    title: "Pets First",
    subtitle: "Orthopedic lounges and calming chews",
  },
  {
    image: "https://images.example.com/carousel/auto.jpg",
    title: "Daily Driver Essentials",
    subtitle: "Dash cams, organizers, and cleaning kits",
  },
  {
    image: "https://images.example.com/carousel/reader-favorites.jpg",
    title: "Reader Favorites",
    subtitle: "Award-winning novels and fresh releases",
  },
  {
    image: "https://images.example.com/carousel/tech-drops.jpg",
    title: "Latest Tech Drops",
    subtitle: "Fresh restocks land every Thursday",
  },
];

const counterSeeds = [
  {
    name: "orderSequence",
    value: 1042,
    description: "Tracks the next incremental order number",
  },
  {
    name: "userSequence",
    value: 210,
    description: "Internal customer id reference",
  },
  {
    name: "productSKUSequence",
    value: 845,
    description: "SKU generator for catalog onboarding",
  },
  {
    name: "refundRequestSequence",
    value: 73,
    description: "Support team's open refund tickets",
  },
  {
    name: "inventoryAuditSequence",
    value: 19,
    description: "Counts full-cycle warehouse audits",
  },
  {
    name: "newsletterSequence",
    value: 58,
    description: "Next batch id for marketing sends",
  },
  {
    name: "restockJobSequence",
    value: 312,
    description: "Auto restock workflow increments",
  },
  {
    name: "shipmentBatchSequence",
    value: 441,
    description: "Carrier manifest identifier",
  },
  {
    name: "supportChatSequence",
    value: 992,
    description: "Realtime chat transcript tracker",
  },
  {
    name: "payoutBatchSequence",
    value: 128,
    description: "Marketplace seller payout batch",
  },
];

const shippingAddresses = [
  { address: "742 Evergreen Terrace", city: "Springfield", postalCode: "62704", country: "United States" },
  { address: "233 King Street", city: "Seattle", postalCode: "98104", country: "United States" },
  { address: "18 Ocean Drive", city: "Miami", postalCode: "33139", country: "United States" },
  { address: "91 Pearl Street", city: "Brooklyn", postalCode: "11201", country: "United States" },
  { address: "1200 Market Street", city: "San Francisco", postalCode: "94102", country: "United States" },
  { address: "57 Beacon Hill", city: "Boston", postalCode: "02108", country: "United States" },
  { address: "401 Riverwalk Terrace", city: "San Antonio", postalCode: "78205", country: "United States" },
  { address: "25 Ridgeview Lane", city: "Denver", postalCode: "80203", country: "United States" },
  { address: "931 Harbor Boulevard", city: "Los Angeles", postalCode: "90012", country: "United States" },
  { address: "315 Magnolia Avenue", city: "Nashville", postalCode: "37203", country: "United States" },
];

const feedbackTemplates = [
  {
    userIndex: 0,
    category: "Product",
    subject: "Headphones exceeded expectations",
    message: "The noise cancellation is stellar and battery easily lasts a full workday.",
    rating: 5,
    status: "Resolved",
    reply: "Thanks for the love on Aurora!",
  },
  {
    userIndex: 1,
    category: "Service",
    subject: "Delivery arrived a day early",
    message: "Pleasantly surprised by the quick shipping on my lamp order.",
    rating: 4,
    status: "Reviewed",
    reply: "We shared the kudos with our courier partner.",
  },
  {
    userIndex: 2,
    category: "Website",
    subject: "Saved cart disappeared",
    message: "Items in my cart vanished after login. Please fix this experience.",
    rating: 3,
    status: "Pending",
  },
  {
    userIndex: 3,
    category: "Product",
    subject: "Backpack stitching issue",
    message: "One of the seams loosened after a weekend trip.",
    rating: 2,
    status: "Reviewed",
    reply: "We issued a replacement and queued a QA check.",
  },
  {
    userIndex: 4,
    category: "Other",
    subject: "Please add Apple Pay",
    message: "Checkout would be smoother with more wallets supported.",
    rating: 4,
    status: "Pending",
  },
  {
    userIndex: 5,
    category: "Service",
    subject: "Customer support was friendly",
    message: "Agent Carla resolved my address change in minutes.",
    rating: 5,
    status: "Resolved",
    reply: "Carla appreciated the shoutout!",
  },
  {
    userIndex: 6,
    category: "Product",
    subject: "Coffee beans were fresh",
    message: "Beans arrived vacuum sealed with roast date printed.",
    rating: 5,
    status: "Reviewed",
  },
  {
    userIndex: 7,
    category: "Website",
    subject: "Search filters glitch",
    message: "Filtering by price on mobile sometimes resets the list.",
    rating: 3,
    status: "Pending",
  },
  {
    userIndex: 8,
    category: "Product",
    subject: "Denim jacket fits perfectly",
    message: "True-to-size guide helped a lot.",
    rating: 4,
    status: "Resolved",
    reply: "Glad the fit guide helped you choose confidently!",
  },
  {
    userIndex: 9,
    category: "Service",
    subject: "Gift wrap option",
    message: "Appreciated the reusable gift wrap for my pet bed order.",
    rating: 5,
    status: "Reviewed",
  },
];

const hashUserPasswords = async () => {
  const saltRounds = 10;
  return Promise.all(
    userTemplates.map(async (template) => ({
      ...template,
      cart: [],
      isAdmin: template.isAdmin || false,
      isBlocked: template.isBlocked || false,
      password: await bcrypt.hash(template.password, saltRounds),
    }))
  );
};

const buildProducts = (categories) => {
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.name] = category;
    return acc;
  }, {});

  return [
    {
      name: "Aurora Noise-Canceling Headphones",
      price: 189.99,
      description: "Wireless over-ear headphones with adaptive ANC and 40-hour battery life.",
      image: "https://images.example.com/products/aurora-headphones.jpg",
      category: categoryMap["Electronics"]._id,
      countInStock: 35,
      rating: 4.8,
      numReviews: 128,
      reviews: [],
    },
    {
      name: "Lumen Smart Table Lamp",
      price: 79.99,
      description: "Wi-Fi enabled lamp with tunable white and RGB ambient lighting.",
      image: "https://images.example.com/products/lumen-lamp.jpg",
      category: categoryMap["Home & Kitchen"]._id,
      countInStock: 58,
      rating: 4.4,
      numReviews: 86,
      reviews: [],
    },
    {
      name: "Heritage Denim Jacket",
      price: 129.0,
      description: "Classic selvedge jacket with reinforced stitching and modern fit.",
      image: "https://images.example.com/products/heritage-jacket.jpg",
      category: categoryMap["Fashion & Apparel"]._id,
      countInStock: 22,
      rating: 4.6,
      numReviews: 64,
      reviews: [],
    },
    {
      name: "PureGlow Vitamin C Serum",
      price: 42.5,
      description: "Brightening serum with 15% stabilized vitamin C and hyaluronic acid.",
      image: "https://images.example.com/products/pureglow-serum.jpg",
      category: categoryMap["Beauty & Personal Care"]._id,
      countInStock: 80,
      rating: 4.7,
      numReviews: 210,
      reviews: [],
    },
    {
      name: "Summit 40L Hiking Backpack",
      price: 159.99,
      description: "Lightweight pack with airflow back panel and modular straps.",
      image: "https://images.example.com/products/summit-backpack.jpg",
      category: categoryMap["Sports & Outdoors"]._id,
      countInStock: 18,
      rating: 4.5,
      numReviews: 92,
      reviews: [],
    },
    {
      name: "Atlas of Remote Work",
      price: 34.0,
      description: "Hardcover guide featuring interviews and workspace playbooks.",
      image: "https://images.example.com/products/atlas-remote-work.jpg",
      category: categoryMap["Books & Media"]._id,
      countInStock: 44,
      rating: 4.3,
      numReviews: 37,
      reviews: [],
    },
    {
      name: "NovaKids STEM Robot Kit",
      price: 94.5,
      description: "Programmable robot with drag-and-drop coding lessons.",
      image: "https://images.example.com/products/novakids-robot.jpg",
      category: categoryMap["Toys & Games"]._id,
      countInStock: 53,
      rating: 4.9,
      numReviews: 152,
      reviews: [],
    },
    {
      name: "Voyager Dash Cam Pro",
      price: 139.99,
      description: "Dual 4K dash cam with parking mode and LTE backup.",
      image: "https://images.example.com/products/voyager-dashcam.jpg",
      category: categoryMap["Automotive"]._id,
      countInStock: 27,
      rating: 4.4,
      numReviews: 58,
      reviews: [],
    },
    {
      name: "Harvest Blend Organic Coffee Beans",
      price: 24.99,
      description: "Direct-trade medium roast with caramel and citrus notes.",
      image: "https://images.example.com/products/harvest-coffee.jpg",
      category: categoryMap["Grocery & Gourmet"]._id,
      countInStock: 120,
      rating: 4.8,
      numReviews: 310,
      reviews: [],
    },
    {
      name: "Pawsome Orthopedic Pet Bed",
      price: 114.0,
      description: "Memory foam base with washable cover sized for medium dogs.",
      image: "https://images.example.com/products/pawsome-bed.jpg",
      category: categoryMap["Pet Supplies"]._id,
      countInStock: 31,
      rating: 4.6,
      numReviews: 75,
      reviews: [],
    },
  ];
};

const buildOrders = (users, products) => {
  const statuses = ["Pending", "Shipped", "Delivered"];
  const paymentMethods = ["Razorpay", "Stripe", "Cash on Delivery", "PayPal"];
  const basePaidDate = new Date("2026-01-15T10:00:00.000Z");

  return shippingAddresses.map((address, idx) => {
    const customer = users[idx % users.length];
    const selectedProducts = [
      products[idx % products.length],
      products[(idx + 3) % products.length],
    ];

    const orderItems = selectedProducts.map((product, productIdx) => ({
      name: product.name,
      quantity: productIdx === 0 ? (idx % 3) + 1 : 1,
      image: product.image,
      price: product.price,
      product: product._id,
    }));

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const status = statuses[idx % statuses.length];
    const isPaid = status !== "Pending";

    return {
      user: customer._id,
      orderItems,
      shippingAddress: address,
      contactNumber: `+1-415-555-01${(idx + 10).toString().padStart(2, "0")}`,
      paymentMethod: paymentMethods[idx % paymentMethods.length],
      totalPrice: Number(totalPrice.toFixed(2)),
      status,
      isPaid,
      paidAt: isPaid
        ? new Date(basePaidDate.getTime() + idx * 86400000)
        : null,
    };
  });
};

const buildFeedbacks = (users) =>
  feedbackTemplates.map((template) => ({
    ...template,
    user: users[template.userIndex]._id,
  }));

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Category.deleteMany(),
      Feedback.deleteMany(),
      Carousel.deleteMany(),
      Counter.deleteMany(),
    ]);

    const categories = await Category.insertMany(categorySeeds);
    const users = await hashUserPasswords().then((docs) => User.insertMany(docs));
    const products = await Product.insertMany(buildProducts(categories));
    await Order.insertMany(buildOrders(users, products));
    await Feedback.insertMany(buildFeedbacks(users));
    await Carousel.insertMany(carouselSeeds);
    await Counter.insertMany(counterSeeds);

    console.log("Seed data inserted successfully");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed data", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
