const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        category: {
            type: String,
            required: true,
            enum: ["Product", "Service", "Website", "Other"],
        },
        subject: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        status: {
            type: String,
            required: true,
            enum: ["Pending", "Reviewed", "Resolved"],
            default: "Pending",
        },
        reply: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
