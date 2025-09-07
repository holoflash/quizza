import { css } from "@emotion/css";
import { colors } from "../core/theme";

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

const baseButton = css({
  border: "none",
  borderRadius: "4px",
  padding: "0.5rem 1rem",
  width: "fit-content",
  fontWeight: 400,
  cursor: "pointer",
  fontSize: "1rem",
  transition: "all 0.1s",
});

const styles = {
  button: css([
    baseButton,
    {
      backgroundColor: colors.text,
      color: colors.cardBg,
      "&:hover": {
        backgroundColor: colors.secondary,
      },
    },
  ]),
  remove: css([
    baseButton,
    {
      backgroundColor: colors.cardBg,
      color: colors.red,
      padding: "0.5rem 0.75rem",
      fontSize: ".8rem",
      fontWeight: 500,
      "&:hover": {
        backgroundColor: colors.red,
        color: colors.cardBg,
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
