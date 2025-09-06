import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "types/socketTypes";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const server = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "../dist")));

const PORT = process.env.PORT || 4000;

const rooms: Record<
  string,
  { hostId: string; players: { id: string; clientId: string }[] }
> = {};

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("createRoom", ({ clientId }, callback) => {
    let roomCode = generateRoomCode();
    while (rooms[roomCode]) {
      roomCode = generateRoomCode();
    }

    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.clientId = clientId;

    rooms[roomCode] = {
      hostId: socket.id,
      players: [{ id: socket.id, clientId }],
    };

    callback({ success: true, roomCode, players: rooms[roomCode].players });
    console.log(`Room created: ${roomCode} by ${clientId} (${socket.id})`);
  });

  socket.on("joinRoom", ({ roomCode, clientId }, callback) => {
    if (!roomCode) {
      return callback({ success: false, message: "Room code is required." });
    }
    const room = rooms[roomCode];
    if (!room) {
      return callback({ success: false, message: "Room not found." });
    }

    const existingPlayerIndex = room.players.findIndex(
      (player) => player.clientId === clientId,
    );

    if (existingPlayerIndex !== -1) {
      room.players[existingPlayerIndex].id = socket.id;
      console.log(`Player ${clientId} re-joined room ${roomCode}`);
    } else {
      room.players.push({ id: socket.id, clientId });
      console.log(`User ${socket.id} joined room ${roomCode} as ${clientId}`);
    }

    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.clientId = clientId;

    callback({ success: true, players: room.players });

    io.to(roomCode).emit("roomUpdate", { players: room.players });
  });

  socket.on("leaveRoom", (callback) => {
    const roomCode = socket.data.roomCode;
    if (!roomCode || !rooms[roomCode]) {
      console.log(`User ${socket.id} attempted to leave a non-existent room.`);
      return callback();
    }

    const room = rooms[roomCode];

    if (socket.id === room.hostId) {
      io.to(roomCode).emit("roomUpdate", { players: [] });
      io.in(roomCode).socketsLeave(roomCode);
      delete rooms[roomCode];
      console.log(`Host ${socket.id} left. Room ${roomCode} deleted.`);
    } else {
      room.players = room.players.filter(
        (player) => player.clientId !== socket.data.clientId,
      );
      socket.leave(roomCode);
      io.to(roomCode).emit("roomUpdate", { players: room.players });
      console.log(`Player ${socket.id} left room ${roomCode}.`);
    }

    delete socket.data.roomCode;
    delete socket.data.clientId;

    callback();
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
