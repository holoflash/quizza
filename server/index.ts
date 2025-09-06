import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import fs from "fs";
import url from "url";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "socketTypes";
import { Player } from "client/App";
import { Quiz } from "client/components/Lobby";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const server = createServer((req, res) => {
  const filePath = path.join(
    __dirname,
    "../client",
    req.url === "/" ? "/index.html" : req.url!,
  );
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 4000;

const rooms: {
  [key: string]:
    | { hostClientId: string; playersInRoom: Player[]; quiz?: Quiz }
    | undefined;
} = {};

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

io.on("connection", (socket) => {
  socket.on("createRoom", async ({ clientId, name, quiz }, callback) => {
    let roomCode = generateRoomCode();
    while (typeof rooms[roomCode] !== "undefined") {
      roomCode = generateRoomCode();
    }

    await socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.clientId = clientId;

    const newRoom = {
      hostClientId: clientId,
      playersInRoom: [{ clientId, name, roomCode }],
      quiz,
    };

    rooms[roomCode] = newRoom;

    callback({ success: true, roomCode, playersInRoom: newRoom.playersInRoom });
  });

  socket.on("joinRoom", async ({ roomCode, clientId, name }, callback) => {
    const room = rooms[roomCode];
    if (!room) {
      return callback({ success: false, message: "Room not found." });
    }

    const existingPlayer = room.playersInRoom.find(
      (player: Player) => player.clientId === clientId,
    );

    if (!existingPlayer) {
      room.playersInRoom.push({ clientId, name, roomCode });
    }

    await socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.clientId = clientId;

    callback({
      success: true,
      playersInRoom: room.playersInRoom,
      quiz: room.quiz,
    });

    io.to(roomCode).emit("roomUpdate", { playersInRoom: room.playersInRoom });
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
      room.playersInRoom = room.playersInRoom.filter(
        (player: Player) => player.clientId !== socket.data.clientId,
      );
      await socket.leave(roomCode);
      io.to(roomCode).emit("roomUpdate", { playersInRoom: room.playersInRoom });
      console.log(`Player ${socket.id} left room ${roomCode}.`);
    }

    delete socket.data.roomCode;
    delete socket.data.clientId;

    callback();
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
