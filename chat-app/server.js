const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/chatAppDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB:", err);
});

mongoose.connection.once("open", async () => {
  try {
    const savedRooms = await Room.find();
    rooms = savedRooms.map(room => ({ name: room.name, creator: room.creator }));
    console.log("Rooms loaded from database:", rooms);

    // Check if the "global" room exists; if not, create it, we need this room for default chat
    let globalRoom = await Room.findOne({ name: "global" });
    if (!globalRoom) {
      globalRoom = new Room({ name: "global", creator: "system" });
      await globalRoom.save();
      rooms.push({ name: globalRoom.name, creator: globalRoom.creator });
      console.log("Global room created.");
    } else {
      console.log("Global room already exists.");
    }
  } catch (error) {
    console.error("Error loading or creating rooms:", error);
  }
});


// Define user model for authentication
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Define message model to store chat messages
const messageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["message", "announcement"], required: true },
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Define room model to track chat rooms
const roomSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  creator: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Room = mongoose.model("Room", roomSchema);

// Middleware for static files and session handling
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Registration route for new users
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "User already exists" });
    } else {
      res.status(500).json({ message: "Error registering user" });
    }
  }
});

// Login route for existing users
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    req.session.user = username;
    res.json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Logout route to end user session
app.post("/logout", (req, res) => {
  const username = req.session.user;
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    if (username && usernames[username]) {
      delete usernames[username];
      io.sockets.emit("updateUsers", usernames); // Update user list
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Middleware to restrict Socket connections to authenticated users
io.use((socket, next) => {
  const sessionID = socket.request.headers.cookie?.split('=')[1];
  if (sessionID) {
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

var usernames = {};
io.on("connection", function (socket) {
  console.log(`User connected to server.`);

  // Track rooms joined by user
  socket.joinedRooms = new Set();

  socket.on("createUser", async function (username) {
    socket.username = username;
    usernames[username] = username;
    socket.currentRoom = "global";
    socket.join("global");

    console.log(`User ${username} created on server successfully.`);

    // Load chat history for "global" room
    const historyMessages = await Message.find({ room: socket.currentRoom }).sort({ timestamp: 1 });
    historyMessages.forEach((msg) => {
      socket.emit("updateChat", msg.username, msg.content);
    });

    // Send join announcement once per room
    if (!socket.joinedRooms.has("global")) {
      socket.joinedRooms.add("global");
      socket.broadcast
        .to("global")
        .emit("updateChat", "INFO", username + " has joined global room");

      const userJoinMessage = new Message({
        room: "global",
        username: "INFO",
        content: username + " has joined global room",
        type: "announcement"
      });
      await userJoinMessage.save();
    }

    io.sockets.emit("updateUsers", usernames);
    socket.emit("updateRooms", rooms, "global");
  });

  // Send and save message to the database
  socket.on("sendMessage", async function (data) {
    const message = new Message({
      room: socket.currentRoom,
      username: socket.username,
      content: data,
      type: "message"
    });
    await message.save();
    io.sockets.to(socket.currentRoom).emit("updateChat", socket.username, data);
  });

  // Create a new chat room
  socket.on("createRoom", async function (roomName) {
    if (roomName) {
      try {
        let existingRoom = await Room.findOne({ name: roomName });
        if (!existingRoom) {
          const newRoom = new Room({ name: roomName, creator: socket.username });
          await newRoom.save();
          const rooms = await Room.find();
          io.sockets.emit("updateRooms", rooms, null);
        }
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }
  });

  // Update user's room and load history
  socket.on("updateRooms", async function (room) {
    socket.broadcast
      .to(socket.currentRoom)
      .emit("updateChat", "INFO", socket.username + " left room");
    socket.leave(socket.currentRoom);
    socket.currentRoom = room;
    socket.join(room);

    // Load room history messages
    const historyMessages = await Message.find({ room: socket.currentRoom }).sort({ timestamp: 1 });
    historyMessages.forEach((msg) => {
      socket.emit("updateChat", msg.username, msg.content);
    });

    // Send join announcement once per room
    if (!socket.joinedRooms.has(room)) {
      socket.joinedRooms.add(room);
      socket.broadcast
        .to(room)
        .emit("updateChat", "INFO", socket.username + " has joined " + room + " room");

      const userJoinMessage = new Message({
        room: room,
        username: "INFO",
        content: socket.username + " has joined " + room + " room",
        type: "announcement"
      });
      await userJoinMessage.save();
    }
  });

  // Handle user disconnection
  socket.on("disconnect", function () {
    console.log(`User ${socket.username} disconnected from server.`);
    delete usernames[socket.username];
    io.sockets.emit("updateUsers", usernames);
    socket.broadcast.emit(
      "updateChat",
      "INFO",
      socket.username + " has disconnected"
    );
  });
});

// Start the server
server.listen(5000, function () {
  console.log("Listening to port http://localhost:5000.");
});
