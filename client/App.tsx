import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { socket } from "./core/socketClient";
import { Lobby, Quiz } from "./components/Lobby";
import { Game } from "./components/Game";
import { randomName } from "./utils/getRandomName";

export type Player = {
  roomCode: string | null;
  clientId: string;
  name: string;
  quiz?: Quiz;
};

export type PlayersInRoom = Player[];

const usePlayerSignal = () => {
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("playerState") : null;
  const initial: Player = stored
    ? JSON.parse(stored)
    : { roomCode: null, clientId: crypto.randomUUID(), name: randomName };
  return useSignal<Player>(initial);
};

const setPlayer = (playerSignal: any, update: Partial<Player>) => {
  playerSignal.value = { ...playerSignal.value, ...update };
  localStorage.setItem("playerState", JSON.stringify(playerSignal.value));
};

export const App = () => {
  const player = usePlayerSignal();
  const playersInRoom = useSignal<PlayersInRoom>([]);
  const error = useSignal<string | null>(null);
  const inLobby = useSignal(true);
  const params = new URLSearchParams(window.location.search);
  const roomCodeFromQuery = params.get("room")?.toUpperCase() || null;

  useEffect(() => {
    if (!roomCodeFromQuery) return;

    socket.connect();
    socket.emit(
      "joinRoom",
      {
        roomCode: roomCodeFromQuery,
        clientId: player.value.clientId,
        name: player.value.name,
      },
      (response: any) => {
        if (response.success) {
          setPlayer(player, {
            roomCode: roomCodeFromQuery,
            quiz: response.quiz,
          });
          playersInRoom.value = response.playersInRoom;
          inLobby.value = false;
        } else {
          error.value = response.message;
        }
      },
    );

    const onRoomUpdate = (data: { playersInRoom: PlayersInRoom }) => {
      if (data.playersInRoom.length === 0) {
        playersInRoom.value = [];
        window.history.pushState({}, "", "/");
        localStorage.clear();
        inLobby.value = true;
      }
      playersInRoom.value = data.playersInRoom;
    };

    const onRoomClosed = () => {
      playersInRoom.value = [];
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
  }, [roomCodeFromQuery]);

  const handleCreateRoom = () => {
    console.log("success?");
    socket.connect();
    socket.emit(
      "createRoom",
      {
        clientId: player.value.clientId,
        name: player.value.name,
        quiz: player.value.quiz,
      },
      (response: any) => {
        if (response.success) {
          setPlayer(player, { roomCode: response.roomCode });
          playersInRoom.value = response.playersInRoom;
          window.history.pushState({}, "", `/?room=${response.roomCode}`);
          inLobby.value = false;
        }
      },
    );
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", () => {
      playersInRoom.value = [];
      window.history.pushState({}, "", "/");
      localStorage.clear();
      inLobby.value = true;
      window.location.reload();
    });
  };

  const isHost =
    playersInRoom.value.length > 0 &&
    playersInRoom.value[0].clientId === player.value.clientId;

  return (
    <div class={""}>
      {inLobby.value ? (
        <Lobby player={player} handleSubmit={handleCreateRoom} />
      ) : (
        <Game
          player={player}
          playersInRoom={playersInRoom}
          isHost={isHost}
          handleLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
};
