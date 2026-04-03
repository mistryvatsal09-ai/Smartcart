const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const connectDB = require("./db");

dotenv.config();

connectDB();

const resetAdmin = async () => {
    try {
        let user = await User.findOne({ email: "admin@example.com" });

        if (user) {
            user.password = "password123";
            user.isAdmin = true;
            await user.save();
            console.log("Admin password reset to 'password123'");
        } else {
            user = await User.create({
                name: "Admin User",
                email: "admin@example.com",
                password: "password123",
                isAdmin: true,
            });
            console.log("Admin user created with password 'password123'");
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetAdmin();
