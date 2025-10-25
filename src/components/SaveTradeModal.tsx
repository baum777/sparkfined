import { useState, useEffect } from 'react'
import { saveTrade } from '@/lib/db'
import type { TradeEntry } from '@/lib/db'

interface SaveTradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved?: () => void
  prefillToken?: string
  prefillPrice?: number
}

export default function SaveTradeModal({
  isOpen,
  onClose,
  onSaved,
  prefillToken = '',
  prefillPrice = 0,
}: SaveTradeModalProps) {
  const [token, setToken] = useState(prefillToken)
  const [price, setPrice] = useState(prefillPrice.toString())
  const [status, setStatus] = useState<'Taken' | 'Planned'>('Taken')
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setToken(prefillToken)
      setPrice(prefillPrice.toString())
    }
  }, [isOpen, prefillToken, prefillPrice])

  const handleSave = async () => {
    if (!token.trim() || !price || parseFloat(price) <= 0) {
      alert('Please fill in token and valid price')
      return
    }

    setIsSaving(true)
    try {
      const now = Date.now()
      const trade: Omit<TradeEntry, 'id'> = {
        token: token.trim(),
        price: parseFloat(price),
        timestamp: now,
        localTime: new Date(now).toISOString(),
        status,
        notes: notes.trim(),
        createdAt: now,
      }

      await saveTrade(trade)
      
      // Reset form
      setToken('')
      setPrice('')
      setStatus('Taken')
      setNotes('')
      
      onSaved?.()
      onClose()
    } catch (error) {
      console.error('Failed to save trade:', error)
      alert('Failed to save trade. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Save Trade
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Token */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Token *
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g., BTC/USD, ETH"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.00000001"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'Taken'}
                    onChange={() => setStatus('Taken')}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-slate-900 dark:text-slate-100">Taken</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'Planned'}
                    onChange={() => setStatus('Planned')}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-slate-900 dark:text-slate-100">Planned</span>
                </label>
              </div>
            </div>

            {/* Timestamp display */}
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div>
                  <span className="font-medium">UTC:</span> {new Date().toUTCString()}
                </div>
                <div>
                  <span className="font-medium">Local:</span> {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Trade notes, reasoning, or insights..."
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Trade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
