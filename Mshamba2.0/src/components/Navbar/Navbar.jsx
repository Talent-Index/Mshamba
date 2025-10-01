// src/components/Navbar/Navbar.jsx
import React from 'react';
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { account } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo and Brand */}
        <div className="nav-brand" onClick={() => navigate('/')}>
          <div className="logo">🌱</div>
          <span className="brand-name">Mshamba</span>
        </div>

        {/* Navigation Links - Center */}
        <div className="nav-links">
          <button 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${isActive('/home') ? 'active' : ''}`}
            onClick={() => navigate('/home')}
          >
            Explore Farms
          </button>
          <button 
            className={`nav-link ${isActive('/farm-register') ? 'active' : ''}`}
            onClick={() => navigate('/farm-register')}
          >
            Create Farm
          </button>
          <button 
            className={`nav-link ${isActive('/invest') ? 'active' : ''}`}
            onClick={() => navigate('/invest')}
          >
            Become Investor
          </button>
          
<button 
  className={`nav-link ${isActive('/investor-dashboard') ? 'active' : ''}`}
  onClick={() => navigate('/investor-dashboard')}
>
  My Portfolio
</button>
        </div>

        {/* Wallet Connection - Right */}
        <div className="nav-wallet">
          <ConnectButton />
          {account && (
            <div className="wallet-info">
              <span className="wallet-address">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;