import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";  // important for default button styling

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WalletProvider>
    <App />
  </WalletProvider>
);
