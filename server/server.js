const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser'); // Import cookie-parser
const app = express();
const postRoute = require("./routes/post.js");
const commentRoute = require("./routes/comment.js");
const userRoute = require("./routes/user.js");
const responseTime = require("response-time");
const cors = require("cors");

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Middlewares
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.use(express.static(path.join(__dirname, "../client")));
app.use(responseTime());
app.use(cors());

// Send client files from server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.get("/check-login", (req, res) => {
  if (req.cookies.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

app.use("/post", postRoute);
app.use("/comments", commentRoute);
app.use("/user", userRoute);
