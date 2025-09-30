import React, { useEffect } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import { useNavigate } from "react-router-dom";
import "../../Styles/form.css";

const Invest = () => {
  const { account } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      alert(`Wallet connected: ${account.address}`);
      navigate("/home"); // redirect to home
    }
  }, [account, navigate]);

  return (
    <div className="form-container">
      <h2 className="form-title">Investor Registration</h2>

      <div className="form-box">
        <p className="form-description">
          Join <span className="highlight">Shambat</span> as an investor and
          support farmers directly.  
          By linking your wallet, you’ll gain access to farms open for
          investment and share in their profits during distributions.
        </p>

        <div className="wallet-section">
          <ConnectButton />
          {account && (
            <p className="wallet-address">
              ✅ Connected: <span>{account.address}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invest;
