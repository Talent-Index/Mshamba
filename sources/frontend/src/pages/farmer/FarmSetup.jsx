import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, MODULE } from '../../suiConfig'
import LoadingSpinner from '../../components/LoadingSpinner'

function FarmSetup() {
  const account = useCurrentAccount()
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()
  
  const [formData, setFormData] = useState({
    farmName: '',
    cropType: '',
    farmSize: '',
    location: '',
    region: '',
    investmentGoal: '',
    expectedReturn: '',
    duration: '',
    description: '',
    farmingMethod: '',
    irrigation: '',
    soilType: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!account) {
      setStatus('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)
    setStatus('')

    try {
      const tx = new Transaction()
      
      // Create farm with the provided details
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE}::create_farm`,
        arguments: [],
      })

      const result = await signAndExecute({ 
        transaction: tx, 
        chain: 'sui:testnet' 
      })

      setStatus(`Farm setup successful! Transaction: ${result.digest}`)
      
      // Reset form
      setFormData({
        farmName: '',
        cropType: '',
        farmSize: '',
        location: '',
        region: '',
        investmentGoal: '',
        expectedReturn: '',
        duration: '',
        description: '',
        farmingMethod: '',
        irrigation: '',
        soilType: ''
      })

    } catch (error) {
      setStatus(`Farm setup failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to setup your farm.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Farm Setup</h1>
        <p className="text-gray-600 mt-2">Create your farm profile and set up investment opportunities</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-8">
        {/* Basic Farm Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Farm Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
                Farm Name *
              </label>
              <input
                type="text"
                name="farmName"
                id="farmName"
                required
                value={formData.farmName}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="cropType" className="block text-sm font-medium text-gray-700">
                Crop Type *
              </label>
              <select
                name="cropType"
                id="cropType"
                required
                value={formData.cropType}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select crop type</option>
                <option value="maize">Maize</option>
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="beans">Beans</option>
                <option value="tomatoes">Tomatoes</option>
                <option value="onions">Onions</option>
                <option value="potatoes">Potatoes</option>
                <option value="coffee">Coffee</option>
                <option value="tea">Tea</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700">
                Farm Size (acres) *
              </label>
              <input
                type="number"
                name="farmSize"
                id="farmSize"
                required
                min="0.1"
                step="0.1"
                value={formData.farmSize}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region *
              </label>
              <select
                name="region"
                id="region"
                required
                value={formData.region}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select region</option>
                <option value="nairobi">Nairobi</option>
                <option value="nakuru">Nakuru</option>
                <option value="kisumu">Kisumu</option>
                <option value="mombasa">Mombasa</option>
                <option value="eldoret">Eldoret</option>
                <option value="thika">Thika</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Detailed Location *
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                placeholder="e.g., Kikuyu, Kiambu County"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Investment Details */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="investmentGoal" className="block text-sm font-medium text-gray-700">
                Investment Goal (SUI) *
              </label>
              <input
                type="number"
                name="investmentGoal"
                id="investmentGoal"
                required
                min="100"
                value={formData.investmentGoal}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="expectedReturn" className="block text-sm font-medium text-gray-700">
                Expected Return (%) *
              </label>
              <input
                type="number"
                name="expectedReturn"
                id="expectedReturn"
                required
                min="5"
                max="50"
                step="0.1"
                value={formData.expectedReturn}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (months) *
              </label>
              <select
                name="duration"
                id="duration"
                required
                value={formData.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select duration</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="9">9 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Farming Methods */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Farming Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="farmingMethod" className="block text-sm font-medium text-gray-700">
                Farming Method *
              </label>
              <select
                name="farmingMethod"
                id="farmingMethod"
                required
                value={formData.farmingMethod}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select method</option>
                <option value="organic">Organic</option>
                <option value="conventional">Conventional</option>
                <option value="mixed">Mixed</option>
                <option value="precision">Precision Farming</option>
              </select>
            </div>

            <div>
              <label htmlFor="irrigation" className="block text-sm font-medium text-gray-700">
                Irrigation System *
              </label>
              <select
                name="irrigation"
                id="irrigation"
                required
                value={formData.irrigation}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select irrigation</option>
                <option value="drip">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler System</option>
                <option value="flood">Flood Irrigation</option>
                <option value="rainfed">Rain-fed</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label htmlFor="soilType" className="block text-sm font-medium text-gray-700">
                Soil Type *
              </label>
              <select
                name="soilType"
                id="soilType"
                required
                value={formData.soilType}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">Select soil type</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="loam">Loam</option>
                <option value="silt">Silt</option>
                <option value="volcanic">Volcanic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Farm Description *
          </label>
          <textarea
            name="description"
            id="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your farm, farming practices, and what makes it unique..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I confirm that all information provided is accurate and I understand the investment terms.
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" text="" />
                <span>Creating Farm...</span>
              </>
            ) : (
              <span>Create Farm</span>
            )}
          </button>
        </div>

        {status && (
          <div className={`p-4 rounded-md ${status.includes('successful') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  )
}

export default FarmSetup
