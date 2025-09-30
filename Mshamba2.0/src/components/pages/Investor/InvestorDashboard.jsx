// src/components/pages/Investor/InvestorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import { useNavigate } from "react-router-dom";
import '../..//Styles/InvestorDashboard.css';

const InvestorDashboard = () => {
  const { account } = useWallet();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock investor portfolio data
  const mockPortfolio = {
    totalInvested: 8500,
    currentValue: 10200,
    totalReturns: 1700,
    farmsInvested: 3,
    activeInvestments: 2,
    completedInvestments: 1
  };

  // Mock invested farms data
  const mockInvestedFarms = [
    {
      id: '1',
      name: 'Green Valley Organic Farm',
      region: 'Nairobi, Kenya',
      cropType: 'Vegetables & Fruits',
      investedAmount: 3000,
      currentValue: 3600,
      returns: 600,
      roi: '20%',
      investmentDate: '2024-01-15',
      status: 'active',
      progress: 65,
      expectedPayout: '2024-06-15',
      farmObjectId: '0xfarm123...'
    },
    {
      id: '2', 
      name: 'Mountain View Dairy',
      region: 'Nakuru, Kenya',
      cropType: 'Dairy',
      investedAmount: 4000,
      currentValue: 4800,
      returns: 800,
      roi: '20%',
      investmentDate: '2024-01-20',
      status: 'active',
      progress: 45,
      expectedPayout: '2024-07-20',
      farmObjectId: '0xfarm456...'
    },
    {
      id: '3',
      name: 'Sunrise Poultry Farm',
      region: 'Kiambu, Kenya',
      cropType: 'Poultry',
      investedAmount: 1500,
      currentValue: 1800,
      returns: 300,
      roi: '20%',
      investmentDate: '2023-11-10',
      status: 'completed',
      progress: 100,
      payoutDate: '2024-01-10',
      farmObjectId: '0xfarm789...'
    }
  ];

  useEffect(() => {
    // Simulate loading portfolio data
    const loadPortfolio = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPortfolio(mockPortfolio);
      setIsLoading(false);
    };

    loadPortfolio();
  }, []);

  const calculateTotalROI = () => {
    return ((mockPortfolio.totalReturns / mockPortfolio.totalInvested) * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your investment portfolio...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="dashboard-container">
        <div className="no-wallet">
          <h2>Connect Your Wallet</h2>
          <p>Connect your wallet to view your investment portfolio</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="investor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>My Investment Portfolio</h1>
          <p>Track your farm investments and returns</p>
        </div>
        <div className="wallet-info">
          <span className="wallet-address">
            {account.address.slice(0, 8)}...{account.address.slice(-4)}
          </span>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="portfolio-overview">
        <h2>📊 Portfolio Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Invested</h3>
              <div className="stat-value">${portfolio.totalInvested.toLocaleString()}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Current Value</h3>
              <div className="stat-value">${portfolio.currentValue.toLocaleString()}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Total Returns</h3>
              <div className="stat-value green">+${portfolio.totalReturns.toLocaleString()}</div>
              <div className="stat-percent">+{calculateTotalROI()}% ROI</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-content">
              <h3>Farms Invested</h3>
              <div className="stat-value">{portfolio.farmsInvested}</div>
              <div className="stat-detail">
                {portfolio.activeInvestments} active • {portfolio.completedInvestments} completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Actions */}
      <div className="investment-actions">
        <button 
          onClick={() => navigate('/home')}
          className="action-btn primary"
        >
          🌱 Explore More Farms
        </button>
        <button 
          onClick={() => navigate('/invest')}
          className="action-btn secondary"
        >
          👤 Update Investor Profile
        </button>
      </div>

      {/* Invested Farms List */}
      <div className="invested-farms">
        <h2>🏠 My Farm Investments</h2>
        
        <div className="farms-list">
          {mockInvestedFarms.map(farm => (
            <div key={farm.id} className="farm-investment-card">
              <div className="farm-header">
                <div className="farm-info">
                  <h3>{farm.name}</h3>
                  <p>📍 {farm.region} • 🌱 {farm.cropType}</p>
                </div>
                <div className={`investment-status ${farm.status}`}>
                  {farm.status === 'active' ? '🟢 Active' : '✅ Completed'}
                </div>
              </div>

              <div className="investment-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Invested Amount</span>
                    <span className="value">${farm.investedAmount.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Current Value</span>
                    <span className="value">${farm.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Returns</span>
                    <span className="value green">+${farm.returns.toLocaleString()}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">ROI</span>
                    <span className="value roi">{farm.roi}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Investment Date</span>
                    <span className="value">{farm.investmentDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">
                      {farm.status === 'active' ? 'Expected Payout' : 'Payout Date'}
                    </span>
                    <span className="value">
                      {farm.status === 'active' ? farm.expectedPayout : farm.payoutDate}
                    </span>
                  </div>
                </div>
              </div>

              {farm.status === 'active' && (
                <div className="investment-progress">
                  <div className="progress-header">
                    <span>Farm Progress</span>
                    <span>{farm.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${farm.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="farm-actions">
                <button className="view-details-btn">
                  📊 View Farm Details
                </button>
                {farm.status === 'active' && (
                  <button className="add-more-btn">
                    💰 Add More Investment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {mockInvestedFarms.length === 0 && (
          <div className="no-investments">
            <div className="empty-state">
              <div className="empty-icon">💸</div>
              <h3>No Investments Yet</h3>
              <p>Start building your portfolio by investing in farms</p>
              <button 
                onClick={() => navigate('/home')}
                className="explore-farms-btn"
              >
                Explore Farms
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>📋 Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <p><strong>Investment added</strong> to Mountain View Dairy</p>
              <span className="activity-date">Today, 14:30</span>
            </div>
            <div className="activity-amount green">+$1,000</div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🎯</div>
            <div className="activity-content">
              <p><strong>Returns received</strong> from Sunrise Poultry Farm</p>
              <span className="activity-date">Jan 10, 2024</span>
            </div>
            <div className="activity-amount green">+$300</div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🏠</div>
            <div className="activity-content">
              <p><strong>New investment</strong> in Green Valley Organic Farm</p>
              <span className="activity-date">Jan 15, 2024</span>
            </div>
            <div className="activity-amount">-$3,000</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;