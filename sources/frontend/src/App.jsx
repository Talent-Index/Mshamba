import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import FarmerRegistration from './pages/farmer/FarmerRegistration'
import FarmSetup from './pages/farmer/FarmSetup'
import FarmInvestments from './pages/farmer/FarmInvestments'
import InvestorDashboard from './pages/investor/InvestorDashboard'
import InvestorRegistration from './pages/investor/InvestorRegistration'
import FarmListing from './pages/investor/FarmListing'
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          
          {/* Farmer Routes */}
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/register" element={<FarmerRegistration />} />
          <Route path="/farmer/setup" element={<FarmSetup />} />
          <Route path="/farmer/investments" element={<FarmInvestments />} />
          
          {/* Investor Routes */}
          <Route path="/investor" element={<InvestorDashboard />} />
          <Route path="/investor/register" element={<InvestorRegistration />} />
          <Route path="/investor/farms" element={<FarmListing />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
