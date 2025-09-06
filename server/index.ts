import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import path from "path";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
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

// Serve static files from dist/client
app.use(express.static(path.join(__dirname, "../client")));

const PORT = process.env.PORT || 4000;

const rooms: {
  [key: string]:
    | { hostClientId: string; players: { id: string; clientId: string }[] }
    | undefined;
} = {};

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

io.on("connection", (socket) => {
  socket.on("createRoom", async ({ clientId }, callback) => {
    let roomCode = generateRoomCode();
    while (typeof rooms[roomCode] !== "undefined") {
      roomCode = generateRoomCode();
    }

    await socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.clientId = clientId;

    const newRoom = {
      hostClientId: clientId,
      players: [{ id: socket.id, clientId }],
    };

    rooms[roomCode] = newRoom;

    callback({ success: true, roomCode, players: newRoom.players });
  });

  socket.on("joinRoom", async ({ roomCode, clientId }, callback) => {
    const room = rooms[roomCode];
    if (!room) {
      return callback({ success: false, message: "Room not found." });
    }

    const existingPlayer = room.players.find(
      (player) => player.clientId === clientId,
    );

    if (existingPlayer) {
      existingPlayer.id = socket.id;
    } else {
      room.players.push({ id: socket.id, clientId });
    }

    await socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.clientId = clientId;

    callback({ success: true, players: room.players });

    io.to(roomCode).emit("roomUpdate", { players: room.players });
  });

  socket.on("leaveRoom", async (callback) => {
    const roomCode = socket.data.roomCode as string;
    const room = rooms[roomCode];

    if (!room) {
      console.log("room not found");
      callback();
      return;
    }

    if (socket.data.clientId === room.hostClientId) {
      io.to(roomCode).emit("roomClosed");
      io.in(roomCode).socketsLeave(roomCode);
      delete rooms[roomCode];
      console.log(
        `Host ${socket.data.clientId} left. Room ${roomCode} deleted.`,
      );
    } else {
      room.players = room.players.filter(
        (player) => player.clientId !== socket.data.clientId,
      );
      await socket.leave(roomCode);
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
