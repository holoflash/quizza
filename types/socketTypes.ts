// https://socket.io/docs/v4/typescript/
export interface ServerToClientEvents {
  roomUpdate: (data: { players: { id: string; clientId: string }[] }) => void;
  roomClosed: () => void;
}

export interface ClientToServerEvents {
  createRoom: (
    data: { clientId: string },
    callback: (response: {
      success: boolean;
      roomCode?: string;
      players?: { id: string; clientId: string }[];
    }) => void,
  ) => void;

  joinRoom: (
    data: { roomCode: string; clientId: string },
    callback: (response: {
      success: boolean;
      message?: string;
      players?: { id: string; clientId: string }[];
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
