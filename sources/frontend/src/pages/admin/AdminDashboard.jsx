import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, MODULE } from '../../suiConfig'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'

function AdminDashboard() {
  const account = useCurrentAccount()
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()
  
  const [farmId, setFarmId] = useState('')
  const [profit, setProfit] = useState('')
  const [platformAddr, setPlatformAddr] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - in real app, this would come from blockchain queries
  const systemStats = {
    totalFarms: 156,
    totalInvestors: 1247,
    totalInvestments: 2450000,
    pendingApprovals: 23,
    activeFarms: 89,
    completedFarms: 44
  }

  const farms = [
    {
      id: '1',
      name: 'Green Valley Farm',
      farmer: 'John Kiprop',
      crop: 'Maize',
      status: 'seeking_funding',
      investmentGoal: 100000,
      currentInvestment: 45000,
      region: 'Nairobi',
      registeredDate: '2024-01-10'
    },
    {
      id: '2',
      name: 'Sunrise Farm',
      farmer: 'Mary Wanjiku',
      crop: 'Wheat',
      status: 'funded',
      investmentGoal: 75000,
      currentInvestment: 75000,
      region: 'Nakuru',
      registeredDate: '2024-01-08'
    },
    {
      id: '3',
      name: 'Mountain View Farm',
      farmer: 'Peter Kamau',
      crop: 'Coffee',
      status: 'seeking_funding',
      investmentGoal: 120000,
      currentInvestment: 0,
      region: 'Nairobi',
      registeredDate: '2024-01-15'
    }
  ]

  const investors = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      totalInvested: 45000,
      activeInvestments: 3,
      registeredDate: '2024-01-05'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      totalInvested: 75000,
      activeInvestments: 2,
      registeredDate: '2024-01-03'
    }
  ]

  const pendingReports = [
    {
      id: '1',
      farmName: 'Green Valley Farm',
      farmer: 'John Kiprop',
      reportType: 'Financial Report',
      submittedDate: '2024-01-18',
      status: 'pending'
    },
    {
      id: '2',
      farmName: 'Sunrise Farm',
      farmer: 'Mary Wanjiku',
      reportType: 'Progress Report',
      submittedDate: '2024-01-17',
      status: 'pending'
    }
  ]

  const handleCreateFarm = async () => {
    if (!account) {
      setStatus('Connect wallet first')
      return
    }
    try {
      setIsLoading(true)
      setStatus('Creating farm...')
      const tx = new Transaction()
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE}::create_farm`,
        arguments: [],
      })
      const res = await signAndExecute({ transaction: tx, chain: 'sui:testnet' })
      setStatus(`Farm created! Transaction: ${res.digest || ''}`)
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProfit = async () => {
    if (!account) {
      setStatus('Connect wallet first')
      return
    }
    if (!farmId) {
      setStatus('Enter Farm object ID')
      return
    }
    const suiAmount = Number(profit)
    if (!suiAmount || suiAmount <= 0) {
      setStatus('Enter positive SUI amount')
      return
    }
    try {
      setIsLoading(true)
      setStatus('Adding profit...')
      const tx = new Transaction()
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(BigInt(Math.floor(suiAmount * 1_000_000_000)))])
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE}::add_profit`,
        arguments: [tx.object(farmId), coin],
      })
      const res = await signAndExecute({ transaction: tx, chain: 'sui:testnet' })
      setStatus(`Profit added! Transaction: ${res.digest || ''}`)
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDistribute = async () => {
    if (!account) {
      setStatus('Connect wallet first')
      return
    }
    if (!farmId || !platformAddr) {
      setStatus('Enter Farm ID and Platform address')
      return
    }
    try {
      setIsLoading(true)
      setStatus('Distributing...')
      const tx = new Transaction()
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE}::distribute`,
        arguments: [tx.object(farmId), tx.pure.address(platformAddr)],
      })
      const res = await signAndExecute({ transaction: tx, chain: 'sui:testnet' })
      setStatus(`Distribution completed! Transaction: ${res.digest || ''}`)
    } catch (e) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to access the admin dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage the Mshamba platform and oversee all operations</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <p className="text-2xl font-semibold text-gray-900">{systemStats.totalFarms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Investors</p>
              <p className="text-2xl font-semibold text-gray-900">{systemStats.totalInvestors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Investments</p>
              <p className="text-2xl font-semibold text-gray-900">{systemStats.totalInvestments.toLocaleString()} SUI</p>
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
              <p className="text-2xl font-semibold text-gray-900">{systemStats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Farms</p>
              <p className="text-2xl font-semibold text-gray-900">{systemStats.activeFarms}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Farms</p>
              <p className="text-2xl font-semibold text-gray-900">{systemStats.completedFarms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Contract Actions</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateFarm}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? <LoadingSpinner size="sm" text="" /> : null}
              <span>Create Farm</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <input
              placeholder="Farm Object ID"
              value={farmId}
              onChange={(e) => setFarmId(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              style={{ width: '300px' }}
            />
            <input
              placeholder="Profit Amount (SUI)"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              style={{ width: '200px' }}
            />
            <button
              onClick={handleAddProfit}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? <LoadingSpinner size="sm" text="" /> : null}
              <span>Add Profit</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <input
              placeholder="Platform Address"
              value={platformAddr}
              onChange={(e) => setPlatformAddr(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2"
              style={{ width: '300px' }}
            />
            <button
              onClick={handleDistribute}
              disabled={isLoading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? <LoadingSpinner size="sm" text="" /> : null}
              <span>Distribute</span>
            </button>
          </div>
        </div>
        
        {status && (
          <div className={`mt-4 p-4 rounded-md ${status.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
            {status}
          </div>
        )}
      </div>

      {/* Pending Reports */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Pending Financial Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingReports.map((report) => (
            <div key={report.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{report.farmName}</h3>
                    <StatusBadge status={report.status} type="investment" />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {report.reportType} • Submitted by {report.farmer} on {report.submittedDate}
                  </p>
                </div>
                <div className="ml-6 flex space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Report
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Approve
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Farms */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Farm Registrations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farm Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Farmer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment Goal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {farms.map((farm) => (
                <tr key={farm.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{farm.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{farm.farmer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{farm.crop}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={farm.status} type="farm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{farm.investmentGoal.toLocaleString()} SUI</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{farm.registeredDate}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
