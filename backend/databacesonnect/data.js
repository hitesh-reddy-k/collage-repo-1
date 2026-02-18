const mongoose = require("mongoose");
const dotenv = require('dotenv');


dotenv.config({ path: "backend/env/.env" });

const URL = process.env.URL 

const Connect = async () => {
    try {
        await mongoose.connect(URL);
        console.log(`MongoDB connected successfully`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = Connect;
