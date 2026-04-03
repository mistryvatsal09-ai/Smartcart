const express = require("express");
const router = express.Router();
const Carousel = require("../models/Carousel");
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Fetch all carousel slides
// @route   GET /api/carousel
// @access  Public
router.get("/", async (req, res) => {
    try {
        const slides = await Carousel.find({});
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a carousel slide
// @route   POST /api/carousel
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const { image, title, subtitle } = req.body;
        const slide = new Carousel({ image, title, subtitle });
        const createdSlide = await slide.save();
        res.status(201).json(createdSlide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a carousel slide
// @route   DELETE /api/carousel/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const slide = await Carousel.findById(req.params.id);
        if (slide) {
            await slide.deleteOne();
            res.json({ message: "Slide removed" });
        } else {
            res.status(404).json({ message: "Slide not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
