const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        videoUrl: {
            type: String,
            required: true,
            trim: true
        },
        thumbnailUrl: {
            type: String,
            default: "",
            trim: true
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
        instagramReelUrl: {
            type: String,
            default: "",
            trim: true
        },
        category: {
            type: String,
            default: "Process Timelapse",
            trim: true
        },
        duration: {
            type: String,
            default: "",
            trim: true
        },
        isFeatured: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Video", videoSchema);

