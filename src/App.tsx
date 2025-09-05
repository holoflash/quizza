import { io, Socket } from "socket.io-client";
import { useEffect } from "preact/hooks";
import { ClientToServerEvents, ServerToClientEvents } from "types";
import { useSignal } from "@preact/signals";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: false,
});

export const App = () => {
  const roomCode = useSignal<string | null>(
    localStorage.getItem("roomCode") || null,
  );
  const players = useSignal<{ id: string; name: string }[]>([]);
  const name = useSignal("");
  const error = useSignal<string | null>(null);

  useEffect(() => {
    socket.connect();

    const queryParams = new URLSearchParams(window.location.search);
    const codeFromUrl = queryParams.get("room");
    const storedRoomCode = localStorage.getItem("roomCode");

    if (codeFromUrl) {
      const joinName = "Player " + Math.round(Math.random() * 100);
      handleJoinRoom(codeFromUrl, joinName);
    } else if (storedRoomCode) {
      const joinName = "Player " + Math.round(Math.random() * 100);
      handleJoinRoom(storedRoomCode, joinName);
    }

    const onRoomUpdate = (data: {
      players: { id: string; name: string }[];
    }) => {
      players.value = data.players;
    };

    socket.on("roomUpdate", onRoomUpdate);

    return () => {
      socket.disconnect();
      socket.off("roomUpdate", onRoomUpdate);
    };
  }, []);

  const handleCreateRoom = () => {
    socket.emit("createRoom", (response: any) => {
      if (response.success) {
        roomCode.value = response.roomCode;
        players.value = response.players;
        window.history.pushState({}, "", `?room=${response.roomCode}`);
        roomCode.value && localStorage.setItem("roomCode", roomCode.value);
      }
    });
  };

  const handleJoinRoom = (code: string, joinName: string) => {
    if (!code.trim() || !joinName.trim()) {
      error.value = "Please enter a room code and a name.";
      return;
    }
    error.value = null;
    socket.emit(
      "joinRoom",
      { roomCode: code.toUpperCase(), name: joinName },
      (response: any) => {
        if (response.success) {
          roomCode.value = code.toUpperCase();
          players.value = response.players;
          window.history.pushState({}, "", `?room=${code.toUpperCase()}`);
        } else {
          error.value = response.message;
        }
      },
    );
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Room URL copied to clipboard!");
  };

  const HomePage = () => {
    const joinCode = useSignal("");
    return (
      <div class="container">
        <h1>Quiz Room 🚀</h1>
        <button onClick={handleCreateRoom}>Create a New Room</button>
        <hr />
        <h2>Or Join an Existing Room</h2>
        {error.value && <p class="error">{error.value}</p>}
        <input
          type="text"
          placeholder="Your Name"
          value={name.value}
          onInput={(e) => (name.value = (e.target as HTMLInputElement).value)}
        />
        <input
          type="text"
          placeholder="Enter Room Code"
          value={joinCode.value}
          onInput={(e) =>
            (joinCode.value = (e.target as HTMLInputElement).value)
          }
          maxLength={5}
        />
        <button onClick={() => handleJoinRoom(joinCode.value, name.value)}>
          Join Room
        </button>
      </div>
    );
  };

  const Lobby = () => (
    <div class="container">
      <h1>
        Room Code: <span class="room-code">{roomCode.value}</span>
      </h1>
      <button onClick={copyUrlToClipboard}>📋 Copy Share URL</button>
      <h2>Players in this room:</h2>
      <ul>
        {players.value.map((player) => (
          <li key={player.id}>
            {player.name} {player.id === socket.id && "(You)"}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      {/* Conditionally render the Lobby or the Home Page */}
      {roomCode.value ? <Lobby /> : <HomePage />}
    </div>
  );
};
