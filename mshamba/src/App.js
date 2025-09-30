import React from "react";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";

function App() {
  const wallet = useWallet();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🌱 Shambat Platform</h2>
      <p>Connect your wallet to continue.</p>

      {/* Wallet connect button */}
      <ConnectButton />

      {wallet.connected && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Connected Address:</strong></p>
          <p>{wallet.account?.address}</p>
        </div>
      )}
    </div>
  );
}

export default App;
