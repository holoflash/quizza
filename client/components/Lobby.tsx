import { Player } from "client/App";
import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { h } from "preact";
import { css } from "@emotion/css";
import { Button } from "./Button";

type Alternative = {
  id: string;
  text: string;
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
      { id: crypto.randomUUID(), text: "" },
      { id: crypto.randomUUID(), text: "" },
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
      <div className={styles.fullWidth}>
        <input
          placeholder={"Question"}
          className={styles.input}
          type="text"
          value={quiz.value.question}
          onInput={handleQuestionChange}
          required
          maxLength={120}
        />
      </div>
      <div className={styles.alternatives}>
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    maxWidth: "480px",
    margin: "0 auto",
    padding: "1rem",
  }),
  title: css({
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1976d2",
    marginBottom: "1rem",
  }),
  label: css({
    fontWeight: 500,
    color: "#333",
    marginBottom: "0.5rem",
    display: "block",
  }),
  input: css({
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
  }),
  alternatives: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "0.75rem",
    marginBottom: "1rem",
  }),
  altRow: css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  addButtonRow: css({
    marginTop: "0.75rem",
    display: "flex",
    justifyContent: "center",
  }),
  fullWidth: css({
    width: "100%",
  }),
};
