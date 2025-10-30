/**
 * POST /api/access/lock
 * 
 * Register a lock and assign OG rank
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { registerLock, verifyStreamflowTransaction } from '../../src/server/streamflow/lock'
import { isValidPublicKey } from '../../src/server/solana/connection'
import { isOGRank } from '../../src/config/access'
import type { LockRequest, LockResponse } from '../../src/types/access'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { wallet, amount, txSignature }: LockRequest = req.body

    // Validate inputs
    if (!wallet || !isValidPublicKey(wallet)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid wallet address' 
      })
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid lock amount' 
      })
    }

    // Optional: Verify Streamflow transaction signature
    if (txSignature) {
      const isValid = await verifyStreamflowTransaction(txSignature, amount)
      if (!isValid) {
        return res.status(400).json({ 
          ok: false, 
          error: 'Invalid transaction signature' 
        })
      }
    }

    // Register lock and get rank
    const { rank, lockId } = await registerLock({ wallet, amount, txSignature })

    // Prepare response
    const response: LockResponse = {
      ok: true,
      rank,
      lockId,
    }

    // Add note if rank is beyond OG slots
    if (!isOGRank(rank)) {
      response.note = `Rank ${rank} is beyond OG slots (333). NFT mint not available. Consider holder path instead.`
    }

    console.log(`[API /lock] Success: wallet=${wallet}, rank=${rank}`)

    return res.status(200).json(response)

  } catch (error: any) {
    console.error('[API /lock] Error:', error)

    // Handle known errors
    if (error.code === 'DUPLICATE_LOCK') {
      return res.status(409).json({ 
        ok: false, 
        error: 'Wallet already has a lock',
        details: error.details,
      })
    }

    return res.status(500).json({ 
      ok: false, 
      error: 'Internal server error',
      message: error.message,
    })
  }
}
