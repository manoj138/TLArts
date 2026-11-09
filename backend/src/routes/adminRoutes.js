const express = require("express");
const router = express.Router();
const { login, getMe, updatePassword } = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/authMiddleware");

// Public
router.post("/login", login);

// Protected
router.get("/me", protectAdmin, getMe);
router.put("/password", protectAdmin, updatePassword);

module.exports = router;

