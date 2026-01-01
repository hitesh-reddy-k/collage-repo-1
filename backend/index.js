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

// ---------- ALLOWED ORIGINS ----------
const allowedOrigins = new Set([
  "https://collage-repo-1-qxtl.vercel.app",
  "https://collage-project-pearl.vercel.app",
  "https://collage-repo-1.vercel.app"
]);

console.log("CURRENT CORS CONFIG RUNNING");

// ---------- DEBUG HEADERS ----------
app.use((req, res, next) => {
  console.log("---- FULL HEADERS ----");
  console.log(req.headers);
  next();
});

// ---------- REAL WORKING CORS ----------
app.use((req, res, next) => {
  let origin = req.headers.origin;

  // fallback if origin missing but referer exists
  if (!origin && req.headers.referer) {
    try {
      const url = new URL(req.headers.referer);
      origin = `${url.protocol}//${url.host}`;
    } catch {}
  }

  console.log("REQ ORIGIN =>", origin);

  if (origin && allowedOrigins.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    // fallback → your main frontend
    res.header(
      "Access-Control-Allow-Origin",
      "https://collage-repo-1-qxtl.vercel.app"
    );
  }

  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);
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
