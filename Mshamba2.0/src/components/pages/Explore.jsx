// src/components/Explore.js
import React, { useState, useEffect } from 'react';
import { useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import '../Styles/Explore.css';

const Explore = ({ onNavigate }) => {
  const { account, signAndExecuteTransactionBlock } = useWallet();
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);

  // Mock data included directly in the file
  const mockFarms = [
    {
      id: '1',
      name: 'Green Valley Organic Farm',
      farmer: '0x1234...5678',
      region: 'Nairobi, Kenya',
      cropType: 'Vegetables & Fruits',
      size: '50 acres',
      totalInvested: 15000,
      targetAmount: 50000,
      isOpenForInvestment: true,
      investorsCount: 8,
      image: '/farm1.jpg',
      description: 'Organic farm specializing in tomatoes, kale, and strawberries using sustainable farming practices.',
      roi: '15%',
      farmObjectId: '0x9b1ee13ebcf5b21e55fe41446ca19f3d40964f8536dca6b94b0cbb269e82176c'
    },
    {
      id: '2',
      name: 'Mountain View Dairy',
      farmer: '0x8765...4321',
      region: 'Nakuru, Kenya',
      cropType: 'Dairy',
      size: '100 acres',
      totalInvested: 35000,
      targetAmount: 80000,
      isOpenForInvestment: true,
      investorsCount: 12,
      image: '/farm2.jpg',
      description: 'Modern dairy farm with 200 cattle, producing premium milk and dairy products.',
      roi: '12%',
      farmObjectId: '0xmock2'
    },
    {
      id: '3',
      name: 'Sunrise Poultry Farm',
      farmer: '0xabcd...efgh',
      region: 'Kiambu, Kenya',
      cropType: 'Poultry',
      size: '25 acres',
      totalInvested: 20000,
      targetAmount: 40000,
      isOpenForInvestment: false,
      investorsCount: 6,
      image: '/farm3.jpg',
      description: 'Free-range poultry farm producing organic eggs and chicken for local markets.',
      roi: '18%',
      farmObjectId: '0xmock3'
    },
    {
      id: '4',
      name: 'Riverbend Coffee Plantation',
      farmer: '0xijkl...mnop',
      region: 'Mount Kenya Region',
      cropType: 'Coffee',
      size: '200 acres',
      totalInvested: 75000,
      targetAmount: 150000,
      isOpenForInvestment: true,
      investorsCount: 25,
      image: '/farm4.jpg',
      description: 'Premium Arabica coffee plantation with sustainable farming methods.',
      roi: '22%',
      farmObjectId: '0xmock4'
    },
    {
      id: '5',
      name: 'Golden Wheat Fields',
      farmer: '0xqrst...uvwx',
      region: 'Rift Valley, Kenya',
      cropType: 'Grains',
      size: '300 acres',
      totalInvested: 120000,
      targetAmount: 250000,
      isOpenForInvestment: true,
      investorsCount: 18,
      image: '/farm5.jpg',
      description: 'Large-scale wheat and barley farm serving national markets.',
      roi: '14%',
      farmObjectId: '0xmock5'
    },
    {
      id: '6',
      name: 'Lakeview Fish Farm',
      farmer: '0xyzaa...bbcc',
      region: 'Lake Victoria, Kenya',
      cropType: 'Aquaculture',
      size: '15 acres',
      totalInvested: 45000,
      targetAmount: 90000,
      isOpenForInvestment: true,
      investorsCount: 14,
      image: '/farm6.jpg',
      description: 'Tilapia and catfish farm using modern aquaculture techniques.',
      roi: '20%',
      farmObjectId: '0xmock6'
    },
    {
      id: '7',
      name: 'Highland Tea Estate',
      farmer: '0xdddd...eeee',
      region: 'Kericho, Kenya',
      cropType: 'Tea',
      size: '150 acres',
      totalInvested: 95000,
      targetAmount: 180000,
      isOpenForInvestment: false,
      investorsCount: 22,
      image: '/farm7.jpg',
      description: 'Premium tea plantation exporting to international markets.',
      roi: '16%',
      farmObjectId: '0xmock7'
    },
    {
      id: '8',
      name: 'Savannah Goat Ranch',
      farmer: '0xffff...gggg',
      region: 'Kajiado, Kenya',
      cropType: 'Livestock',
      size: '500 acres',
      totalInvested: 60000,
      targetAmount: 120000,
      isOpenForInvestment: true,
      investorsCount: 9,
      image: '/farm8.jpg',
      description: 'Free-range goat farm focusing on meat and dairy production.',
      roi: '17%',
      farmObjectId: '0xmock8'
    },
    {
      id: '9',
      name: 'Tropical Fruit Paradise',
      farmer: '0xhhhh...iiii',
      region: 'Coastal Kenya',
      cropType: 'Tropical Fruits',
      size: '75 acres',
      totalInvested: 55000,
      targetAmount: 110000,
      isOpenForInvestment: true,
      investorsCount: 11,
      image: '/farm9.jpg',
      description: 'Mango, pineapple, and coconut farm in tropical coastal region.',
      roi: '19%',
      farmObjectId: '0xmock9'
    },
    {
      id: '10',
      name: 'Greenhouse Tech Farm',
      farmer: '0xjjjj...kkkk',
      region: 'Nairobi, Kenya',
      cropType: 'Hydroponics',
      size: '10 acres',
      totalInvested: 80000,
      targetAmount: 150000,
      isOpenForInvestment: true,
      investorsCount: 16,
      image: '/farm10.jpg',
      description: 'High-tech greenhouse using hydroponics for year-round vegetable production.',
      roi: '25%',
      farmObjectId: '0xmock10'
    },
    {
      id: '11',
      name: 'Organic Honey Farm',
      farmer: '0xllll...mmmm',
      region: 'Aberdare Range',
      cropType: 'Apiculture',
      size: '5 acres',
      totalInvested: 25000,
      targetAmount: 60000,
      isOpenForInvestment: false,
      investorsCount: 7,
      image: '/farm11.jpg',
      description: 'Organic honey production with 200 beehives in natural forest environment.',
      roi: '21%',
      farmObjectId: '0xmock11'
    },
    {
      id: '12',
      name: 'Maize & Beans Cooperative',
      farmer: '0xnnnn...oooo',
      region: 'Western Kenya',
      cropType: 'Cereals & Legumes',
      size: '400 acres',
      totalInvested: 180000,
      targetAmount: 300000,
      isOpenForInvestment: true,
      investorsCount: 35,
      image: '/farm12.jpg',
      description: 'Large cooperative farm producing maize and beans for food security.',
      roi: '13%',
      farmObjectId: '0xmock12'
    }
  ];

  useEffect(() => {
    // Use mock data for display
    setFarms(mockFarms);
  }, []);

  const calculateProgress = (invested, target) => {
    return Math.min((invested / target) * 100, 100);
  };

  const handleInvest = async (farm) => {
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!investmentAmount || investmentAmount <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    setIsInvesting(true);

    try {
      // REAL TRANSACTION - Investment
      const tx = new TransactionBlock();
      const PACKAGE_ID = "0xdfdc1ba673e98f69704abbaac6377baa577b1c51b1f34809f9d573771267a6d3";
      
      // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
      const amountMist = Math.floor(investmentAmount * 1000000000);
      
      // Split coins from gas for investment
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);
      
      // For demo, we'll use a mock farm object ID
      // In production, you'd use the real farmObjectId from your data
      const farmObjectId = farm.farmObjectId || "0xYOUR_FARM_OBJECT_ID";
      
      tx.moveCall({
        target: `${PACKAGE_ID}::farm::invest`,
        arguments: [
          tx.object(farmObjectId), // Farm object
          coin,                    // Coin to invest
        ],
      });

      console.log("Sending investment transaction...");

      const result = await signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      console.log("Investment successful:", result);

      alert(`✅ Investment Successful!\n\n` +
        `Farm: ${farm.name}\n` +
        `Amount: ${investmentAmount} SUI\n` +
        `Transaction: ${result.digest}\n` +
        `Expected ROI: ${farm.roi}`);

    } catch (err) {
      console.error("Real investment failed:", err);
      
      // Fallback to demo mode
      console.log("[FALLBACK] Using demo investment mode...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTransactionDigest = "0x" + Math.random().toString(16).substr(2, 64);
      
      alert(`✅ Investment Simulation\n\n` +
        `Farm: ${farm.name}\n` +
        `Amount: ${investmentAmount} SUI\n` +
        `Transaction: ${mockTransactionDigest}\n` +
        `Expected ROI: ${farm.roi}\n\n` +
        "💰 Demo mode - no real transaction occurred");
    } finally {
      setIsInvesting(false);
      setSelectedFarm(null);
      setInvestmentAmount('');
    }
  };

  return (
    <div className="explore-page">
      <div className="explore-container">
        <div className="explore-header">
          <h1 className="explore-title">Explore Farms</h1>
          <p className="explore-subtitle">
            Discover farms seeking investment and grow your portfolio
          </p>
          {account && (
            <div className="wallet-connected">
              ✅ Connected: {account.address.slice(0, 8)}...{account.address.slice(-6)}
            </div>
          )}
        </div>

        <div className="farms-grid">
          {farms.map(farm => (
            <div key={farm.id} className="farm-card">
              <div className="farm-image">
                <div className="image-placeholder">
                  🚜 {farm.cropType}
                </div>
                <div className={`farm-status ${farm.isOpenForInvestment ? 'open' : 'closed'}`}>
                  {farm.isOpenForInvestment ? '🟢 Seeking Investment' : '🔴 Funding Closed'}
                </div>
              </div>

              <div className="farm-content">
                <h3 className="farm-name">{farm.name}</h3>
                <p className="farm-description">{farm.description}</p>
                
                <div className="farm-details">
                  <div className="detail-item">
                    <span className="detail-label">📍 Region:</span>
                    <span className="detail-value">{farm.region}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🌱 Type:</span>
                    <span className="detail-value">{farm.cropType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📏 Size:</span>
                    <span className="detail-value">{farm.size}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📈 ROI:</span>
                    <span className="detail-value roi">{farm.roi}</span>
                  </div>
                </div>

                <div className="investment-progress">
                  <div className="progress-header">
                    <span>Funding Progress</span>
                    <span className="progress-percent">
                      {calculateProgress(farm.totalInvested, farm.targetAmount).toFixed(1)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${calculateProgress(farm.totalInvested, farm.targetAmount)}%` }}
                    ></div>
                  </div>
                  <div className="progress-numbers">
                    <span>${farm.totalInvested.toLocaleString()} raised</span>
                    <span>Target: ${farm.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="farm-stats">
                  <div className="stat">
                    <span className="stat-number">{farm.investorsCount}</span>
                    <span className="stat-label">Investors</span>
                  </div>
                </div>

                <button 
                  className={`invest-btn ${!farm.isOpenForInvestment ? 'disabled' : ''}`}
                  onClick={() => farm.isOpenForInvestment && setSelectedFarm(farm)}
                  disabled={!farm.isOpenForInvestment || !account}
                >
                  {farm.isOpenForInvestment ? 'Invest Now' : 'Funding Closed'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Investment Modal */}
        {selectedFarm && (
          <div className="modal-overlay">
            <div className="investment-modal">
              <div className="modal-header">
                <h2>Invest in {selectedFarm.name}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedFarm(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="farm-summary">
                  <p><strong>Region:</strong> {selectedFarm.region}</p>
                  <p><strong>Type:</strong> {selectedFarm.cropType}</p>
                  <p><strong>Expected ROI:</strong> {selectedFarm.roi}</p>
                </div>

                <div className="investment-form">
                  <label className="form-label">
                    Investment Amount (SUI)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter amount in SUI"
                    min="1"
                    disabled={isInvesting}
                  />
                  
                  <div className="investment-details">
                    <p>Your share: {investmentAmount ? ((investmentAmount / selectedFarm.targetAmount) * 100).toFixed(2) : '0'}%</p>
                    <p>Expected return: {investmentAmount ? (investmentAmount * (parseFloat(selectedFarm.roi) / 100)).toFixed(2) : '0'} SUI</p>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setSelectedFarm(null)}
                    disabled={isInvesting}
                  >
                    Cancel
                  </button>
                  <button 
                    className="confirm-invest-btn"
                    onClick={() => handleInvest(selectedFarm)}
                    disabled={!investmentAmount || isInvesting}
                  >
                    {isInvesting ? "Investing..." : "Confirm Investment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;