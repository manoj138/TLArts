const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Configure Multer Storage for specific upload folder (e.g., 'artworks', 'inquiries')
 */
const createUploader = (subfolder = "general") => {
    const uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname).toLowerCase();
            const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
            const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
            cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
        const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
        const mime = file.mimetype.toLowerCase();

        if (allowedTypes.test(ext) || mime.startsWith("image/")) {
            return cb(null, true);
        }
        cb(new Error("Only image files (JPG, PNG, WebP, GIF, SVG) are allowed!"), false);
    };

    return multer({
        storage: storage,
        limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB limit
        fileFilter: fileFilter
    });
};

const uploadArtwork = createUploader("artworks");
const uploadInquiry = createUploader("inquiries");

module.exports = {
    uploadArtwork,
    uploadInquiry,
    createUploader
};

