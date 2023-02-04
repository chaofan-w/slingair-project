import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReservationContextProvider } from "./ReservationContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./MuiTheme";
import { CssBaseline } from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReservationContextProvider>
        <App />
      </ReservationContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
