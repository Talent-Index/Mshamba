import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider,Outlet} from 'react-router-dom'
import Home from './components/pages/Home.jsx'
import FarmReg from './components/pages/Farmer/FarmReg.jsx'
import Invest from './components/pages/Investor/InvestReg.jsx'
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css"; // <- required styles
import Explore from './components/pages/Explore.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import FarmerDashboard from './components/pages/Farmer/FarmerDashboard.jsx'
import InvestorDashboard from './components/pages/Investor/InvestorDashboard.jsx'
const Layout = () => {
  return (
    <div>
      <Navbar/>
      <Outlet />
    </div>
  );
};
const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
        {
  path:"/",
  element:<Home/>
},{
  path:"/farm-register",
  element:<FarmReg/>
},{
  path:"/invest",
  element:<Invest/>
},{
  path:"/home",
  element:<Explore/>
},
{
  path: "/farmer-dashboard",
  element: <FarmerDashboard/>
},
{
  path: "/investor-dashboard",
  element: <InvestorDashboard/>
}
    ]
  }

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider>
      <RouterProvider router={router}/>
    </WalletProvider>
    
   
  </StrictMode>,
)
