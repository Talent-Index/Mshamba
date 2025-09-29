import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { ConnectButton } from '@mysten/dapp-kit'

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
        <div style={{ marginLeft: 'auto' }}>
          <ConnectButton />
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
