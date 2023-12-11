const https = require("https");
const httpProxy = require("http-proxy");
const express = require("express");
const fs = require("fs");
const path = require("path");
const responseTime = require("response-time");

// Read SSL Certificate
const sslOptions = {
  key: fs.readFileSync("privkey.pem"),
  cert: fs.readFileSync("newcert.pem"),
};

// Initialize Express
const app = express();

const postRoute = require("./routes/post.js");
const commentRoute = require("./routes/comment.js");

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));
app.use(responseTime());

// Load Balancer Setup
// Create a HTTP Proxy
const proxy = httpProxy.createProxyServer({
  ssl: sslOptions,
  target: {
    host: "localhost",
    port: 8000,
  },
  secure: true,
});

// Function to create HTTPS servers
const createServer = (port) => {
  const server = https.createServer(sslOptions, app).listen(port, () => {
    console.log(
      "Express HTTPS server listening on port %d",
      server.address().port
    );
  });
  return server;
};

// Creating multiple HTTPS servers for load balancing
const server1 = createServer(4000);
const server2 = createServer(4001);
const server3 = createServer(4002);

// Array with server addresses
var addresses = [
  { host: "localhost", port: 4000, protocol: "https" },
  { host: "localhost", port: 4001, protocol: "https" },
  { host: "localhost", port: 4002, protocol: "https" },
];

// Round Robin Load Balancer as an HTTPS server
const balancer = https
  .createServer(sslOptions, (req, res) => {
    const target = addresses.shift();
    console.log("Load balancing request to:", target);
    proxy.web(
      req,
      res,
      {
        target: `${target.protocol}://${target.host}:${target.port}`,
        changeOrigin: true,
      },
      function (e) {
        console.log(e);
      }
    );
    addresses.push(target);
  })
  .listen(8000, () => {
    console.log("Load balancer running at port %d", balancer.address().port);
  });

// Express Routes
https.createServer(sslOptions, app).listen(3003, () => {
  console.log("HTTPS server listening on port 3003");
});

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

// Start the HTTPS server
https.createServer(sslOptions, app).listen(3002, () => {
  console.log("HTTPS server listening on port 3002");
});

// const https = require("https");
// const fs = require("fs");
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const responseTime = require('response-time');

// const app = express();

// const postRoute = require("./routes/post.js");
// const commentRoute = require("./routes/comment.js");

// const options = {
//   key: fs.readFileSync("privkey.pem"), //HTTPS private key
//   cert: fs.readFileSync("newcert.pem"), //HTTPS certificate
// };

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "../client")));

// // Sending client files from server
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/pages/home.html"));
// });

// app.get("/chat", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/pages/chat.html"));
// });

// app.get("/store", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/pages/store.html"));
// });

// app.use("/post", postRoute);
// app.use("/comments", commentRoute);

// // app.use("/customer", customerRoute);

// // Start server
// https.createServer(options, app).listen(3001, () => {
//   console.log("HTTPS server listening on port 3001"); //HTTPS
// });
