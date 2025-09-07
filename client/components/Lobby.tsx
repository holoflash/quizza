import { Player } from "client/App";
import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { h } from "preact";
import { css } from "@emotion/css";
import { Button } from "./Button";
import { colors } from "../core/theme";

export type Alternative = {
  id: string;
  text: string;
  votes: number;
};

export type Quiz = {
  question: string;
  alternatives: Alternative[];
};

export const Lobby = ({
  handleSubmit,
  player,
}: {
  handleSubmit: () => void;
  player: Signal<Player>;
}) => {
  const quiz = useSignal<Quiz>({
    question: "",
    alternatives: [
      { id: crypto.randomUUID(), text: "", votes: 0 },
      { id: crypto.randomUUID(), text: "", votes: 0 },
    ],
  });

  useSignalEffect(() => {
    player.value.quiz = quiz.value;
  });

  const handleQuestionChange = (
    e: h.JSX.TargetedEvent<HTMLInputElement, Event>,
  ) => {
    quiz.value = { ...quiz.value, question: e.currentTarget.value };
  };

  const handleAlternativeChange = (id: string, value: string) => {
    quiz.value = {
      ...quiz.value,
      alternatives: quiz.value.alternatives.map((alt) =>
        alt.id === id ? { ...alt, text: value } : alt,
      ),
    };
  };

  const addAlternative = () => {
    const newAlternative: Alternative = {
      id: crypto.randomUUID(),
      text: "",
      votes: 0,
    };
    quiz.value = {
      ...quiz.value,
      alternatives: [...quiz.value.alternatives, newAlternative],
    };
  };

  const removeAlternative = (id: string) => {
    if (quiz.value.alternatives.length > 2) {
      quiz.value = {
        ...quiz.value,
        alternatives: quiz.value.alternatives.filter((alt) => alt.id !== id),
      };
    }
  };

  const onFormSubmit = (e: Event) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form className={styles.container} onSubmit={onFormSubmit} method="post">
      <h1 className={styles.title}>quizza</h1>
      <div className={styles.inputContainer}>
        <label className={styles.label}>Question</label>
        <input
          placeholder={"Your question here..."}
          className={styles.input}
          type="text"
          value={quiz.value.question}
          onInput={handleQuestionChange}
          required
          maxLength={120}
        />
      </div>
      <div className={styles.alternatives}>
        <label className={styles.label}>Options</label>
        {quiz.value.alternatives.map((alt, idx) => (
          <div className={styles.altRow} key={alt.id}>
            <input
              placeholder={`Option ${idx + 1}`}
              className={styles.input}
              type="text"
              value={alt.text}
              onInput={(e) =>
                handleAlternativeChange(alt.id, e.currentTarget.value)
              }
              required
              maxLength={60}
            />
            {quiz.value.alternatives.length > 2 && (
              <Button
                label="Remove"
                style="remove"
                onClick={() => removeAlternative(alt.id)}
              />
            )}
          </div>
        ))}
        <div className={styles.addButtonRow}>
          <Button style="chill" label="Add Option" onClick={addAlternative} />
        </div>
      </div>
      <Button submit label="Create Quiz" />
    </form>
  );
};

const styles = {
  container: css({
    fontFamily: "system-ui, sans-serif",
    maxWidth: "550px",
    margin: "2rem auto",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
  }),
  title: css({
    fontSize: "3rem",
    fontWeight: 800,
    color: colors.primary,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: "-1px",
  }),
  label: css({
    fontWeight: 600,
    color: colors.title,
    fontSize: "1rem",
    marginBottom: "0.5rem",
    display: "block",
    textTransform: "uppercase",
  }),
  inputContainer: css({
    width: "100%",
  }),
  input: css({
    padding: "0.75rem 1rem",
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    "&:focus": {
      outline: "none",
      border: `1px solid ${colors.primary}`,
    },
    "&::placeholder": {
      color: colors.text,
      opacity: 0.7,
    },
  }),
  alternatives: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1rem",
  }),
  altRow: css({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  }),
  addButtonRow: css({
    marginTop: "0.5rem",
  }),
};
