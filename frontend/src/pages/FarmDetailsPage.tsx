import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from '../constants';
import './FarmDetailsPage.css';

interface FarmObjectData {
  objectId: string;
  version: string;
  digest: string;
  content: {
    dataType: string;
    type: string;
    hasPublicTransfer: boolean;
    fields: {
      id: { id: string };
      farmer: string;
      investors: Array<{ fields: { investor: string; amount: string } }>;
      total_invested: string;
      vault: { fields: { balance: string } };
    };
  };
}

const FarmDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const [investAmount, setInvestAmount] = useState('');
  const [profitAmount, setProfitAmount] = useState('');
  const [platformAddress, setPlatformAddress] = useState('0x0'); // Placeholder for platform address

  const { data: farm, isLoading, error, refetch } = useQuery<FarmObjectData>({
    queryKey: ['farm', id],
    queryFn: async () => {
      if (!id) throw new Error("Farm ID is missing.");
      if (!PACKAGE_ID || PACKAGE_ID === "YOUR_PACKAGE_ID_HERE") {
        throw new Error("Please replace YOUR_PACKAGE_ID_HERE in src/constants.ts with your actual package ID.");
      }

      const response = await suiClient.getObject({
        id,
        options: { showContent: true },
      });

      if (response.data?.content?.dataType === 'moveObject' && response.data.content.type === `${PACKAGE_ID}::farm::Farm`) {
        return response.data as FarmObjectData;
      }
      throw new Error("Farm not found or invalid object type.");
    },
    enabled: !!id, // Only run query if id is available
    refetchInterval: 5000,
  });

  const handleInvest = async () => {
    if (!currentAccount || !farm) return;
    if (parseFloat(investAmount) <= 0) {
      alert("Please enter a valid amount to invest.");
      return;
    }

    const txb = new Transaction();

    txb.moveCall({
      target: `${PACKAGE_ID}::farm::invest`,
      arguments: [
        txb.object(farm.objectId),
        coin,
      ],
    });

    signAndExecute(
      {
        transaction: txb,
      },
      {
        onSuccess: (result) => {
          console.log("Invest successful:", result);
          alert("Investment successful!");
          setInvestAmount('');
          refetch(); // Refetch farm data to update UI
        },
        onError: (err) => {
          console.error("Invest failed:", err);
          alert(`Investment failed: ${err.message}`);
        },
      },
    );
  };

  const handleAddProfit = async () => {
    if (!currentAccount || !farm) return;
    if (currentAccount.address !== farm.content.fields.farmer) {
      alert("Only the farmer can add profit.");
      return;
    }
    if (parseFloat(profitAmount) <= 0) {
      alert("Please enter a valid amount to add as profit.");
      return;
    }

    const txb = new Transaction();

    txb.moveCall({
      target: `${PACKAGE_ID}::farm::add_profit`,
      arguments: [
        txb.object(farm.objectId),
        coin,
      ],
    });

    signAndExecute(
      {
        transaction: txb,
      },
      {
        onSuccess: (result) => {
          console.log("Add profit successful:", result);
          alert("Profit added successfully!");
          setProfitAmount('');
          refetch(); // Refetch farm data to update UI
        },
        onError: (err) => {
          console.error("Add profit failed:", err);
          alert(`Add profit failed: ${err.message}`);
        },
      },
    );
  };

  const handleDistribute = async () => {
    if (!currentAccount || !farm) return;
    if (currentAccount.address !== farm.content.fields.farmer) {
      alert("Only the farmer can distribute profits.");
      return;
    }
    if (farm.content.fields.investors.length === 0) {
      alert("No investors to distribute to.");
      return;
    }
    if (parseInt(farm.content.fields.vault.fields.balance) === 0) {
      alert("No balance in vault to distribute.");
      return;
    }
    if (platformAddress === '0x0') {
      alert("Please set a valid platform address.");
      return;
    }

    const txb = new Transaction();

    txb.moveCall({
      target: `${PACKAGE_ID}::farm::distribute`,
      arguments: [
        txb.object(farm.objectId),
        txb.pure(platformAddress),
      ],
    });

    signAndExecute(
      {
        transaction: txb,
      },
      {
        onSuccess: (result) => {
          console.log("Distribute successful:", result);
          alert("Profits distributed successfully!");
          refetch(); // Refetch farm data to update UI
        },
        onError: (err) => {
          console.error("Distribute failed:", err);
          alert(`Distribute failed: ${err.message}`);
        },
      },
    );
  };

  if (isLoading) return <div className="message">Loading farm details...</div>;
  if (error) return <div className="message error-message">Error loading farm: {error.message}</div>;
  if (!farm) return <div className="message">Farm not found.</div>;

  return (
    <div className="farm-details-container">
      <h2>Farm Details: {farm.objectId}</h2>
      <p><strong>Farmer:</strong> {farm.content.fields.farmer}</p>
      <p><strong>Total Invested:</strong> {parseInt(farm.content.fields.total_invested) / 1_000_000_000} SUI</p>
      <p><strong>Vault Balance:</strong> {parseInt(farm.content.fields.vault.fields.balance) / 1_000_000_000} SUI</p>

      <h3>Investors:</h3>
      {farm.content.fields.investors.length > 0 ? (
        <ul>
          {farm.content.fields.investors.map((investor, index) => (
            <li key={index}>
              {investor.fields.investor}: {parseInt(investor.fields.amount) / 1_000_000_000} SUI
            </li>
          ))}
        </ul>
      ) : (
        <p>No investors yet.</p>
      )}

      <h3>Invest in this Farm</h3>
      <input
        type="number"
        value={investAmount}
        onChange={(e) => setInvestAmount(e.target.value)}
        placeholder="Amount in SUI"
      />
      <button onClick={handleInvest} disabled={!currentAccount}>Invest</button>
      {!currentAccount && <p>Connect wallet to invest.</p>}

      {currentAccount && currentAccount.address === farm.content.fields.farmer && (
        <>
          <h3>Add Profit to this Farm</h3>
          <input
            type="number"
            value={profitAmount}
            onChange={(e) => setProfitAmount(e.target.value)}
            placeholder="Amount in SUI"
          />
          <button onClick={handleAddProfit}>Add Profit</button>

          <h3>Distribute Profits</h3>
          <input
            type="text"
            value={platformAddress}
            onChange={(e) => setPlatformAddress(e.target.value)}
            placeholder="Platform Address (e.g., 0x...)"
          />
          <button onClick={handleDistribute}>Distribute</button>
        </>
      )}
    </div>
  );
};

export default FarmDetailsPage;
