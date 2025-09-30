import React, { useState } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import "../../Styles/form.css";
import { useNavigate } from "react-router-dom";

const FarmReg = () => {
  const { account, signAndExecuteTransactionBlock } = useWallet();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    region: "",
    crop: "",
    size: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);

    try {
      // Build transaction to call Move function
      const tx = new TransactionBlock();
      
      // Use your actual package ID from the transaction
      const PACKAGE_ID = "0xdfdc1ba673e98f69704abbaac6377baa577b1c51b1f34809f9d573771267a6d3";
      
      tx.moveCall({
        target: `${PACKAGE_ID}::farm::create_farm`,
        arguments: [
          // No arguments needed - contract uses sender from context
        ],
      });

      console.log("Sending transaction...");

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      console.log("Farm created successfully:", result);

      // Get the created farm object ID from the transaction result
      const createdObject = result.objectChanges?.find(
        change => change.type === 'created' && change.objectType.includes('farm::Farm')
      );

      const farmObjectId = createdObject?.objectId;

      // Store off-chain metadata (you might want to save this to a database)
      const farmMetadata = {
        ...formData,
        walletAddress: account.address,
        farmObjectId: farmObjectId,
        transactionDigest: result.digest,
        createdAt: new Date().toISOString(),
      };

      console.log("Farm metadata:", farmMetadata);

      alert(
        "🎉 Farm registered successfully on-chain!\n\n" +
        `Farm Name: ${formData.name}\n` +
        `Farm Object ID: ${farmObjectId || 'N/A'}\n` +
        `Transaction: ${result.digest}\n` +
        `Owner: ${account.address.slice(0, 8)}...${account.address.slice(-6)}`
      );
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        contact: "",
        region: "",
        crop: "",
        size: "",
      });
      
      // Navigate to farmer dashboard or home
      navigate("/farmer-dashboard");

    } catch (err) {
      console.error("Farm creation failed:", err);
      
      // Handle specific error types
      if (err.message?.includes("User rejection") || err.message?.includes("-4005")) {
        alert(
          "❌ Transaction Rejected\n\n" +
          "You rejected the transaction in your wallet.\n\n" +
          "If you want to proceed, please:\n" +
          "1. Click 'Register Farm' again\n" +
          "2. Approve the transaction in your wallet popup\n" +
          "3. Wait for confirmation"
        );
      } else if (err.message?.includes("packageID") || err.message?.includes("package")) {
        alert(
          "🔧 Network Issue\n\n" +
          "Package not found on current network.\n\n" +
          "Using demo mode instead..."
        );
        
        // Fallback to demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockFarmObjectId = "0x" + Math.random().toString(16).substr(2, 64);
        const mockTransactionDigest = "0x" + Math.random().toString(16).substr(2, 64);
        
        alert(
          "🎉 Farm Registered Successfully! (Demo Mode)\n\n" +
          `Farm: ${formData.name}\n` +
          `Region: ${formData.region}\n` +
          `Crop: ${formData.crop}\n` +
          `Demo Farm ID: ${mockFarmObjectId}\n` +
          `Demo Transaction: ${mockTransactionDigest}\n\n` +
          "💰 No gas fees used - This is a simulation"
        );
        
        setFormData({
          name: "", email: "", contact: "", region: "", crop: "", size: "",
        });
        
        navigate("/farmer-dashboard");
      } else {
        alert(
          "❌ Transaction Failed\n\n" +
          "Error: " + (err.message || "Unknown error occurred") + "\n\n" +
          "Please check:\n" +
          "• Your wallet connection\n" +
          "• Sufficient gas balance\n" +
          "• Network compatibility"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Farm Registration</h2>
      <p className="form-subtitle">
        Register your farm on the blockchain to start accepting investments
      </p>

      <div className="transaction-guide">
        <h4>📝 Transaction Guide:</h4>
        <ul>
          <li>1. Fill out the farm details below</li>
          <li>2. Click "Register Farm"</li>
          <li>3. <strong>Approve the transaction</strong> in your wallet popup</li>
          <li>4. Wait for confirmation</li>
        </ul>
        <p className="note">
          💡 <strong>Note:</strong> You need to approve the transaction when your wallet asks for permission.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <input
            type="text"
            name="name"
            placeholder="Farm Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="text"
            name="region"
            placeholder="Region/Location"
            value={formData.region}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="text"
            name="crop"
            placeholder="Primary Crop/Livestock"
            value={formData.crop}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
          <input
            type="number"
            name="size"
            placeholder="Farm Size (acres)"
            value={formData.size}
            onChange={handleChange}
            required
            disabled={isLoading}
            min="1"
          />

          <div className="wallet-section">
            <ConnectButton />
            {account && (
              <p className="wallet-address">
                ✅ Connected: {account.address.slice(0, 8)}...{account.address.slice(-6)}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading || !account}
          >
            {isLoading ? "⏳ Awaiting Wallet Approval..." : "🚜 Register Farm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmReg;