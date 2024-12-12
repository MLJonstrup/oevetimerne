// Kode inspireret fra følgende side: https://nodejs.org/en/learn/getting-started/introduction-to-nodejs

const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser'); // Importerer cookie-parser
const helmet = require("helmet"); // Importerer Helmet for sikkerhedsheadere
const app = express();
const postRoute = require("./routes/post.js");
const commentRoute = require("./routes/comment.js");
const userRoute = require("./routes/user.js");
const responseTime = require("response-time");
const cors = require("cors");

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
app.use(helmet());

// Tilføjer ekstra sikkerhedsheadere manuelt, hvis nødvendigt
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()'); // Blokerer brug af kamera/mikrofon
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin'); // Kontrollerer referrer-headeren
  next();
});

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

// Anvender routes fra de forskellige moduler
app.use("/post", postRoute);
app.use("/comments", commentRoute);
app.use("/user", userRoute);
