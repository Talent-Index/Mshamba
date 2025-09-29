
// src/pages/Home.jsx
import { useState } from 'react'
import { useSuiClient } from '@mysten/dapp-kit'
import { type SuiObjectRef } from '@mysten/sui'
import { PACKAGE_ID, MODULE, DEFAULT_FARM_ID } from '../suiConfig'

function Home() {
  const client = useSuiClient()
  const [farmId, setFarmId] = useState(DEFAULT_FARM_ID)
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')

  async function handleInvest() {
    try {
      setStatus('Submitting...')
      if (!farmId) {
        setStatus('Enter Farm object ID first')
        return
      }
      const amountNum = Number(amount)
      if (!amountNum || amountNum <= 0) {
        setStatus('Enter a positive SUI amount')
        return
      }
      setStatus('Use Admin page or wallet to call invest; UI wiring next.')
    } catch (e) {
      setStatus(String(e))
    }
  }

  return (
    <div>
      <h1>Welcome to Mshamba</h1>
      <p>Decentralized Farming for a new generation.</p>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <input
          placeholder="Farm Object ID"
          value={farmId}
          onChange={(e) => setFarmId(e.target.value)}
          style={{ width: 420 }}
        />
        <input
          placeholder="Amount (SUI)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: 160 }}
        />
        <button onClick={handleInvest}>Invest</button>
      </div>
      <div style={{ marginTop: 8, minHeight: 24 }}>{status}</div>
    </div>
  )
}
export default Home
