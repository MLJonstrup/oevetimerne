// Kode inspireret fra følgende side: https://nodejs.org/en/learn/getting-started/introduction-to-nodejs

const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser'); // Importerer cookie-parser
const helmet = require("helmet"); // Importerer Helmet for sikkerhedsheadere
const rateLimit = require("express-rate-limit"); // Til beskyttelse mod brute force
const app = express();
const postRoute = require("./routes/post.js");
const commentRoute = require("./routes/comment.js");
const userRoute = require("./routes/user.js");
const responseTime = require("response-time");
const cors = require("cors");

// Middleware til rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutter
  max: 100, // Maksimalt antal anmodninger per IP
  message: "For mange anmodninger fra denne IP. Prøv igen senere."
});

// Tilføj rate limiter på alle ruter
app.use(limiter);

// Starter serveren på port 3000
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Middlewares
app.use(express.json()); // Håndterer JSON data i anmodninger
app.use(cookieParser()); // Anvender cookie-parser middleware
app.use(express.static(path.join(__dirname, "../client"))); // Serverer statiske filer fra "client" mappen
app.use(responseTime()); // Logger svartid for anmodninger
app.use(cors()); // Aktiverer CORS for at tillade tværs-domæne anmodninger

// Tilføjer Helmet for at implementere sikkerhedsheadere
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Include unsafe-inline if necessary
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);



// Autentificeringsmiddleware
const authenticateUser = (req, res, next) => {
  if (!req.cookies.userId) {
    return res.status(401).json({ error: "Unauthorized access. Log ind først." });
  }
  next();
};

// Send client files fra server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

// Route for at tjekke, om brugeren er logget ind
app.get("/check-login", (req, res) => {
  if (req.cookies.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Anvender autentificering på POST og COMMENTS ruter
app.use("/post", authenticateUser, postRoute);
app.use("/comments", authenticateUser, commentRoute);

// User routes kræver ikke autentificering (som login og registrering)
app.use("/user", userRoute);

module.exports = app;
