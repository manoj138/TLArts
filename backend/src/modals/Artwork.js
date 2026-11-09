const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        medium: {
            type: String,
            required: true,
            trim: true
        },
        dimensions: {
            type: String,
            trim: true,
            default: ""
        },
        year: {
            type: String,
            default: () => new Date().getFullYear().toString()
        },
        description: {
            type: String,
            default: ""
        },
        imageUrl: {
            type: String,
            required: true,
        },
        instagramPostUrl: {
            type: String,
            default: ""
        },
        isFeatured: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Artwork", artworkSchema);
