const { verifyToken } = require("../helpers/authHelper");
const Admin = require("../modals/Admin");

const protectAdmin = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Passcode / Token missing."
            });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Session expired or invalid token. Please log in again."
            });
        }

        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin account not found."
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed: " + error.message
        });
    }
};

module.exports = { protectAdmin };

