const express = require('express');
const dotenv = require('dotenv');
const Connect = require("../backend/databacesonnect/data.js");
const questions = require("../backend/routes/questionsroute.js");
const path = require("path");
const user = require("../backend/routes/userroute.js");
const marks = require("../backend/routes/sem-marksroute.js");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const messages = require("../backend/routes/message.js");
const community = require("../backend/routes/communityroute.js");

const app = express();
const port = 3000;

dotenv.config({ path: "backend/envfile/config.env" });

// ---------- STATIC ----------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------- PARSERS ----------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------- FORCE CORS (VERCEL SAFE) ----------
const allowedOrigins = [
  "https://collage-repo-1-qxtl.vercel.app",
  "https://collage-project-pearl.vercel.app",
  "https://collage-repo-1.vercel.app"
];

console.log("CURRENT CORS CONFIG RUNNING");

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("REQ ORIGIN =>", origin);

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ---------- ROUTES ----------
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());

app.use("/question", questions);
app.use("/student", user);
app.use("/messages", messages);
app.use("/community", community);
app.use("/marks", marks);

// ---------- DB ----------
console.log("MongoDB URL:", process.env.URL);
Connect();

// ---------- SERVER ----------
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
