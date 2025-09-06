import { Signal } from "@preact/signals";
import { Player } from "client/App";
import { copyUrlToClipboard } from "../utils/copyUrlToClipboard";
import { css, cx } from "@emotion/css";
import { Button } from "./Button";

export const Game = ({
  player,
  playersInRoom,
  isHost,
  handleLeaveRoom,
}: {
  player: Signal<Player>;
  playersInRoom: Signal<Player[]>;
  isHost: boolean;
  handleLeaveRoom: () => void;
}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>quizza</h1>
      <div className={styles.buttonRow}>
        <Button onClick={copyUrlToClipboard} label="Copy Invite URL" />
        <Button
          onClick={handleLeaveRoom}
          label={isHost ? "Close Room" : "Leave Room"}
        />
      </div>
      <div className={styles.sections}>
        {player.value.quiz && (
          <section className={styles.quizSection}>
            <h2 className={styles.question}>{player.value.quiz.question}</h2>
            <ul className={styles.alternatives}>
              {player.value.quiz.alternatives.map((item) => (
                <li className={styles.altItem} key={item.id}>
                  {item.text}
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className={styles.playersSection}>
          <ul className={styles.playerList}>
            {playersInRoom.value.map((playerInRoom) => {
              const isThisPlayer =
                playerInRoom.clientId === player.value.clientId;
              return (
                <li
                  className={cx(
                    styles.playerItem,
                    isThisPlayer && styles.playerMe,
                  )}
                  key={playerInRoom.clientId}
                >
                  {playersInRoom.value[0].clientId === playerInRoom.clientId &&
                    "HOST - "}
                  {playerInRoom.name}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};

const styles = {
  container: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "480px",
    margin: "0 auto",
  }),
  title: css({
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1976d2",
    marginBottom: "0.5rem",
  }),
  buttonRow: css({
    width: "100%",
    display: "flex",
    justifyContent: "center",
  }),
  sections: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  }),
  quizSection: css({
    padding: "1.5rem",
    marginBottom: "1rem",
  }),
  playersSection: css({
    background: "#fff",
    padding: "1rem",
  }),
  playerList: css({
    listStyle: "none",
    padding: 0,
    margin: 0,
    width: "100%",
  }),
  playerItem: css({
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    background: "#fff",
    border: "1px solid #e0e0e0",
    fontSize: ".8rem",
    color: "#444",
    marginBottom: "0.5rem",
  }),
  playerMe: css({
    color: "#1976d2",
    fontWeight: 600,
    border: "2px solid #1976d2",
    background: "#e3f2fd",
  }),
  question: css({
    fontSize: "1.3rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#333",
  }),
  alternatives: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1rem",
    listStyle: "none",
    padding: 0,
  }),
  altItem: css({
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    color: "#444",
    cursor: "pointer",
    transition: "background 0.2s",
    ":hover": {
      background: "#e9ecef",
    },
  }),
};
