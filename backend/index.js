const express = require('express');
const dotenv = require('dotenv');
const Connect = require("../backend/databacesonnect/data.js");
const questions = require("../backend/routes/questionsroute.js");
const cors = require("cors");
const path = require("path");
const user = require("../backend/routes/userroute.js");
const marks = require("../backend/routes/sem-marksroute.js");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const messages = require("../backend/routes/message.js");
const community = require("../backend/routes/communityroute.js");

const clubs =require("../backend/routes/clubrouter.js")

dotenv.config({ path: "backend/envfile/config.env" });

const app = express();
const port = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
    origin: [
        'https://collage-project-pearl.vercel.app', 
        'https://collage-repo-1.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow these methods
    allowedHeaders: [
        'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version',
        'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version','Authorization'
    ]
};

// Apply CORS Middleware
app.use(cors(corsOptions));

// Handle Preflight Requests
app.options('*', cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.json());
app.use("/question", questions);
app.use("/student", user);
app.use("/messages", messages);
app.use("/community", community);
app.use("/marks", marks);
app.use("/clubs", clubs);

console.log("MongoDB URL:", process.env.URL);

Connect();

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});