const express = require('express');
const app = express();
const db = require('./Database/db');
const notesRouter = require('./Routes/notes');
const cors = require("cors");
const { Server } = require('socket.io');
const http = require('http');

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  // React frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Routes
app.use("/notes", notesRouter);

const server = http.createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

// Track active users using Set of socket IDs
let activeSockets = new Set();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Add the socket to the active set
  activeSockets.add(socket.id);

  // Emit the count of active users
  io.emit("activeUsers", activeSockets.size);

  // Listen for messages (optional feature)
  socket.on("message", (data) => {
    console.log("Message Received:", data);
    io.emit("message", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    activeSockets.delete(socket.id); // remove socket from set
    io.emit("activeUsers", activeSockets.size);
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send("Welcome to the homepage");
});

// Attach io instance to app so it can be used in routes (like notes.js)
app.set('io', io);

const PORT =  3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
