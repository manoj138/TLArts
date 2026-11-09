const express = require("express");
const router = express.Router();
const {
    createInquiry,
    getAllInquiries,
    updateInquiryStatus,
    deleteInquiry
} = require("../controllers/inquiryController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { uploadInquiry } = require("../middleware/uploadMiddleware");

// Public: Customer submits commission inquiry with optional reference photo
router.post("/", uploadInquiry.single("referencePhoto"), createInquiry);

// Protected: Owner views and manages inquiries in Studio CMS
router.get("/", protectAdmin, getAllInquiries);
router.patch("/:id/status", protectAdmin, updateInquiryStatus);
router.delete("/:id", protectAdmin, deleteInquiry);

module.exports = router;

