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

// CORS Configuration
const corsOptions = {
    origin: [
        'https://collage-project-pearl.vercel.app',
        'https://collage-repo-1.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version',
        'Content-Length', 'Content-MD5', 'Content-Type', 'Date',
        'X-Api-Version', 'Authorization'
    ]
};

// Apply middlewares
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight request handling
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
