const Video = require("../modals/Video");
const { deleteUploadedFiles } = require("../helpers/deleteUploadFiles");
const { handle200, handle201 } = require("../helpers/successHandler");
const { handle404, handle422, handle500, formatMongooseError } = require("../helpers/errorHandler");

/**
 * Get all studio videos (Public)
 */
const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        return handle200(res, videos, "Videos retrieved successfully.");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Get single video by ID (Public)
 */
const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id);
        if (!video) {
            return handle404(res, "Video not found.");
        }
        return handle200(res, video, "Video retrieved successfully.");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Create a new video (Admin Protected)
 */
const createVideo = async (req, res) => {
    try {
        const { title, description, instagramReelUrl, category, duration } = req.body;

        if (!title || !title.trim()) {
            return handle422(res, { title: "Video title is required." });
        }

        let videoUrl = req.body.videoUrl;
        if (req.file) {
            videoUrl = `/uploads/videos/${req.file.filename}`;
        }

        if (!videoUrl || !videoUrl.trim()) {
            return handle422(res, { videoUrl: "Video file or video URL is required." });
        }

        let thumbnailUrl = req.body.thumbnailUrl || "";

        const newVideo = await Video.create({
            title: title.trim(),
            videoUrl: videoUrl.trim(),
            thumbnailUrl: thumbnailUrl.trim(),
            description: description ? description.trim() : "",
            instagramReelUrl: instagramReelUrl ? instagramReelUrl.trim() : "",
            category: category ? category.trim() : "Process Timelapse",
            duration: duration ? duration.trim() : "",
            isFeatured: true
        });

        return handle201(res, newVideo, "Video published successfully.");
    } catch (error) {
        return formatMongooseError(res, error);
    }
};

/**
 * Update existing video (Admin Protected)
 */
const updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id);

        if (!video) {
            return handle404(res, "Video not found.");
        }

        const updateData = { ...req.body };

        if (req.file) {
            if (video.videoUrl && video.videoUrl.startsWith("/uploads/")) {
                deleteUploadedFiles(video.videoUrl);
            }
            updateData.videoUrl = `/uploads/videos/${req.file.filename}`;
        }

        const updated = await Video.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return handle200(res, updated, "Video updated successfully.");
    } catch (error) {
        return formatMongooseError(res, error);
    }
};

/**
 * Delete video (Admin Protected)
 */
const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Video.findById(id);

        if (!video) {
            return handle404(res, "Video not found.");
        }

        if (video.videoUrl && video.videoUrl.startsWith("/uploads/")) {
            deleteUploadedFiles(video.videoUrl);
        }

        await Video.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully."
        });
    } catch (error) {
        return handle500(res, error);
    }
};

module.exports = {
    getAllVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo
};

