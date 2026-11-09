const mongoose = require('mongoose');

const connectionDb = async () => {
    try {
        const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tlarts';
        const connection = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB connected: ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.warn("MongoDB connection notice (Server will still run, but DB features require MongoDB):", error.message);
        return null;
    }
};

module.exports = { connectionDb };
