export function getPlayerBySocketId(
  socketId: string,
  rooms: Record<string, { players: { id: string; name: string }[] }>,
): string | undefined {
  for (const room of Object.values(rooms)) {
    const player = room.players.find((p) => p.id === socketId);
    if (player) return player.name;
  }
  return undefined;
}
