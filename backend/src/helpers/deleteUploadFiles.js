const fs = require("fs");
const path = require("path");

// Delete file safely
function safeUnlink(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("Deleted file:", filePath);
        }
    } catch (e) {
        console.warn("Failed to delete file:", filePath, e.message);
    }
}

// Find uploaded files and delete them
function deleteUploadedFiles(data) {
    if (!data) return;

    if (typeof data === "string") {
        const cleanPath = data.startsWith("/") ? data.slice(1) : data;
        if (cleanPath.startsWith("uploads/")) {
            const filePath = path.join(process.cwd(), "public", cleanPath);
            safeUnlink(filePath);
        }
        return;
    }

    if (typeof data === "object") {
        for (const key in data) {
            if (typeof data[key] === "string") {
                const cleanPath = data[key].startsWith("/") ? data[key].slice(1) : data[key];
                if (cleanPath.startsWith("uploads/")) {
                    const filePath = path.join(process.cwd(), "public", cleanPath);
                    safeUnlink(filePath);
                }
            } else if (typeof data[key] === "object") {
                deleteUploadedFiles(data[key]);
            }
        }
    }
}

module.exports = { deleteUploadedFiles, safeUnlink };
