const Artwork = require("../modals/Artwork");
const { deleteUploadedFiles } = require("../helpers/deleteUploadFiles");
const { handle200, handle201, handle204 } = require("../helpers/successHandler");
const { handle404, handle422, handle500, formatMongooseError } = require("../helpers/errorHandler");

/**
 * Get all artworks (Public)
 */
const getAllArtworks = async (req, res) => {
    try {
        const { category, search, featured } = req.query;
        let query = {};

        if (category && category !== "All") {
            query.category = category;
        }

        if (featured === "true") {
            query.isFeatured = true;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { medium: { $regex: search, $options: "i" } }
            ];
        }

        const artworks = await Artwork.find(query).sort({ createdAt: -1 });

        return handle200(res, artworks, "Artworks retrieved successfully.");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Get single artwork by ID or Slug (Public)
 */
const getArtworkById = async (req, res) => {
    try {
        const { id } = req.params;
        let artwork;

        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            artwork = await Artwork.findById(id);
        } else {
            artwork = await Artwork.findOne({ slug: id });
        }

        if (!artwork) {
            return handle404(res, "Artwork not found.");
        }

        return handle200(res, artwork, "Artwork retrieved successfully.");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Create a new artwork (Admin Protected)
 */
const createArtwork = async (req, res) => {
    try {
        const {
            title,
            category,
            medium,
            dimensions,
            year,
            description,
            instagramPostUrl,
            isFeatured
        } = req.body;

        if (!title || !category || !medium) {
            return handle422(res, {
                title: !title ? "Title is required" : undefined,
                category: !category ? "Category is required" : undefined,
                medium: !medium ? "Medium is required" : undefined
            });
        }

        let imageUrl = req.body.imageUrl;
        if (req.file) {
            imageUrl = `/uploads/artworks/${req.file.filename}`;
        }

        if (!imageUrl) {
            return handle422(res, { imageUrl: "Artwork image is required (upload file or provide image URL)" });
        }

        // Generate unique slug
        const baseSlug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const uniqueSlug = `${baseSlug || "artwork"}-${Date.now().toString().slice(-4)}`;

        const newArtwork = await Artwork.create({
            title: title.trim(),
            slug: uniqueSlug,
            category: category.trim(),
            medium: medium.trim(),
            dimensions: dimensions ? dimensions.trim() : "",
            year: year ? year.toString().trim() : new Date().getFullYear().toString(),
            description: description ? description.trim() : "",
            imageUrl: imageUrl,
            instagramPostUrl: instagramPostUrl ? instagramPostUrl.trim() : "",
            isFeatured: isFeatured === true || isFeatured === "true"
        });

        return handle201(res, newArtwork, "Artwork created successfully.");
    } catch (error) {
        return formatMongooseError(res, error);
    }
};

/**
 * Update existing artwork (Admin Protected)
 */
const updateArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const artwork = await Artwork.findById(id);

        if (!artwork) {
            return handle404(res, "Artwork not found.");
        }

        const updateData = { ...req.body };

        // Handle uploaded new file replacement
        if (req.file) {
            if (artwork.imageUrl && artwork.imageUrl.startsWith("/uploads/")) {
                deleteUploadedFiles(artwork.imageUrl);
            }
            updateData.imageUrl = `/uploads/artworks/${req.file.filename}`;
        }

        if (typeof updateData.isFeatured !== "undefined") {
            updateData.isFeatured = updateData.isFeatured === true || updateData.isFeatured === "true";
        }

        const updatedArtwork = await Artwork.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return handle200(res, updatedArtwork, "Artwork updated successfully.");
    } catch (error) {
        return formatMongooseError(res, error);
    }
};

/**
 * Delete artwork (Admin Protected)
 */
const deleteArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const artwork = await Artwork.findById(id);

        if (!artwork) {
            return handle404(res, "Artwork not found.");
        }

        // Delete associated image file from disk if it was an uploaded file
        if (artwork.imageUrl && artwork.imageUrl.startsWith("/uploads/")) {
            deleteUploadedFiles(artwork.imageUrl);
        }

        await Artwork.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Artwork deleted successfully."
        });
    } catch (error) {
        return handle500(res, error);
    }
};

module.exports = {
    getAllArtworks,
    getArtworkById,
    createArtwork,
    updateArtwork,
    deleteArtwork
};

