const express = require("express");
const router = express.Router();
const {
    getAllArtworks,
    getArtworkById,
    createArtwork,
    updateArtwork,
    deleteArtwork
} = require("../controllers/artworkController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { uploadArtwork } = require("../middleware/uploadMiddleware");

// Public
router.get("/", getAllArtworks);
router.get("/:id", getArtworkById);

// Protected (Admin CMS)
router.post("/", protectAdmin, uploadArtwork.single("image"), createArtwork);
router.put("/:id", protectAdmin, uploadArtwork.single("image"), updateArtwork);
router.delete("/:id", protectAdmin, deleteArtwork);

module.exports = router;

