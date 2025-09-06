import { css } from "@emotion/css";

export const Button = ({
  label,
  onClick,
  submit,
  style,
}: {
  label: string;
  onClick?: () => void;
  submit?: boolean;
  style?: "button" | "remove" | "chill";
}) => {
  return (
    <button
      type={submit ? "submit" : "button"}
      class={styles[style ?? "button"]}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export const baseButton = css({
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "0.5rem 1.2rem",
  width: "fit-content",
  fontWeight: 600,
  cursor: "pointer",
  marginTop: "0.5rem",
  marginRight: "0.5rem",
  transition: "background 0.2s",
});

const styles = {
  button: css([
    baseButton,
    {
      background: "#1976d2",
      ":hover": {
        background: "#1565c0",
      },
    },
  ]),
  remove: css([
    baseButton,
    {
      all: "unset",
      fontWeight: "800",
      fontSize: ".8rem",
      textDecoration: "underline",
      color: "black",
      cursor: "pointer",
      ":hover": {
        color: "#b31a1aff",
      },
    },
  ]),
  chill: css([
    baseButton,
    {
      all: "unset",
      fontWeight: "800",
      fontSize: ".8rem",
      textDecoration: "underline",
      color: "black",
      cursor: "pointer",
      ":hover": {
        color: "#e09705ff",
      },
    },
  ]),
};
