import { css } from "@emotion/css";

export const colors = {
  white: "#fff",
  black: "#000",
  background: "#6164eb",
  wrapper: "#fff",
  roomCode: "rgb(246, 70, 152)",
  button: "#febf22",
  sus: "rgb(253, 88, 28)",
};

export const appGlobal = css({
  fontFamily: `'Lexend Mega', sans-serif`,
  backgroundColor: colors.background,
  color: colors.black,
  userSelect: "none",
  margin: 0,
  padding: 0,
  minHeight: "100vh",
  width: "100vw",
  boxSizing: "border-box",
  overflowX: "hidden",
});

// Main container
export const container = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  margin: "0 auto",
});

// Wrapper for lists/sections
export const wrapper = css({
  backgroundColor: colors.wrapper,
  boxShadow: `0.2rem 0.2rem 0 ${colors.black}`,
  border: `solid 0.12rem ${colors.black}`,
  borderRadius: "0.5rem",
  display: "flex",
  flexDirection: "column",
  maxWidth: "40rem",
  minWidth: "fit-content",
});

// App title
export const title = css({
  fontFamily: `'Lexend Mega', sans-serif`,
  fontWeight: 900,
  fontSize: "3rem",
  letterSpacing: "-2px",
  color: colors.black,
  textAlign: "center",
  lineHeight: 1,
  marginBottom: "1rem",
});

// Main button
export const button = css({
  cursor: "pointer",
  display: "inline-block",
  padding: "0.8rem 1.2rem",
  backgroundColor: colors.button,
  color: colors.black,
  fontFamily: `'Lexend Mega', sans-serif`,
  fontWeight: 600,
  fontSize: "1rem",
  textAlign: "center",
  borderRadius: "0.5rem",
  boxShadow: `0.2rem 0.2rem 0 ${colors.black}`,
  border: `solid 0.12rem ${colors.black}`,
  margin: "0.5rem 0",
  transition:
    "color 0.05s, background-color 0.05s, box-shadow 0.05s ease, transform 0.05s ease",
});

// Room code badge
export const roomCode = css({
  backgroundColor: colors.roomCode,
  color: colors.white,
  padding: "0.3rem 1rem",
  borderRadius: "0.5rem",
  fontWeight: 700,
  marginLeft: "0.5rem",
  boxShadow: `0.1rem 0.1rem 0 ${colors.black}`,
});

// Error message
export const errorMessage = css({
  backgroundColor: colors.sus,
  color: colors.white,
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  fontWeight: 700,
  marginTop: "1rem",
  boxShadow: `0.1rem 0.1rem 0 ${colors.black}`,
});

// Player list
export const playerList = css({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

// Player item
export const playerItem = css({
  backgroundColor: colors.button,
  color: colors.black,
  padding: "0.5rem 1rem",
  borderRadius: "0.4rem",
  fontWeight: 600,
  boxShadow: `0.1rem 0.1rem 0 ${colors.black}`,
  border: `solid 0.08rem ${colors.black}`,
});
