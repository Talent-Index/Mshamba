import { Link } from 'react-router-dom'
import { useCurrentAccount } from '@mysten/dapp-kit'
import StatusBadge from '../../components/StatusBadge'

function FarmerDashboard() {
  const account = useCurrentAccount()

  // Mock data - in real app, this would come from blockchain queries
  const farmerStats = {
    totalFarms: 2,
    totalInvestments: 156000, // in SUI
    activeInvestors: 8,
    pendingApprovals: 3
  }

  const farms = [
    {
      id: '1',
      name: 'Green Valley Farm',
      crop: 'Maize',
      size: '50 acres',
      status: 'seeking_funding',
      investmentGoal: 100000,
      currentInvestment: 45000,
      region: 'Nairobi'
    },
    {
      id: '2',
      name: 'Sunrise Farm',
      crop: 'Wheat',
      size: '30 acres',
      status: 'funded',
      investmentGoal: 75000,
      currentInvestment: 75000,
      region: 'Nakuru'
    }
  ]

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to access the farmer dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your farms and track investments</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/farmer/register"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Register Farm
          </Link>
          <Link
            to="/farmer/setup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Setup Investment
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Farms</p>
              <p className="text-2xl font-semibold text-gray-900">{farmerStats.totalFarms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Investments</p>
              <p className="text-2xl font-semibold text-gray-900">{farmerStats.totalInvestments.toLocaleString()} SUI</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Investors</p>
              <p className="text-2xl font-semibold text-gray-900">{farmerStats.activeInvestors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-semibold text-gray-900">{farmerStats.pendingApprovals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Farms List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Farms</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {farms.map((farm) => (
            <div key={farm.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{farm.name}</h3>
                    <StatusBadge status={farm.status} type="farm" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{farm.crop} • {farm.size} • {farm.region}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Investment Progress</span>
                      <span className="font-medium">{farm.currentInvestment.toLocaleString()} / {farm.investmentGoal.toLocaleString()} SUI</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(farm.currentInvestment / farm.investmentGoal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="ml-6 flex space-x-3">
                  <Link
                    to={`/farmer/farms/${farm.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                  <Link
                    to="/farmer/investments"
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Manage Investments
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FarmerDashboard
