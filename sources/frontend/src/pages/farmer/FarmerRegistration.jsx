import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, MODULE } from '../../suiConfig'
import LoadingSpinner from '../../components/LoadingSpinner'

function FarmerRegistration() {
  const account = useCurrentAccount()
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    farmCount: '',
    bio: ''
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
      // In a real implementation, you would store farmer data off-chain
      // and call a smart contract function to register the farmer
      const tx = new Transaction()
      
      // For now, we'll just create a farm as an example
      // In reality, you'd have a separate farmer registration function
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE}::create_farm`,
        arguments: [],
      })

      const result = await signAndExecute({ 
        transaction: tx, 
        chain: 'sui:testnet' 
      })

      setStatus(`Registration successful! Transaction: ${result.digest}`)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        farmCount: '',
        bio: ''
      })

    } catch (error) {
      setStatus(`Registration failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600">Please connect your wallet to register as a farmer.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Farmer Registration</h1>
        <p className="text-gray-600 mt-2">Join Mshamba as a farmer and start receiving investments</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location *
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Years of Experience *
            </label>
            <select
              name="experience"
              id="experience"
              required
              value={formData.experience}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="">Select experience</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          <div>
            <label htmlFor="farmCount" className="block text-sm font-medium text-gray-700">
              Number of Farms *
            </label>
            <input
              type="number"
              name="farmCount"
              id="farmCount"
              required
              min="1"
              value={formData.farmCount}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio / Description *
          </label>
          <textarea
            name="bio"
            id="bio"
            rows={4}
            required
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about your farming experience, methods, and goals..."
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
            I agree to the terms and conditions and understand that my information will be stored securely.
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" text="" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Register as Farmer</span>
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

export default FarmerRegistration
