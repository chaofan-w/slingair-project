import * as React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReservationContextProvider } from "./ReservationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReservationContextProvider>
      <App />
    </ReservationContextProvider>
  </React.StrictMode>
);
