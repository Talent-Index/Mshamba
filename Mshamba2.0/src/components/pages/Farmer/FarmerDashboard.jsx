// src/components/pages/Farmer/FarmerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useNavigate } from "react-router-dom";
import '../../Styles/FarmerDashboard.css';

const FarmerDashboard = () => {
  const { account, signAndExecuteTransactionBlock } = useWallet();
  const navigate = useNavigate();

  // Mock farm data - in real app, this would come from blockchain
  const [farm, setFarm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profitAmount, setProfitAmount] = useState('');
  const [platformAddress, setPlatformAddress] = useState('');

  // Mock investors data
  const mockInvestors = [
    { investor: '0x1234...5678', amount: 2000, date: '2024-01-15' },
    { investor: '0x8765...4321', amount: 3000, date: '2024-01-16' },
    { investor: '0xabcd...efgh', amount: 1500, date: '2024-01-17' },
    { investor: '0xijkl...mnop', amount: 2500, date: '2024-01-18' },
  ];

  useEffect(() => {
    // Simulate loading farm data
    const loadFarmData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFarm({
        id: '1',
        name: 'Green Valley Organic Farm',
        region: 'Nairobi, Kenya',
        cropType: 'Vegetables & Fruits',
        size: '50 acres',
        totalInvested: 9000,
        targetAmount: 50000,
        vaultBalance: 12000,
        isOpenForInvestment: false,
        investorsCount: mockInvestors.length,
        farmObjectId: '0x' + Math.random().toString(16).substr(2, 64),
      });
      setIsLoading(false);
    };

    loadFarmData();
  }, []);

  const launchInvestment = async () => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);
    try {
      // Real transaction to launch investment
      const tx = new TransactionBlock();
      const PACKAGE_ID = "0xdfdc1ba673e98f69704abbaac6377baa577b1c51b1f34809f9d573771267a6d3";
      
      // You would need the actual farm object ID here
      const farmObjectId = farm?.farmObjectId || "0xYOUR_FARM_OBJECT_ID";
      
      tx.moveCall({
        target: `${PACKAGE_ID}::farm::launch_investment`,
        arguments: [
          tx.object(farmObjectId),
        ],
      });

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      console.log("Investment launched:", result);
      setFarm(prev => ({ ...prev, isOpenForInvestment: true }));
      alert("✅ Investment period launched! Your farm is now open for investments.");

    } catch (err) {
      console.error("Launch investment failed:", err);
      
      // Fallback to demo mode
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFarm(prev => ({ ...prev, isOpenForInvestment: true }));
      alert("🎯 Demo: Investment period launched! Farm is now open for investments.");
    } finally {
      setIsLoading(false);
    }
  };

  const addProfit = async () => {
    if (!profitAmount || profitAmount <= 0) {
      alert("Please enter a valid profit amount");
      return;
    }

    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);
    try {
      // Real transaction to add profit
      const tx = new TransactionBlock();
      const PACKAGE_ID = "0xdfdc1ba673e98f69704abbaac6377baa577b1c51b1f34809f9d573771267a6d3";
      
      const farmObjectId = farm?.farmObjectId || "0xYOUR_FARM_OBJECT_ID";
      const amountMist = Math.floor(profitAmount * 1000000000);
      
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);
      
      tx.moveCall({
        target: `${PACKAGE_ID}::farm::add_profit`,
        arguments: [
          tx.object(farmObjectId),
          coin,
        ],
      });

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      console.log("Profit added:", result);
      setFarm(prev => ({ 
        ...prev, 
        vaultBalance: prev.vaultBalance + parseInt(profitAmount) 
      }));
      setProfitAmount('');
      alert(`✅ $${profitAmount} profit added to farm vault!`);

    } catch (err) {
      console.error("Add profit failed:", err);
      
      // Fallback to demo mode
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFarm(prev => ({ 
        ...prev, 
        vaultBalance: prev.vaultBalance + parseInt(profitAmount) 
      }));
      setProfitAmount('');
      alert(`🎯 Demo: $${profitAmount} profit added to farm vault!`);
    } finally {
      setIsLoading(false);
    }
  };

  const distributeProfits = async () => {
    if (!platformAddress) {
      alert("Please enter platform wallet address");
      return;
    }

    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);
    try {
      // Real transaction to distribute profits
      const tx = new TransactionBlock();
      const PACKAGE_ID = "0xdfdc1ba673e98f69704abbaac6377baa577b1c51b1f34809f9d573771267a6d3";
      
      const farmObjectId = farm?.farmObjectId || "0xYOUR_FARM_OBJECT_ID";
      
      tx.moveCall({
        target: `${PACKAGE_ID}::farm::distribute`,
        arguments: [
          tx.object(farmObjectId),
          tx.pure.address(platformAddress),
        ],
      });

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      console.log("Profits distributed:", result);
      setFarm(prev => ({ 
        ...prev, 
        vaultBalance: 0,
        totalInvested: 0,
        isOpenForInvestment: false 
      }));
      setPlatformAddress('');
      alert("✅ Profits distributed successfully! (60% Farmer, 10% Platform, 30% Investors)");

    } catch (err) {
      console.error("Distribute profits failed:", err);
      
      // Fallback to demo mode
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFarm(prev => ({ 
        ...prev, 
        vaultBalance: 0,
        totalInvested: 0,
        isOpenForInvestment: false 
      }));
      setPlatformAddress('');
      alert("🎯 Demo: Profits distributed! (60% Farmer, 10% Platform, 30% Investors)");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !farm) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your farm dashboard...</p>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="dashboard-container">
        <div className="no-farm">
          <h2>No Farm Found</h2>
          <p>You haven't registered a farm yet.</p>
          <button onClick={() => navigate('/farm-register')} className="create-farm-btn">
            🚜 Create Your First Farm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="farm-info">
          <h1>{farm.name}</h1>
          <p>📍 {farm.region} • 🌱 {farm.cropType} • 📏 {farm.size}</p>
          <div className="farm-id">
            Farm ID: {farm.farmObjectId}
          </div>
        </div>
        <div className="investment-status">
          <div className={`status-badge ${farm.isOpenForInvestment ? 'open' : 'closed'}`}>
            {farm.isOpenForInvestment ? '🟢 Open for Investment' : '🔴 Closed for Investment'}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Invested</h3>
          <div className="stat-value">${farm.totalInvested.toLocaleString()}</div>
          <div className="stat-target">Target: ${farm.targetAmount.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h3>Vault Balance</h3>
          <div className="stat-value">${farm.vaultBalance.toLocaleString()}</div>
          <div className="stat-label">Available for distribution</div>
        </div>
        <div className="stat-card">
          <h3>Active Investors</h3>
          <div className="stat-value">{farm.investorsCount}</div>
          <div className="stat-label">Supporting your farm</div>
        </div>
        <div className="stat-card">
          <h3>Funding Progress</h3>
          <div className="stat-value">{((farm.totalInvested / farm.targetAmount) * 100).toFixed(1)}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(farm.totalInvested / farm.targetAmount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Left Column - Farm Management */}
        <div className="management-section">
          <h2>Farm Management</h2>
          
          {/* Launch Investment */}
          <div className="action-card">
            <h3>🚀 Launch Investment Period</h3>
            <p>Open your farm for investors to start funding</p>
            <button 
              onClick={launchInvestment}
              disabled={isLoading || farm.isOpenForInvestment}
              className="action-btn primary"
            >
              {isLoading ? 'Processing...' : 
               farm.isOpenForInvestment ? 'Already Launched' : 'Launch Investment'}
            </button>
          </div>

          {/* Add Profit */}
          <div className="action-card">
            <h3>💰 Add Profit to Vault</h3>
            <p>Add profits to be distributed to investors</p>
            <div className="input-group">
              <input
                type="number"
                placeholder="Profit amount in SUI"
                value={profitAmount}
                onChange={(e) => setProfitAmount(e.target.value)}
                disabled={isLoading}
                min="1"
              />
              <button 
                onClick={addProfit}
                disabled={isLoading || !profitAmount}
                className="action-btn secondary"
              >
                {isLoading ? 'Adding...' : 'Add Profit'}
              </button>
            </div>
          </div>

          {/* Distribute Profits */}
          <div className="action-card">
            <h3>📊 Distribute Profits</h3>
            <p>Distribute vault balance (60% Farmer, 10% Platform, 30% Investors)</p>
            <div className="input-group">
              <input
                type="text"
                placeholder="Platform wallet address"
                value={platformAddress}
                onChange={(e) => setPlatformAddress(e.target.value)}
                disabled={isLoading}
              />
              <button 
                onClick={distributeProfits}
                disabled={isLoading || !platformAddress || farm.vaultBalance === 0}
                className="action-btn warning"
              >
                {isLoading ? 'Distributing...' : 'Distribute Profits'}
              </button>
            </div>
            <div className="distribution-breakdown">
              <p><strong>Distribution:</strong> Farmer 60% • Platform 10% • Investors 30%</p>
            </div>
          </div>
        </div>

        {/* Right Column - Investors List */}
        <div className="investors-section">
          <h2>📈 Current Investors</h2>
          <div className="investors-list">
            {mockInvestors.map((investor, index) => (
              <div key={index} className="investor-card">
                <div className="investor-info">
                  <div className="investor-address">{investor.investor}</div>
                  <div className="investment-details">
                    <span className="amount">${investor.amount.toLocaleString()}</span>
                    <span className="date">{investor.date}</span>
                  </div>
                </div>
                <div className="share-percentage">
                  {((investor.amount / farm.totalInvested) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
          
          {mockInvestors.length === 0 && (
            <div className="no-investors">
              <p>No investors yet. Launch investment period to start receiving investments.</p>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Connection */}
      {!account && (
        <div className="wallet-prompt">
          <p>Connect your wallet to manage your farm</p>
          <ConnectButton />
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;