const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const customerRoute = require("./routes/customer");
const storeRoutes = require("./routes/store");
const http = require("http");
const io = require("socket.io");

// Ports and setup for round robin load balancing
const ports = [3000, 3001, 3002, 3003];
let nextPortIndex = 0; // Variable to track the next available port

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

// Send client files from server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/home.html"));
});

app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/chat.html"));
});

app.get("/store", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/pages/store.html"));
});

// API
app.use("/customer", customerRoute);
app.use("/store", storeRoutes);

// Start all server instances
const servers = [];
for (const port of ports) {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server open on port ${port}`);
    servers.push(server); // Add the server to the list of active servers
  });
}

// Socket IO
const socketServers = [];
for (const server of servers) {
  const socketServer = io(server);
  socketServers.push(socketServer); // Add the socket server to the list of active socket servers
}

// Dynamic load balancing using round-robin algorithm
let currentPortIndex = 0;
socketServers.forEach((socketServer) => {
  socketServer.on("connection", (socket) => {
    const assignedPort = ports[currentPortIndex];
    socketServer.emit("connected", { port: assignedPort });

    // Update the next port index for future connections
    currentPortIndex = (currentPortIndex + 1) % ports.length;
  });
});