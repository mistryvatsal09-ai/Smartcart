const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
router.post("/", protect, async (req, res) => {
    const { category, subject, message, rating } = req.body;

    if (!category || !subject || !message || !rating) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        const feedback = new Feedback({
            user: req.user._id,
            category,
            subject,
            message,
            rating,
        });

        const createdFeedback = await feedback.save();
        res.status(201).json(createdFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's feedback
// @route   GET /api/feedback/myfeedback
// @access  Private
router.get("/myfeedback", protect, async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ user: req.user._id }).sort("-createdAt");
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all feedback (Admin)
// @route   GET /api/feedback
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    try {
        const feedbacks = await Feedback.find(filter)
            .populate("user", "name email")
            .sort("-createdAt");
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update feedback status/reply (Admin)
// @route   PUT /api/feedback/:id
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (feedback) {
            feedback.status = req.body.status || feedback.status;
            feedback.reply = req.body.reply || feedback.reply;

            const updatedFeedback = await feedback.save();
            res.json(updatedFeedback);
        } else {
            res.status(404).json({ message: "Feedback not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete feedback (Admin)
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (feedback) {
            await feedback.deleteOne();
            res.json({ message: "Feedback removed" });
        } else {
            res.status(404).json({ message: "Feedback not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
