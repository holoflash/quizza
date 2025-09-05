// server/index.ts
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "types";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const server = createServer(app);

// https://socket.io/docs/v4/typescript/
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
  { hostId: string; players: { id: string; name: string }[] }
> = {};

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("createRoom", (callback) => {
    let roomCode = generateRoomCode();
    while (rooms[roomCode]) {
      roomCode = generateRoomCode();
    }

    socket.join(roomCode);
    rooms[roomCode] = {
      hostId: socket.id,
      players: [{ id: socket.id, name: "Host" }],
    };

    // Store room code on the socket instance for easy access later
    (socket as any).roomCode = roomCode;

    // Send the created room details back to the host
    callback({ success: true, roomCode, players: rooms[roomCode].players });
    console.log(`Room created: ${roomCode} by ${socket.id}`);
  });

  // Event for players to join an existing room
  socket.on("joinRoom", ({ roomCode, name }, callback) => {
    const room = rooms[roomCode];

    if (!room) {
      // If room does not exist, inform the client
      return callback({ success: false, message: "Room not found." });
    }

    socket.join(roomCode);
    room.players.push({ id: socket.id, name });

    // Store room code on the socket instance
    (socket as any).roomCode = roomCode;

    // Inform the joining player of success
    callback({ success: true, players: room.players });

    // Broadcast the updated player list to everyone in the room
    io.to(roomCode).emit("roomUpdate", { players: room.players });
    console.log(`User ${socket.id} joined room ${roomCode}`);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    const roomCode = (socket as any).roomCode;
    const room = rooms[roomCode];

    if (room) {
      // Remove the player from the room's player list
      room.players = room.players.filter((player) => player.id !== socket.id);

      // If the room is empty, delete it
      if (room.players.length === 0) {
        delete rooms[roomCode];
        console.log(`Room ${roomCode} is empty and has been deleted.`);
      } else {
        // If the disconnected user was the host, assign a new host
        if (room.hostId === socket.id) {
          room.hostId = room.players[0].id; // New host is the next player in the list
        }
        // Broadcast the updated player list to the remaining players
        io.to(roomCode).emit("roomUpdate", { players: room.players });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
