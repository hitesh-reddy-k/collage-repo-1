const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

// Routes
const Connect = require("./backend/databasesonnect/data.js");
const questions = require("./backend/routes/questionsroute.js");
const user = require("./backend/routes/userroute.js");
const marks = require("./backend/routes/sem-marksroute.js");
const messages = require("./backend/routes/message.js");
const community = require("./backend/routes/communityroute.js");
const club = require("./backend/routes/clubrouter.js");

// Load environment variables
dotenv.config({ path: "./backend/envfile/config.env" });

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Updated CORS Configuration
const corsOptions = {
    origin: ['https://collage-project-pearl.vercel.app'], // Allow only the frontend URL
    credentials: true, // Allow cookies and credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed methods
    allowedHeaders: [
        'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version',
        'Content-Length', 'Content-MD5', 'Content-Type', 'Date',
        'X-Api-Version', 'Authorization',
    ], // Allowed headers
};

// Use CORS Middleware
app.use(cors(corsOptions));

// Handle OPTIONS Preflight Requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
    res.sendStatus(200); // Ensure the preflight request gets a 200 status
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use("/question", questions);
app.use("/student", user);
app.use("/messages", messages);
app.use("/community", community);
app.use("/marks", marks);
app.use("/clubs", club);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Connect to MongoDB
Connect();

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
