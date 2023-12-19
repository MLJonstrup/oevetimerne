const express = require("express");
const path = require("path");
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
app.use(express.static(path.join(__dirname, "../client")));
app.use(responseTime());
app.use(cors());


// Send client files from server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.use("/post", postRoute);
app.use("/comments", commentRoute);
app.use("/user", userRoute);
