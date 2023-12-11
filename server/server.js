const https = require("https");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const postRoute = require("./routes/post.js");
const commentRoute = require("./routes/comment.js");

const options = {
  key: fs.readFileSync("privkey.pem"), //HTTPS private key
  cert: fs.readFileSync("newcert.pem"), //HTTPS certificate
};

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// Sending client files from server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/chat.html"));
});

app.get("/store", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/store.html"));
});

app.use("/post", postRoute);
app.use("/comments", commentRoute);

// app.use("/customer", customerRoute);

// Start server
https.createServer(options, app).listen(3001, () => {
  console.log("HTTPS server listening on port 3001"); //HTTPS
});
