const mongoose = require('mongoose');


const connectionDb = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected')
    } catch (error) {
        console.log("MongoDB connection failed", error.message)
        process.exit(1);
    }
}

module.exports = {connectionDb}
