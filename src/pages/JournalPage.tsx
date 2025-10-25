import { useState, useEffect } from 'react'
import SaveTradeModal from '@/components/SaveTradeModal'
import ReplayModal from '@/components/ReplayModal'
import { getAllTrades, deleteTrade, exportTradesToCSV, downloadCSV, initDB } from '@/lib/db'
import type { TradeEntry } from '@/lib/db'
import { useEventLogger } from '@/hooks/useEventLogger'

export default function JournalPage() {
  const [trades, setTrades] = useState<TradeEntry[]>([])
  const [filteredTrades, setFilteredTrades] = useState<TradeEntry[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReplayOpen, setIsReplayOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Taken' | 'Planned'>('All')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const { log } = useEventLogger()

  useEffect(() => {
    initDB().then(loadTrades)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [trades, searchQuery, filterStatus, sortBy])

  const loadTrades = async () => {
    try {
      const allTrades = await getAllTrades()
      setTrades(allTrades)
      log('journal_loaded', { count: allTrades.length })
    } catch (error) {
      console.error('Failed to load trades:', error)
    }
  }

  const applyFilters = () => {
    let filtered = [...trades]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (trade) =>
          trade.token.toLowerCase().includes(query) || trade.notes.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter((trade) => trade.status === filterStatus)
    }

    // Sort
    filtered.sort((a, b) => {
      return sortBy === 'newest' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    })

    setFilteredTrades(filtered)
  }

  const handleDeleteTrade = async (id: number) => {
    if (!confirm('Are you sure you want to delete this trade entry?')) return

    try {
      await deleteTrade(id)
      await loadTrades()
      log('trade_deleted', { tradeId: id })
    } catch (error) {
      console.error('Failed to delete trade:', error)
      alert('Failed to delete trade')
    }
  }

  const handleExportCSV = () => {
    const csv = exportTradesToCSV(filteredTrades)
    const filename = `sparkfined-trades-${new Date().toISOString().split('T')[0]}.csv`
    downloadCSV(csv, filename)
    log('trades_exported', { count: filteredTrades.length })
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
    return price.toLocaleString(undefined, { maximumSignificantDigits: 6 })
  }

  const openReplay = (sessionId: string) => {
    setSelectedSessionId(sessionId)
    setIsReplayOpen(true)
    log('replay_opened', { sessionId })
  }

  if (trades.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-4">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Trading Journal
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              No entries yet. Start documenting your trades and insights.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary mt-4">
              Create First Entry
            </button>
          </div>
        </div>
        <SaveTradeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadTrades}
        />
      </>
    )
  }

  return (
    <>
      <div className="p-4 space-y-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Trade Journal</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-sm rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              disabled={filteredTrades.length === 0}
            >
              📊 Export CSV
            </button>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary text-sm">
              + New Entry
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search token or notes..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All</option>
            <option>Taken</option>
            <option>Planned</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Results count */}
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing {filteredTrades.length} of {trades.length} entries
        </div>

        {/* Grid of trades */}
        {filteredTrades.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No trades match your filters
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrades.map((trade) => (
              <div key={trade.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                      {trade.token}
                    </h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      ${formatPrice(trade.price)}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      trade.status === 'Taken'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {trade.status}
                  </span>
                </div>

                {trade.notes && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">
                    {trade.notes}
                  </p>
                )}

                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span>{formatDate(trade.timestamp)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openReplay(`session_${trade.createdAt}`)}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      🎬 Replay
                    </button>
                    <button
                      onClick={() => handleDeleteTrade(trade.id!)}
                      className="text-red-600 dark:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SaveTradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadTrades}
      />

      <ReplayModal
        isOpen={isReplayOpen}
        onClose={() => setIsReplayOpen(false)}
        sessionId={selectedSessionId}
      />
    </>
  )
}
