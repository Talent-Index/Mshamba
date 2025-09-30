import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import StatusBadge from '../../components/StatusBadge'

function FarmListing() {
  const account = useCurrentAccount()
  
  const [filters, setFilters] = useState({
    cropType: '',
    region: '',
    status: '',
    minAmount: '',
    maxAmount: ''
  })

  // Mock data - in real app, this would come from blockchain queries
  const farms = [
    {
      id: '1',
      name: 'Green Valley Farm',
      farmerName: 'John Kiprop',
      crop: 'Maize',
      size: '50 acres',
      location: 'Kikuyu, Kiambu',
      region: 'Nairobi',
      status: 'seeking_funding',
      investmentGoal: 100000,
      currentInvestment: 45000,
      expectedReturn: 15,
      duration: '12 months',
      farmingMethod: 'Organic',
      description: 'A sustainable maize farm using organic farming methods with modern irrigation systems.',
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '2',
      name: 'Sunrise Farm',
      farmerName: 'Mary Wanjiku',
      crop: 'Wheat',
      size: '30 acres',
      location: 'Nakuru Town',
      region: 'Nakuru',
      status: 'seeking_funding',
      investmentGoal: 75000,
      currentInvestment: 25000,
      expectedReturn: 18,
      duration: '18 months',
      farmingMethod: 'Conventional',
      description: 'High-yield wheat farm with precision farming techniques and automated systems.',
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '3',
      name: 'Mountain View Farm',
      farmerName: 'Peter Kamau',
      crop: 'Coffee',
      size: '20 acres',
      location: 'Kiambu Hills',
      region: 'Nairobi',
      status: 'seeking_funding',
      investmentGoal: 120000,
      currentInvestment: 0,
      expectedReturn: 25,
      duration: '24 months',
      farmingMethod: 'Organic',
      description: 'Premium coffee farm with shade-grown Arabica beans and sustainable practices.',
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '4',
      name: 'River Side Farm',
      farmerName: 'Grace Muthoni',
      crop: 'Tomatoes',
      size: '15 acres',
      location: 'Athi River',
      region: 'Nairobi',
      status: 'funded',
      investmentGoal: 50000,
      currentInvestment: 50000,
      expectedReturn: 20,
      duration: '8 months',
      farmingMethod: 'Mixed',
      description: 'Greenhouse tomato farming with hydroponic systems for year-round production.',
      imageUrl: '/api/placeholder/300/200'
    }
  ]

  const filteredFarms = farms.filter(farm => {
    if (filters.cropType && farm.crop.toLowerCase() !== filters.cropType.toLowerCase()) return false
    if (filters.region && farm.region.toLowerCase() !== filters.region.toLowerCase()) return false
    if (filters.status && farm.status !== filters.status) return false
    if (filters.minAmount && farm.investmentGoal < parseInt(filters.minAmount)) return false
    if (filters.maxAmount && farm.investmentGoal > parseInt(filters.maxAmount)) return false
    return true
  })

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInvest = (farmId) => {
    // In real app, this would open investment modal or redirect to investment page
    alert(`Investment functionality for farm ${farmId} will be implemented`)
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to browse farms.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Farms</h1>
        <p className="text-gray-600 mt-2">Discover and invest in sustainable farming projects</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Farms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="cropType" className="block text-sm font-medium text-gray-700">
              Crop Type
            </label>
            <select
              id="cropType"
              value={filters.cropType}
              onChange={(e) => handleFilterChange('cropType', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Crops</option>
              <option value="maize">Maize</option>
              <option value="wheat">Wheat</option>
              <option value="coffee">Coffee</option>
              <option value="tomatoes">Tomatoes</option>
              <option value="rice">Rice</option>
              <option value="beans">Beans</option>
            </select>
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <select
              id="region"
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Regions</option>
              <option value="nairobi">Nairobi</option>
              <option value="nakuru">Nakuru</option>
              <option value="kisumu">Kisumu</option>
              <option value="mombasa">Mombasa</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Status</option>
              <option value="seeking_funding">Seeking Funding</option>
              <option value="funded">Funded</option>
            </select>
          </div>

          <div>
            <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700">
              Min Amount (SUI)
            </label>
            <input
              type="number"
              id="minAmount"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              placeholder="0"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">
              Max Amount (SUI)
            </label>
            <input
              type="number"
              id="maxAmount"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              placeholder="No limit"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredFarms.length} of {farms.length} farms
        </p>
        <button
          onClick={() => setFilters({ cropType: '', region: '', status: '', minAmount: '', maxAmount: '' })}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Clear Filters
        </button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarms.map((farm) => (
          <div key={farm.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Farm Image</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                <StatusBadge status={farm.status} type="farm" />
              </div>
              
              <p className="text-sm text-gray-600 mb-2">by {farm.farmerName}</p>
              <p className="text-sm text-gray-500 mb-4">{farm.crop} • {farm.size} • {farm.location}</p>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{farm.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Investment Goal:</span>
                  <span className="font-medium">{farm.investmentGoal.toLocaleString()} SUI</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current:</span>
                  <span className="font-medium">{farm.currentInvestment.toLocaleString()} SUI</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(farm.currentInvestment / farm.investmentGoal) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expected Return:</span>
                  <span className="font-medium">{farm.expectedReturn}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{farm.duration}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleInvest(farm.id)}
                disabled={farm.status === 'funded'}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  farm.status === 'funded'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {farm.status === 'funded' ? 'Fully Funded' : 'Invest Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFarms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No farms match your current filters.</p>
          <button
            onClick={() => setFilters({ cropType: '', region: '', status: '', minAmount: '', maxAmount: '' })}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}

export default FarmListing
