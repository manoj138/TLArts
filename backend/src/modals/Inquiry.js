const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        contact: {
            type: String,
            required: true,
            trim: true,
        },
        size: {
            type: String,
            default: "A3 (29.7 × 42.0 cm)",
            trim: true,
        },
        sketchType: {
            type: String,
            required: true,
            default: "Single Realistic Portrait",
            trim: true,
        },
        message: {
            type: String,
            default: "",
            trim: true,
        },
        referencePhotoUrl: {
            type: String,
            default: "",
        },
        fileName: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["New", "In Progress", "Completed", "pending", "in-progress", "completed"],
            default: "New",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Inquiry", inquirySchema);
