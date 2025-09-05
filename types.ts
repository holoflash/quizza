// https://socket.io/docs/v4/typescript/
export interface ServerToClientEvents {
  roomUpdate: (data: { players: { id: string; name: string }[] }) => void;
}

export interface ClientToServerEvents {
  createRoom: (
    callback: (response: {
      success: boolean;
      roomCode?: string;
      players?: { id: string; name: string }[];
    }) => void,
  ) => void;

  joinRoom: (
    data: { roomCode: string; name: string },
    callback: (response: {
      success: boolean;
      message?: string;
      players?: { id: string; name: string }[];
    }) => void,
  ) => void;
}
export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
  roomCode?: string;
}
