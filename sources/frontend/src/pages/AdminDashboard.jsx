
// src/pages/AdminDashboard.jsx
import { useState } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PACKAGE_ID, MODULE, DEFAULT_FARM_ID } from '../suiConfig'

function AdminDashboard() {
  const account = useCurrentAccount()
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction()

  const [farmId, setFarmId] = useState(DEFAULT_FARM_ID)
  const [profit, setProfit] = useState('')
  const [platformAddr, setPlatformAddr] = useState('')
  const [status, setStatus] = useState('')

  async function onCreateFarm() {
    if (!account) {
      setStatus('Connect wallet first')
      return
    }
    try {
      setStatus('Creating farm...')
      const tx = new Transaction()
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE}::create_farm`,
        arguments: [tx.object('0x6')], // &mut TxContext is implicit; placeholder keeps API happy
      })
      const res = await signAndExecute({ transaction: tx, chain: 'sui:testnet' })
      setStatus(`Submitted: ${res.digest || ''}. Inspect effects to find Farm ID`)
    } catch (e) {
      setStatus(String(e))
    }
  }

  async function onAddProfit() {
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
      setStatus('Adding profit...')
      const tx = new Transaction()
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(BigInt(Math.floor(suiAmount * 1_000_000_000)))])
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE}::add_profit`,
        arguments: [tx.object(farmId), coin],
      })
      const res = await signAndExecute({ transaction: tx, chain: 'sui:testnet' })
      setStatus(`Submitted: ${res.digest || ''}`)
    } catch (e) {
      setStatus(String(e))
    }
  }

  async function onDistribute() {
    if (!account) {
      setStatus('Connect wallet first')
      return
    }
    if (!farmId || !platformAddr) {
      setStatus('Enter Farm ID and Platform address')
      return
    }
    try {
      setStatus('Distributing...')
      const tx = new Transaction()
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE}::distribute`,
        arguments: [tx.object(farmId), tx.pure.address(platformAddr)],
      })
      const res = await signAndExecute({ transaction: tx, chain: 'sui:testnet' })
      setStatus(`Submitted: ${res.digest || ''}`)
    } catch (e) {
      setStatus(String(e))
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <button onClick={onCreateFarm}>Create Farm</button>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input placeholder="Farm Object ID" value={farmId} onChange={(e) => setFarmId(e.target.value)} style={{ width: 420 }} />
        <input placeholder="Profit (SUI)" value={profit} onChange={(e) => setProfit(e.target.value)} style={{ width: 160 }} />
        <button onClick={onAddProfit}>Add Profit</button>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input placeholder="Platform address" value={platformAddr} onChange={(e) => setPlatformAddr(e.target.value)} style={{ width: 420 }} />
        <button onClick={onDistribute}>Distribute</button>
      </div>

      <div style={{ marginTop: 8, minHeight: 24 }}>{status}</div>
    </div>
  )
}
export default AdminDashboard
