import { injectGlobal } from "@emotion/css";

injectGlobal`
  html, body, div {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    }
    body {
      font-family: sans-serif;
      font-size: 16px;
      font-weight: normal;
  }
`;
