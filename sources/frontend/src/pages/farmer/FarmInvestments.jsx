import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import StatusBadge from '../../components/StatusBadge'

function FarmInvestments() {
  const account = useCurrentAccount()
  
  const [selectedFarm, setSelectedFarm] = useState('1')

  // Mock data - in real app, this would come from blockchain queries
  const farms = [
    { id: '1', name: 'Green Valley Farm', status: 'seeking_funding' },
    { id: '2', name: 'Sunrise Farm', status: 'funded' }
  ]

  const investors = [
    {
      id: '1',
      name: 'John Doe',
      address: '0x1234...5678',
      amount: 15000,
      date: '2024-01-15',
      status: 'approved'
    },
    {
      id: '2',
      name: 'Jane Smith',
      address: '0x8765...4321',
      amount: 25000,
      date: '2024-01-16',
      status: 'approved'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      address: '0x1111...2222',
      amount: 10000,
      date: '2024-01-17',
      status: 'pending'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      address: '0x3333...4444',
      amount: 5000,
      date: '2024-01-18',
      status: 'pending'
    }
  ]

  const selectedFarmData = farms.find(farm => farm.id === selectedFarm)

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to manage farm investments.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Farm Investments</h1>
        <p className="text-gray-600 mt-2">Manage investments for your farms</p>
      </div>

      {/* Farm Selection */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Farm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <button
              key={farm.id}
              onClick={() => setSelectedFarm(farm.id)}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                selectedFarm === farm.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{farm.name}</h3>
                <StatusBadge status={farm.status} type="farm" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedFarmData && (
        <>
          {/* Investment Summary */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Investment Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {investors.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Invested (SUI)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{investors.length}</p>
                <p className="text-sm text-gray-500">Total Investors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {investors.filter(inv => inv.status === 'approved').length}
                </p>
                <p className="text-sm text-gray-500">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {investors.filter(inv => inv.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </div>

          {/* Investors List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Investors</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Investor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {investors.map((investor) => (
                    <tr key={investor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{investor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{investor.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{investor.amount.toLocaleString()} SUI</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{investor.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={investor.status} type="investment" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {investor.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <button className="text-green-600 hover:text-green-900">
                              Approve
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Add Profit
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Distribute Profits
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default FarmInvestments
