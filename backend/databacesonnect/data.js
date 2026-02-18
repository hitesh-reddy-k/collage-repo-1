const mongoose = require("mongoose");
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables (for local development)
dotenv.config({ path: path.join(__dirname, '..', 'env', '.env') });

const URL = process.env.URL; 

const Connect = async () => {
    try {
        if (!URL) {
            throw new Error('MongoDB URL not found in environment variables');
        }
        await mongoose.connect(URL);
        console.log(`MongoDB connected successfully`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // Don't exit in serverless environment
        if (process.env.VERCEL !== '1') {
            process.exit(1);
        }
    }
};

module.exports = Connect;
