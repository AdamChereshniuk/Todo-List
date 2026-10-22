import reportWebVitals from "./reportWebVitals";
import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { NhostProvider } from "react-nhost";
import { nhostClient } from "./nhost/nhostClient";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <NhostProvider nhostClient={nhostClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NhostProvider>
  </React.StrictMode>
);

reportWebVitals();