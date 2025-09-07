import { Signal } from "@preact/signals";
import { Player } from "client/App";
import { copyUrlToClipboard } from "../utils/copyUrlToClipboard";
import { css, cx } from "@emotion/css";
import { Button } from "./Button";
import { Alternative } from "./Lobby";
import { colors } from "../core/theme";

export const Game = ({
  player,
  playersInRoom,
  isHost,
  handleLeaveRoom,
  handleVote,
}: {
  player: Signal<Player>;
  playersInRoom: Signal<Player[]>;
  isHost: boolean;
  handleLeaveRoom: () => void;
  handleVote: (id: Alternative["id"]) => void;
}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>quizza</h1>
      <div className={styles.sections}>
        {player.value.quiz && (
          <section className={styles.quizSection}>
            <h2 className={styles.question}>{player.value.quiz.question}</h2>
            <ul className={styles.alternatives}>
              {(() => {
                const totalVotes =
                  player.value.quiz!.alternatives.reduce(
                    (sum, alt) => sum + (alt.votes || 0),
                    0,
                  ) || 1;

                return player.value.quiz!.alternatives.map((item) => {
                  const percent = Math.round(
                    ((item.votes || 0) / totalVotes) * 100,
                  );
                  return (
                    <li key={item.id}>
                      <div className={styles.altTitle}>{item.text}</div>
                      <div
                        className={styles.progressBar}
                        onClick={() => handleVote(item.id)}
                        title={`Votes: ${item.votes || 0}`}
                      >
                        <div
                          className={styles.progressFill}
                          style={{ width: `${percent}%` }}
                        />
                        <span className={styles.progressLabel}>
                          {item.votes || 0} vote
                          {(item.votes || 0) !== 1 ? "s" : ""} ({percent}%)
                        </span>
                      </div>
                    </li>
                  );
                });
              })()}
            </ul>
          </section>
        )}
        <div className={styles.buttonRow}>
          <Button onClick={copyUrlToClipboard} label="Copy Invite URL" />
          <Button
            onClick={handleLeaveRoom}
            label={isHost ? "Close Room" : "Leave Room"}
          />
        </div>
        <section className={styles.playersSection}>
          <h2 className={styles.sectionTitle}>Players</h2>
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
                  <span
                    className={cx(
                      styles.playerName,
                      isThisPlayer && styles.playerMeName,
                    )}
                  >
                    {playerInRoom.name}
                  </span>
                  {playersInRoom.value[0].clientId ===
                    playerInRoom.clientId && (
                    <span className={styles.playerHostLabel}>HOST</span>
                  )}
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
    fontFamily: "system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
  }),
  title: css({
    fontSize: "3rem",
    fontWeight: 800,
    color: colors.primary,
    marginBottom: "2rem",
    textTransform: "uppercase",
    letterSpacing: "-1px",
  }),
  buttonRow: css({
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "2rem",
    width: "100%",
    maxWidth: "550px",
  }),
  sections: css({
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  }),
  quizSection: css({
    border: `1px solid ${colors.border}`,
    borderRadius: "4px",
    padding: "1.5rem",
    paddingTop: "0",
  }),
  playersSection: css({
    padding: "1.5rem",
    paddingTop: "0",
  }),
  sectionTitle: css({
    fontSize: "1rem",
    fontWeight: 700,
    color: colors.text,
    borderBottom: `1px solid ${colors.text}`,
    paddingBottom: "0.5rem",
  }),
  playerList: css({
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  }),
  playerItem: css({
    fontSize: ".8rem",
    color: colors.text,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  playerName: css({
    fontWeight: 500,
  }),
  playerHostLabel: css({
    color: colors.accent,
    fontWeight: 600,
    fontSize: "0.8rem",
  }),
  playerMe: css({
    color: colors.me,
  }),
  playerMeName: css({
    fontWeight: 700,
  }),
  question: css({
    fontSize: "1.25rem",
    fontWeight: 600,
    color: colors.title,
    marginBottom: "1.5rem",
  }),
  alternatives: css({
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  }),
  altTitle: css({
    fontWeight: 500,
    color: colors.text,
    marginBottom: "0.5rem",
  }),
  progressBar: css({
    position: "relative",
    height: "2.5rem",
    backgroundColor: colors.border,
    overflow: "hidden",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "box-shadow 0.2s",
    "&:hover": {
      boxShadow: `0 0 0 1px ${colors.accent}`,
    },
  }),
  progressFill: css({
    borderRadius: "4px",
    height: "100%",
    backgroundColor: colors.primary,
    transition: "width 0.3s ease",
  }),
  progressLabel: css({
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    color: colors.cardBg,
    fontWeight: 400,
    fontSize: "0.95rem",
    pointerEvents: "none",
    zIndex: 1,
  }),
};
