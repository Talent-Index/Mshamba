import React, { useState } from 'react';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from '../constants';
import './CreateFarmPage.css';

const CreateFarmPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateFarm = async () => {
    if (!currentAccount) {
      alert("Please connect your wallet to create a farm.");
      return;
    }
    if (!PACKAGE_ID || PACKAGE_ID === "YOUR_PACKAGE_ID_HERE") {
      alert("Please replace YOUR_PACKAGE_ID_HERE in src/constants.ts with your actual package ID.");
      return;
    }

    setIsCreating(true);
    const txb = new Transaction();

    txb.moveCall({
      target: `${PACKAGE_ID}::farm::create_farm`,
      arguments: [],
    });

    signAndExecute(
      {
        transaction: txb,
      },
      {
        onSuccess: (result) => {
          console.log("Create farm successful:", result);
          alert("Farm created successfully!");
          setIsCreating(false);
          // Optionally, navigate to the new farm's details page or farm list
        },
        onError: (err) => {
          console.error("Create farm failed:", err);
          alert(`Failed to create farm: ${err.message}`);
          setIsCreating(false);
        },
      },
    );
  };

  return (
    <div className="create-farm-container">
      <h2>Create New Farm</h2>
      <p>Click the button below to create your new Tokeni Kwa Shamba Farm.</p>
      <button onClick={handleCreateFarm} disabled={!currentAccount || isCreating}>
        {isCreating ? "Creating..." : "Create Farm"}
      </button>
      {!currentAccount && <p className="connect-wallet-message">Connect your wallet to create a farm.</p>}
    </div>
  );
};

export default CreateFarmPage;