const express = require('express');
const http = require('http');
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
const { socketHandler } = require("../backend/socketServer/socket.js");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

dotenv.config({ path: "backend/env/.env" });

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

if (process.env.NODE_ENV === 'development') {
  allowedOrigins.add('http://localhost:3000');
  allowedOrigins.add('http://127.0.0.1:3000');
}

// ---------- DEBUG HEADERS (Development Only) ----------
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log("---- FULL HEADERS ----");
    console.log(req.headers);
    next();
  });
}

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

  if (process.env.NODE_ENV === 'development') {
    console.log("REQ ORIGIN =>", origin);
  }

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

// ---------- SECURITY HEADERS ----------
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ---------- ROUTES ----------
app.get('/', (req, res) => {
  res.json({ message: 'College API Server', status: 'running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use(express.json());

app.use("/question", questions);
app.use("/student", user);
app.use("/messages", messages);
app.use("/community", community);
app.use("/marks", marks);

// ---------- 404 HANDLER ----------
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// ---------- GLOBAL ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ---------- DB ----------
Connect();

// ---------- SOCKET.IO ----------
socketHandler(server);

// ---------- SERVER ----------
server.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server listening on port http://localhost:${port}`);
  }
});

module.exports = server;
