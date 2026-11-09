const Inquiry = require("../modals/Inquiry");
const { deleteUploadedFiles } = require("../helpers/deleteUploadFiles");
const { handle200, handle201 } = require("../helpers/successHandler");
const { handle404, handle422, handle500, formatMongooseError } = require("../helpers/errorHandler");

/**
 * Submit a new commission inquiry (Public)
 */
const createInquiry = async (req, res) => {
    try {
        const { name, contact, sketchType, size, message } = req.body;

        if (!name || !name.trim()) {
            return handle422(res, { name: "Name is required." });
        }
        if (!contact || !contact.trim()) {
            return handle422(res, { contact: "Email or phone number is required." });
        }

        let referencePhotoUrl = "";
        let fileName = "";

        if (req.file) {
            referencePhotoUrl = `/uploads/inquiries/${req.file.filename}`;
            fileName = req.file.originalname;
        } else if (req.body.referencePhotoUrl) {
            referencePhotoUrl = req.body.referencePhotoUrl;
        }

        const newInquiry = await Inquiry.create({
            name: name.trim(),
            contact: contact.trim(),
            sketchType: sketchType ? sketchType.trim() : "Single Realistic Portrait",
            size: size ? size.trim() : "A3 (29.7 × 42.0 cm)",
            message: message ? message.trim() : "",
            referencePhotoUrl,
            fileName,
            status: "New"
        });

        return handle201(res, newInquiry, "Inquiry submitted successfully! Artist Tushar will contact you soon.");
    } catch (error) {
        return formatMongooseError(res, error);
    }
};

/**
 * Get all commission inquiries (Admin Protected)
 */
const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        return handle200(res, inquiries, "Inquiries retrieved successfully.");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Update Inquiry Status (Admin Protected)
 */
const updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return handle422(res, { status: "Status is required." });
        }

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) {
            return handle404(res, "Inquiry not found.");
        }

        inquiry.status = status;
        await inquiry.save();

        return handle200(res, inquiry, "Inquiry status updated successfully.");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Delete Inquiry (Admin Protected)
 */
const deleteInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const inquiry = await Inquiry.findById(id);

        if (!inquiry) {
            return handle404(res, "Inquiry not found.");
        }

        // Delete reference photo if stored locally
        if (inquiry.referencePhotoUrl && inquiry.referencePhotoUrl.startsWith("/uploads/")) {
            deleteUploadedFiles(inquiry.referencePhotoUrl);
        }

        await Inquiry.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Inquiry deleted successfully."
        });
    } catch (error) {
        return handle500(res, error);
    }
};

module.exports = {
    createInquiry,
    getAllInquiries,
    updateInquiryStatus,
    deleteInquiry
};

