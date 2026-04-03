const express = require("express");
const Category = require("../models/Category");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

/* GET all categories */
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* POST: Create category (Admin only) */
router.post("/", protect, admin, async (req, res) => {
    const { name, description, image } = req.body;
    try {
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const category = await Category.create({ name, description, image });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* PUT: Update category (Admin only) */
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            category.name = req.body.name || category.name;
            category.description = req.body.description || category.description;
            category.image = req.body.image || category.image;
            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* DELETE category (Admin only) */
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.json({ message: "Category removed" });
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
