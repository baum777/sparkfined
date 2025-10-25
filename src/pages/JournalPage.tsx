import { useState } from 'react'
import ViewStateHandler from '@/components/ViewStateHandler'
import { ViewState } from '@/types/viewState'

export default function JournalPage() {
  const [viewState, setViewState] = useState<ViewState>('empty')

  const emptyContent = (
    <div className="text-center space-y-4 px-4">
      <div className="text-6xl mb-4">📝</div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Trading Journal</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
        No entries yet. Start documenting your trades and insights.
      </p>
      <button onClick={() => setViewState('result')} className="btn-primary mt-4">
        Create First Entry
      </button>
    </div>
  )

  const resultContent = (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Recent Entries</h2>
        <button className="btn-primary text-sm">+ New Entry</button>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Entry #{i} - BTC/USD
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">2 days ago</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Identified support at $42k, entered long position...
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                +3.2%
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                Long
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setViewState('empty')}
        className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mt-4"
      >
        ← Clear Demo Data
      </button>
    </div>
  )

  return (
    <ViewStateHandler state={viewState} emptyContent={emptyContent} resultContent={resultContent} />
  )
}
