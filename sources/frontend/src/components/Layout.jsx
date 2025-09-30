import { ConnectButton } from '@mysten/dapp-kit'
import { Link, useLocation } from 'react-router-dom'
import { APP_CONFIG } from '../suiConfig'

function Layout({ children }) {
  const location = useLocation()
  
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>
              </Link>
              
              <nav className="hidden md:flex space-x-8">
                <Link 
                  to="/farmer" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/farmer') 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Farmer Portal
                </Link>
                <Link 
                  to="/investor" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/investor') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Investor Portal
                </Link>
                <Link 
                  to="/admin" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/admin') 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Admin Dashboard
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 {APP_CONFIG.name}. Decentralized Farming for a New Generation.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
