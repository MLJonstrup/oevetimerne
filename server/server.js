const https = require("https"); //det her er til https
const fs = require("fs"); //det her er til https
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const postRoute = require("./routes/post.js");
const userRoute = require("./routes/user.js");
// const storeRoutes = require("./routes/store");

//const http = require("http").Server(app);
//const io = require("socket.io")(http);

//const chatLog = require("./db/chat.js");

const options = {
  //det her er til https
  key: fs.readFileSync("privkey.pem"), //det her er til https
  cert: fs.readFileSync("newcert.pem"), //det her er til https
};

// Middlewares

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// Send client files from server

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});



// API

app.use("/post", postRoute);
app.use("/user", userRoute);
// app.use("/store", storeRoutes);

// Start server

https.createServer(options, app).listen(3001, () => {
  //det her er til https
  console.log("HTTPS server listening on port 3001"); //det her er til https
});

/* app.listen(3000, () => {
  console.log("Server open on port 3000");
});
 */
// Socket IO

/* io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    chatLog.push(msg);
    console.log(chatLog);
  });
  socket.on("user joined", (username) => {
    console.log(username + " joined the chat");
    io.emit("chat message", username + " joined the chat");
  });
  socket.on("hola", (besked) => {
    console.log(besked);
    io.emit("hola", "besked tilbage til klienten..");
  });
});

http.listen(3000, "localhost", () => {
  console.log(`Socket.IO server running at http://localhost:3000/`);
}); */

//nedensrående kode er micheals kode, dvs pre https

/* const express = require("express");
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
  console.log("Server listening on port 3000");
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
//app.use("/comment", commentsRoute); */
