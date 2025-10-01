// src/components/Navbar/Navbar.jsx
import React, { useState } from "react";
import { useWallet, ConnectButton } from "@suiet/wallet-kit";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../assets/token.jpg";

const Navbar = () => {
  const { account } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo and Brand */}
        <div className="nav-brand" onClick={() => handleNavClick("/")}>
          <div className="logo">
            <img src={Logo} alt="Mshamba Logo" />
          </div>
          <span className="brand-name">Mshamba</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <button
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => handleNavClick("/")}
          >
            Home
          </button>
          <button
            className={`nav-link ${isActive("/home") ? "active" : ""}`}
            onClick={() => handleNavClick("/home")}
          >
            Explore Farms
          </button>
          <button
            className={`nav-link ${isActive("/farm-register") ? "active" : ""}`}
            onClick={() => handleNavClick("/farm-register")}
          >
            Create Farm
          </button>
          <button
            className={`nav-link ${isActive("/invest") ? "active" : ""}`}
            onClick={() => handleNavClick("/invest")}
          >
            Become Investor
          </button>
          <button
            className={`nav-link ${isActive("/investor-dashboard") ? "active" : ""}`}
            onClick={() => handleNavClick("/investor-dashboard")}
          >
            My Portfolio
          </button>

          {/* Wallet connect only on mobile (inside dropdown) */}
          {isMobileMenuOpen && (
            <div className="mobile-wallet">
              <ConnectButton className="my-custom-class" />
            </div>
          )}
        </div>

        {/* Wallet connection visible only on desktop */}
       <div className="nav-wallet">
          <ConnectButton className="my-custom-class" />
          {/*{account && (
            <div className="wallet-info">
              <span className="wallet-address">
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
              </span>
            </div>
          )}*/}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
