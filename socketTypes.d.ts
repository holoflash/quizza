import { Player } from "client/App";
import { Quiz } from "client/components/Lobby";

// Shared socket types for both client and server
export interface ServerToClientEvents {
  roomUpdate: (data: { playersInRoom: Player[] }) => void;
  roomClosed: () => void;
}

export interface ClientToServerEvents {
  createRoom: (
    data: { clientId: string; name: string; quiz?: Quiz },
    callback: (response: {
      success: boolean;
      roomCode?: string;
      playersInRoom?: Player[];
    }) => void,
  ) => void;

  joinRoom: (
    data: { roomCode: string; clientId: string; name: string },
    callback: (response: {
      success: boolean;
      message?: string;
      playersInRoom?: Player[];
      quiz?: Quiz;
    }) => void,
  ) => void;

  leaveRoom: (callback: () => void) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  roomCode?: string;
  clientId?: string;
}
