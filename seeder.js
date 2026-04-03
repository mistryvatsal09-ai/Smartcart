const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const products = require("./Data/product");
const connectDB = require("./db");

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Data Imported Successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
