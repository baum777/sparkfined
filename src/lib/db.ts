// IndexedDB utilities for Sparkfined TA-PWA
// Handles trades and events storage with offline-first approach

const DB_NAME = 'sparkfined-ta-pwa'
const DB_VERSION = 1

export interface TradeEntry {
  id?: number
  token: string
  price: number
  timestamp: number // Unix timestamp UTC
  localTime: string // ISO string with local timezone
  status: 'Taken' | 'Planned'
  notes: string
  screenshot?: string // Base64 or blob URL
  createdAt: number
}

export interface SessionEvent {
  id?: number
  sessionId: string
  type: string // e.g., "screenshot_dropped", "save_trade_clicked"
  timestamp: number
  data?: Record<string, unknown>
}

let dbInstance: IDBDatabase | null = null

// Initialize IndexedDB
export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create trades store
      if (!db.objectStoreNames.contains('trades')) {
        const tradeStore = db.createObjectStore('trades', {
          keyPath: 'id',
          autoIncrement: true,
        })
        tradeStore.createIndex('timestamp', 'timestamp', { unique: false })
        tradeStore.createIndex('token', 'token', { unique: false })
        tradeStore.createIndex('status', 'status', { unique: false })
      }

      // Create events store
      if (!db.objectStoreNames.contains('events')) {
        const eventStore = db.createObjectStore('events', {
          keyPath: 'id',
          autoIncrement: true,
        })
        eventStore.createIndex('sessionId', 'sessionId', { unique: false })
        eventStore.createIndex('timestamp', 'timestamp', { unique: false })
        eventStore.createIndex('type', 'type', { unique: false })
      }
    }
  })
}

// Trade operations
export async function saveTrade(trade: Omit<TradeEntry, 'id'>): Promise<number> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['trades'], 'readwrite')
    const store = transaction.objectStore('trades')
    const request = store.add(trade)

    request.onsuccess = () => resolve(request.result as number)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllTrades(): Promise<TradeEntry[]> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['trades'], 'readonly')
    const store = transaction.objectStore('trades')
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result as TradeEntry[])
    request.onerror = () => reject(request.error)
  })
}

export async function getTradeById(id: number): Promise<TradeEntry | undefined> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['trades'], 'readonly')
    const store = transaction.objectStore('trades')
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result as TradeEntry | undefined)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteTrade(id: number): Promise<void> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['trades'], 'readwrite')
    const store = transaction.objectStore('trades')
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Event operations
export async function logEvent(event: Omit<SessionEvent, 'id'>): Promise<number> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['events'], 'readwrite')
    const store = transaction.objectStore('events')
    const request = store.add(event)

    request.onsuccess = () => resolve(request.result as number)
    request.onerror = () => reject(request.error)
  })
}

export async function getEventsBySession(sessionId: string): Promise<SessionEvent[]> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['events'], 'readonly')
    const store = transaction.objectStore('events')
    const index = store.index('sessionId')
    const request = index.getAll(sessionId)

    request.onsuccess = () => resolve(request.result as SessionEvent[])
    request.onerror = () => reject(request.error)
  })
}

export async function getAllEvents(): Promise<SessionEvent[]> {
  const db = await initDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['events'], 'readonly')
    const store = transaction.objectStore('events')
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result as SessionEvent[])
    request.onerror = () => reject(request.error)
  })
}

// Export trades to CSV
export function exportTradesToCSV(trades: TradeEntry[]): string {
  const headers = ['ID', 'Token', 'Price', 'Timestamp (UTC)', 'Local Time', 'Status', 'Notes']
  const rows = trades.map((trade) => [
    trade.id || '',
    trade.token,
    trade.price,
    new Date(trade.timestamp).toISOString(),
    trade.localTime,
    trade.status,
    `"${trade.notes.replace(/"/g, '""')}"`, // Escape quotes
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  return csvContent
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Session management
let currentSessionId: string | null = null

export function getSessionId(): string {
  if (!currentSessionId) {
    currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  return currentSessionId
}

export function startNewSession(): string {
  currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  return currentSessionId
}
