import { Link } from 'react-router-dom'
import { useCurrentAccount } from '@mysten/dapp-kit'
import StatusBadge from '../../components/StatusBadge'

function InvestorDashboard() {
  const account = useCurrentAccount()

  // Mock data - in real app, this would come from blockchain queries
  const investorStats = {
    totalInvested: 45000,
    activeInvestments: 3,
    totalReturns: 6750,
    pendingInvestments: 1
  }

  const investments = [
    {
      id: '1',
      farmName: 'Green Valley Farm',
      farmerName: 'John Kiprop',
      amount: 15000,
      date: '2024-01-15',
      status: 'active',
      expectedReturn: 22500,
      duration: '12 months'
    },
    {
      id: '2',
      farmName: 'Sunrise Farm',
      farmerName: 'Mary Wanjiku',
      amount: 25000,
      date: '2024-01-16',
      status: 'active',
      expectedReturn: 37500,
      duration: '18 months'
    },
    {
      id: '3',
      farmName: 'Mountain View Farm',
      farmerName: 'Peter Kamau',
      amount: 5000,
      date: '2024-01-17',
      status: 'pending',
      expectedReturn: 7500,
      duration: '6 months'
    }
  ]

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to access the investor dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your investments and returns</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/investor/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Profile
          </Link>
          <Link
            to="/investor/farms"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Farms
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-sm font-medium text-gray-500">Total Invested</p>
              <p className="text-2xl font-semibold text-gray-900">{investorStats.totalInvested.toLocaleString()} SUI</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Investments</p>
              <p className="text-2xl font-semibold text-gray-900">{investorStats.activeInvestments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Returns</p>
              <p className="text-2xl font-semibold text-gray-900">{investorStats.totalReturns.toLocaleString()} SUI</p>
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
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{investorStats.pendingInvestments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Investments */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Investments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {investments.map((investment) => (
            <div key={investment.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{investment.farmName}</h3>
                    <StatusBadge status={investment.status} type="investment" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Farmer: {investment.farmerName}</p>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Invested:</span>
                      <p className="font-medium">{investment.amount.toLocaleString()} SUI</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Expected Return:</span>
                      <p className="font-medium">{investment.expectedReturn.toLocaleString()} SUI</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="font-medium">{investment.duration}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <p className="font-medium">{investment.date}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-6 flex space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  {investment.status === 'active' && (
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Track Progress
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/investor/farms"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            Browse New Farms
          </Link>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Portfolio
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Download Reports
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvestorDashboard
