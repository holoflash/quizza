import { useSignal } from "@preact/signals";

type Player = {
  roomCode: string | null;
  clientId: string;
};

export function usePlayerSignal() {
  const stored =
    typeof window !== "undefined" ? localStorage.getItem("playerState") : null;
  const initial: Player = stored
    ? JSON.parse(stored)
    : { roomCode: null, clientId: crypto.randomUUID() };
  return useSignal<Player>(initial);
}

export function setPlayer(playerSignal: any, update: Partial<Player>) {
  playerSignal.value = { ...playerSignal.value, ...update };
  localStorage.setItem("playerState", JSON.stringify(playerSignal.value));
}
