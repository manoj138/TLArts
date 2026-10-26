require('dotenv').config();

const express = require('express');
const app = express();
const {connectionDb}= require('./src/config/db.js');

connectionDb()

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});