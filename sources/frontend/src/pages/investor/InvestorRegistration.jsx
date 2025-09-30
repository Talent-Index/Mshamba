import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import LoadingSpinner from '../../components/LoadingSpinner'

function InvestorRegistration() {
  const account = useCurrentAccount()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    investmentExperience: '',
    riskTolerance: '',
    preferredAmount: '',
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
      // In a real implementation, you would store investor data off-chain
      // and call a smart contract function to register the investor
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setStatus('Registration successful! You can now start investing in farms.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        investmentExperience: '',
        riskTolerance: '',
        preferredAmount: '',
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
        <p className="text-gray-600">Please connect your wallet to register as an investor.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investor Registration</h1>
        <p className="text-gray-600 mt-2">Join Mshamba as an investor and start supporting sustainable farming</p>
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="investmentExperience" className="block text-sm font-medium text-gray-700">
              Investment Experience *
            </label>
            <select
              name="investmentExperience"
              id="investmentExperience"
              required
              value={formData.investmentExperience}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select experience</option>
              <option value="beginner">Beginner (0-1 years)</option>
              <option value="intermediate">Intermediate (2-5 years)</option>
              <option value="advanced">Advanced (6-10 years)</option>
              <option value="expert">Expert (10+ years)</option>
            </select>
          </div>

          <div>
            <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700">
              Risk Tolerance *
            </label>
            <select
              name="riskTolerance"
              id="riskTolerance"
              required
              value={formData.riskTolerance}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select risk tolerance</option>
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="preferredAmount" className="block text-sm font-medium text-gray-700">
            Preferred Investment Amount (SUI) *
          </label>
          <select
            name="preferredAmount"
            id="preferredAmount"
            required
            value={formData.preferredAmount}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select preferred amount</option>
            <option value="1000-5000">1,000 - 5,000 SUI</option>
            <option value="5000-10000">5,000 - 10,000 SUI</option>
            <option value="10000-25000">10,000 - 25,000 SUI</option>
            <option value="25000-50000">25,000 - 50,000 SUI</option>
            <option value="50000+">50,000+ SUI</option>
          </select>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio / Investment Goals *
          </label>
          <textarea
            name="bio"
            id="bio"
            rows={4}
            required
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about your investment goals, interests in sustainable farming, and what you hope to achieve..."
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Investment Terms</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Minimum investment: 1,000 SUI</li>
            <li>• Expected returns: 15-50% annually</li>
            <li>• Profit sharing: 60% farmer, 30% investors, 10% platform</li>
            <li>• All transactions are recorded on blockchain</li>
          </ul>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the terms and conditions and understand the investment risks.
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
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" text="" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Register as Investor</span>
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

export default InvestorRegistration
