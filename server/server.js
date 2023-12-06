const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const customerRoute = require("./routes/customer.js");
const postRoute = require("./routes/post.js");
//const userRoute = require("./routes/user.js");
//const commentsRoute = require("./routes/comment.js");
const http = require("http");
const io = require("socket.io");

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// Send client files from server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

// API
app.use("/customer", customerRoute);
app.use("/post", postRoute);

//app.use("/user", userRoute);
//app.use("/comment", commentsRoute);