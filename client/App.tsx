import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { socket } from "./core/socketClient";
import { usePlayerSignal, setPlayer } from "./features/player";

type Players = { id: string; clientId: string }[];

export const App = () => {
  const player = usePlayerSignal();
  const players = useSignal<Players>([]);
  const error = useSignal<string | null>(null);
  const inLobby = useSignal(true);
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
          setPlayer(player, { roomCode: roomCodeFromPath });
          players.value = response.players;
          inLobby.value = false;
        } else {
          error.value = response.message;
        }
      },
    );

    const onRoomUpdate = (data: { players: Players }) => {
      if (data.players.length === 0) {
        players.value = [];
        window.history.pushState({}, "", "/");
        localStorage.clear();
        inLobby.value = true;
      }
      players.value = data.players;
    };

    const onRoomClosed = () => {
      players.value = [];
      window.history.pushState({}, "", "/");
      localStorage.clear();
      inLobby.value = true;
      alert("The host has ended the game. Returning to start page.");
    };

    socket.on("roomUpdate", onRoomUpdate);
    socket.on("roomClosed", onRoomClosed);

    return () => {
      socket.disconnect();
      socket.off("roomUpdate", onRoomUpdate);
      socket.off("roomClosed", onRoomClosed);
    };
  }, [roomCodeFromPath]);

  const handleCreateRoom = () => {
    socket.connect();
    socket.emit(
      "createRoom",
      { clientId: player.value.clientId },
      (response: any) => {
        if (response.success) {
          setPlayer(player, { roomCode: response.roomCode });
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

  const copyUrlToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
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
