require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectionDb } = require('./src/config/db.js');
const { ensureDefaultAdmin } = require('./src/controllers/adminController');

const app = express();

// 1. Database Connection & Initial setup
connectionDb().then(async () => {
    try {
        await ensureDefaultAdmin();
        console.log("Admin account status checked.");
    } catch (e) {
        console.warn("Notice during admin check:", e.message);
    }
});

// 2. Core Middlewares
app.use(cors({
    origin: '*', // Adjust or restrict if needed in production
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static Uploads Folder Serving
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// 4. API Endpoints
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/artworks', require('./src/routes/artworkRoutes'));
app.use('/api/inquiries', require('./src/routes/inquiryRoutes'));

// 5. Root Health Check
app.get('/', (req, res) => {
    res.json({
        name: "TLArts - Tushar Lohar Arts API",
        status: "Online",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

// 6. Global 404 & Error Handling
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found on this server.`
    });
});

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    if (err.name === 'MulterError') {
        return res.status(400).json({
            success: false,
            message: `Upload Error: ${err.message}`
        });
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 1006;

app.listen(PORT, () => {
    console.log(`TLArts Server is running on http://localhost:${PORT}`);
});
