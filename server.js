const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// DEV FLAG SYSTEM
const isDevStatic = process.argv.includes("--devstatic");
const isDev = process.argv.includes("--dev") || isDevStatic;

let waitingPlayer = null;
const rooms = {};
const friendRooms = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Broadcast both dev flags to the client immediately
  socket.emit("init_data", { isDev, isDevStatic });

  socket.on("join_random", () => {
    if (
      waitingPlayer &&
      waitingPlayer.id !== socket.id &&
      waitingPlayer.connected
    ) {
      const p1 = waitingPlayer;
      const p2 = socket;
      waitingPlayer = null;

      const roomId = `room_${p1.id}_${p2.id}`;
      p1.join(roomId);
      p2.join(roomId);

      p1.roomId = roomId;
      p2.roomId = roomId;

      rooms[roomId] = { p1: p1.id, p2: p2.id, timeLeft: 180, timer: null };

      io.to(roomId).emit("match_start");
      startTimer(roomId);
    } else {
      waitingPlayer = socket;
      socket.emit("waiting");
    }
  });

  socket.on("create_friend_room", () => {
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    socket.join(code);
    socket.roomId = code;
    friendRooms[code] = { p1: socket };
    socket.emit("room_created", code);
  });

  socket.on("join_friend_room", (code) => {
    if (friendRooms[code] && friendRooms[code].p1) {
      const p1 = friendRooms[code].p1;
      const p2 = socket;

      p2.join(code);
      p1.roomId = code;
      p2.roomId = code;

      rooms[code] = { p1: p1.id, p2: p2.id, timeLeft: 180, timer: null };

      io.to(code).emit("match_start");
      startTimer(code);

      delete friendRooms[code];
    } else {
      socket.emit("error_msg", "Invalid Code or Room Full");
    }
  });

  function startTimer(roomId) {
    rooms[roomId].timer = setInterval(() => {
      if (!rooms[roomId]) return;
      rooms[roomId].timeLeft--;
      io.to(roomId).emit("timer_update", rooms[roomId].timeLeft);

      if (rooms[roomId].timeLeft <= 0) {
        clearInterval(rooms[roomId].timer);
        io.to(roomId).emit("time_up");
      }
    }, 1000);
  }

  socket.on("play_card", (data) => {
    if (socket.roomId) socket.to(socket.roomId).emit("opponent_played", data);
  });

  socket.on("leave_match", () => {
    if (socket.roomId && rooms[socket.roomId]) {
      socket.to(socket.roomId).emit("opponent_disconnected");
      if (rooms[socket.roomId].timer) clearInterval(rooms[socket.roomId].timer);
      delete rooms[socket.roomId];
      socket.leave(socket.roomId);
      socket.roomId = null;
    }
  });

  socket.on("disconnect", () => {
    if (waitingPlayer === socket) waitingPlayer = null;

    for (let code in friendRooms) {
      if (friendRooms[code].p1 === socket) delete friendRooms[code];
    }

    if (socket.roomId && rooms[socket.roomId]) {
      socket.to(socket.roomId).emit("opponent_disconnected");
      if (rooms[socket.roomId].timer) clearInterval(rooms[socket.roomId].timer);
      delete rooms[socket.roomId];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server live on port ${PORT}`);
  if (isDevStatic)
    console.log(
      `[DEBUG STATIC MODE ACTIVE] Troops are frozen and attack ranges are visible!`,
    );
  else if (isDev)
    console.log(`[DEBUG MODE ACTIVE] Troop attack ranges will be visible!`);
});
