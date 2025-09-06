export function getPlayerBySocketId(socketId, rooms) {
    for (const room of Object.values(rooms)) {
        const player = room.players.find((p) => p.id === socketId);
        if (player)
            return player.name;
    }
    return undefined;
}
