import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { socket } from "./core/socketClient";

type Player = {
  roomCode: string | null;
  clientId: string;
};

type Players = { id: string; clientId: string }[];

const getInitialPlayer = (): Player => {
  const stored = localStorage.getItem("playerState");
  return stored
    ? JSON.parse(stored)
    : { roomCode: null, clientId: crypto.randomUUID() };
};

export const App = () => {
  const players = useSignal<Players>([]);
  const error = useSignal<string | null>(null);
  const inLobby = useSignal(true);
  const player = useSignal<Player>(getInitialPlayer());

  const setPlayer = (update: Partial<Player>) => {
    player.value = { ...player.value, ...update };
    localStorage.setItem("playerState", JSON.stringify(player.value));
  };

  const path = window.location.pathname;
  const roomCodeFromPath =
    path.length > 1 ? decodeURIComponent(path.slice(1)).toUpperCase() : null;

  useEffect(() => {
    if (!roomCodeFromPath) return;

    socket.connect();
    socket.emit(
      "joinRoom",
      { roomCode: roomCodeFromPath, clientId: player.value.clientId },
      (response: any) => {
        if (response.success) {
          setPlayer({ roomCode: roomCodeFromPath });
          players.value = response.players;
          inLobby.value = false;
        } else {
          error.value = response.message;
        }
      },
    );

    const onRoomUpdate = (data: { players: Players }) => {
      players.value = data.players;
    };

    socket.on("roomUpdate", onRoomUpdate);

    return () => {
      socket.disconnect();
      socket.off("roomUpdate", onRoomUpdate);
    };
  }, [roomCodeFromPath]);

  const handleCreateRoom = () => {
    socket.connect();
    socket.emit(
      "createRoom",
      { clientId: player.value.clientId },
      (response: any) => {
        if (response.success) {
          setPlayer({ roomCode: response.roomCode });
          players.value = response.players;
          window.history.pushState({}, "", `/${response.roomCode}`);
          inLobby.value = false;
        }
      },
    );
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", () => {
      players.value = [];
      window.history.pushState({}, "", "/");
      localStorage.clear();
      inLobby.value = true;
    });
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Room URL copied to clipboard!");
  };

  const isHost =
    players.value.length > 0 &&
    players.value[0].clientId === player.value.clientId;

  return (
    <div class={""}>
      <div class={""}>
        {inLobby.value ? (
          <>
            <h1 class={""}>Quiz Room 🚀</h1>
            <button class={""} onClick={handleCreateRoom}>
              Create a New Room
            </button>
            <hr />
          </>
        ) : (
          <>
            <h1 class={""}>
              Room Code:
              <span class={""}>{player.value.roomCode}</span>
            </h1>
            <button class={""} onClick={copyUrlToClipboard}>
              📋 Copy Share URL
            </button>
            <button onClick={handleLeaveRoom} class={""}>
              {isHost ? "Leave Room & End Game" : "Leave Room"}
            </button>
            <h2>Players in this room:</h2>
            <ul class={""}>
              {players.value.map((p) => (
                <li class={""} key={p.id}>
                  {p.clientId} {p.clientId === player.value.clientId && "(You)"}
                </li>
              ))}
            </ul>
          </>
        )}
        {error.value && <div class={""}>{error.value}</div>}
      </div>
    </div>
  );
};
