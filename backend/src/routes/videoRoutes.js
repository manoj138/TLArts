const express = require("express");
const router = express.Router();
const {
    getAllVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo
} = require("../controllers/videoController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { uploadVideo } = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", getAllVideos);
router.get("/:id", getVideoById);

// Protected routes (Admin CMS)
router.post("/", protectAdmin, uploadVideo.single("video"), createVideo);
router.put("/:id", protectAdmin, uploadVideo.single("video"), updateVideo);
router.delete("/:id", protectAdmin, deleteVideo);

module.exports = router;

