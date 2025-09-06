import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "types/socketTypes";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  {
    autoConnect: false,
  },
);
