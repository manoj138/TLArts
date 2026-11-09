const multer = require("multer");

// Memory storage helper if in-memory buffer processing is ever needed
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({
    storage: memoryStorage,
    limits: { fileSize: 25 * 1024 * 1024 }
});

module.exports = { memoryUpload };
