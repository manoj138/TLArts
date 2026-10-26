const mongoose = require('mongoose');
const dotenv = require('dotenv');


const connectionDb = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {connectionDb}
