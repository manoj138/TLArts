const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

/**
 * Upload a local file to Cloudinary and safely delete local copy
 * @param {string} filePath - Local disk path of the uploaded file
 * @param {string} folder - Target folder in Cloudinary (e.g. 'tlarts/artworks', 'tlarts/videos')
 * @param {string} resourceType - 'image' | 'video' | 'auto'
 */
const uploadToCloudinary = async (filePath, folder = "tlarts/general", resourceType = "auto") => {
    try {
        const options = {
            folder,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: true
        };

        const result = await cloudinary.uploader.upload(filePath, options);

        // Delete temporary local file after successful Cloudinary upload
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (unlinkErr) {
            console.warn("Notice: Unable to unlink temp file:", unlinkErr.message);
        }

        return result;
    } catch (error) {
        // Attempt cleanup of temp file on failure
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (e) {
            // ignore
        }
        throw error;
    }
};

/**
 * Delete a resource from Cloudinary by its public ID
 * @param {string} publicId - The Cloudinary public ID
 * @param {string} resourceType - 'image' | 'video' | 'raw'
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    if (!publicId) return null;
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        console.warn(`Cloudinary delete notice for ${publicId}:`, error.message);
        return null;
    }
};

module.exports = {
    cloudinary,
    uploadToCloudinary,
    deleteFromCloudinary
};

