const Admin = require("../modals/Admin");
const { hashPassword, comparePassword, generateToken } = require("../helpers/authHelper");
const { handle200, handle201 } = require("../helpers/successHandler");
const { handle401, handle422, handle500 } = require("../helpers/errorHandler");

const DEFAULT_PASSCODE = process.env.OWNER_PASSCODE || "TLARTS@02";

/**
 * Helper to ensure at least one admin account exists
 */
const ensureDefaultAdmin = async () => {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
        const hashedPassword = await hashPassword(DEFAULT_PASSCODE);
        return await Admin.create({
            username: "tushar_lohar",
            password: hashedPassword,
            role: "admin"
        });
    }
    return null;
};

/**
 * Admin Login: Supports either passcode (from owner modal) or username & password
 */
const login = async (req, res) => {
    try {
        const { passcode, username, password } = req.body;

        await ensureDefaultAdmin();

        // 1. Passcode-based login (used by frontend Owner modal)
        if (passcode) {
            const entered = passcode.trim();
            // Find existing admin or check default passcode
            let admin = await Admin.findOne();
            let isMatch = false;

            if (admin) {
                isMatch = await comparePassword(entered, admin.password);
            }
            if (!isMatch && entered === DEFAULT_PASSCODE) {
                isMatch = true;
                if (!admin) {
                    const hashedPassword = await hashPassword(DEFAULT_PASSCODE);
                    admin = await Admin.create({
                        username: "tushar_lohar",
                        password: hashedPassword,
                        role: "admin"
                    });
                }
            }

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Incorrect Passcode. Access Denied."
                });
            }

            const token = generateToken({
                id: admin._id,
                username: admin.username,
                role: admin.role
            });

            return handle200(res, {
                token,
                admin: {
                    id: admin._id,
                    username: admin.username,
                    role: admin.role
                }
            }, "Owner access authenticated successfully.");
        }

        // 2. Standard username/password login
        if (!username || !password) {
            return handle422(res, { auth: "Please provide credentials." });
        }

        const admin = await Admin.findOne({ username: username.trim() });
        if (!admin) {
            return handle401(res, "Invalid username or password.");
        }

        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return handle401(res, "Invalid username or password.");
        }

        const token = generateToken({
            id: admin._id,
            username: admin.username,
            role: admin.role
        });

        return handle200(res, {
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                role: admin.role
            }
        }, "Logged in successfully.");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Get current authenticated admin
 */
const getMe = async (req, res) => {
    try {
        return handle200(res, { admin: req.admin }, "Authenticated admin data retrieved.");
    } catch (error) {
        return handle500(res, error);
    }
};

/**
 * Update Admin Passcode / Password
 */
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!newPassword || newPassword.length < 4) {
            return handle422(res, { password: "New password must be at least 4 characters long." });
        }

        const admin = await Admin.findById(req.admin._id);
        if (!admin) {
            return handle401(res, "Admin not found.");
        }

        if (currentPassword) {
            const isMatch = await comparePassword(currentPassword, admin.password);
            if (!isMatch) {
                return handle401(res, "Current password does not match.");
            }
        }

        admin.password = await hashPassword(newPassword.trim());
        await admin.save();

        return handle200(res, null, "Password updated successfully.");
    } catch (error) {
        return handle500(res, error);
    }
};

module.exports = {
    login,
    getMe,
    updatePassword,
    ensureDefaultAdmin
};

