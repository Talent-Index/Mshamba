
import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@mysten/dapp-kit';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <nav className="navbar">
          <Link to="/" className="nav-brand">Tokeni Kwa Shamba</Link>
          <div className="nav-links">
            <Link to="/farms" className="nav-item">My Farms</Link>
            <Link to="/create-farm" className="nav-item">Create Farm</Link>
          </div>
          <div className="wallet-connect">
            <ConnectButton />
          </div>
        </nav>
      </header>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <p>&copy; 2025 Tokeni Kwa Shamba</p>
      </footer>
    </div>
  );
};

export default Layout;
