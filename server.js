const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    server: "running",
    ip: req.socket.localAddress,
    port: req.socket.localPort,
  });
});

let waitingPlayer = null;
const rooms = {};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_game", () => {
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

      rooms[roomId] = {
        p1: p1.id,
        p2: p2.id,
        timeLeft: 180,
        timer: null,
      };

      console.log(`Match started in ${roomId}`);

      io.to(roomId).emit("match_start");

      rooms[roomId].timer = setInterval(() => {
        if (!rooms[roomId]) return;

        rooms[roomId].timeLeft--;

        io.to(roomId).emit("timer_update", rooms[roomId].timeLeft);

        if (rooms[roomId].timeLeft <= 0) {
          clearInterval(rooms[roomId].timer);

          io.to(roomId).emit("time_up");
        }
      }, 1000);
    } else {
      waitingPlayer = socket;

      socket.emit("waiting");

      console.log("Player queued in lobby:", socket.id);
    }
  });

  socket.on("play_card", (data) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit("opponent_played", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    if (waitingPlayer === socket) {
      waitingPlayer = null;
    }

    if (socket.roomId && rooms[socket.roomId]) {
      socket.to(socket.roomId).emit("opponent_disconnected");

      if (rooms[socket.roomId].timer) {
        clearInterval(rooms[socket.roomId].timer);
      }

      delete rooms[socket.roomId];
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`LAN URL: http://192.168.1.9:${PORT}`);
});
