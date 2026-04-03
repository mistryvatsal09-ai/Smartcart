const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const connectDB = require("./db");

dotenv.config();

connectDB();

const createAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: "admin@example.com" });

        if (adminExists) {
            console.log("Admin user already exists");
            process.exit();
        }

        const user = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "password123", // In a real app, hash this!
            isAdmin: true,
        });

        console.log("Admin user created successfully");
        console.log("Email: admin@example.com");
        console.log("Password: password123");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
