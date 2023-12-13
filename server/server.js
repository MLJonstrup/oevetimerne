const express = require("express");
const path = require("path");
const app = express();
const postRoute = require("./routes/post.js");
const commentRoute = require("./routes/comment.js");
const responseTime = require("response-time");

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));
app.use(responseTime());

// Send client files from server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.use("/post", postRoute);
app.use("/comments", commentRoute);