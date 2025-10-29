/**
 * Alpha M8: Enhanced Telemetry Service
 * Local telemetry with IndexedDB persistence and error pipeline
 *
 * Privacy-first: All data stays local, manual export only
 * Features:
 * - Extended metrics (ai_latency, provider_fallbacks, ocr_confidence_avg)
 * - Error buffering to IndexedDB
 * - Export API for diagnostics
 * - No PII collection
 *
 * DoD: Metrics captured and exportable, no PII
 */

export interface TelemetryEvent {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface PerformanceBudget {
  name: string
  budgetMs: number
  p95Threshold?: number
}

export interface ErrorEvent {
  id?: number
  message: string
  stack?: string
  timestamp: number
  context?: Record<string, unknown>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

class TelemetryServiceClass {
  private events: TelemetryEvent[] = []
  private budgets: PerformanceBudget[] = []
  private errors: ErrorEvent[] = []
  private dbName = 'sparkfined-telemetry'
  private dbVersion = 1

  /**
   * Initialize telemetry database
   */
  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create telemetry events store
        if (!db.objectStoreNames.contains('events')) {
          const eventStore = db.createObjectStore('events', {
            keyPath: 'id',
            autoIncrement: true,
          })
          eventStore.createIndex('name', 'name', { unique: false })
          eventStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Create error events store
        if (!db.objectStoreNames.contains('errors')) {
          const errorStore = db.createObjectStore('errors', {
            keyPath: 'id',
            autoIncrement: true,
          })
          errorStore.createIndex('timestamp', 'timestamp', { unique: false })
          errorStore.createIndex('severity', 'severity', { unique: false })
        }
      }
    })
  }

  /**
   * Log a telemetry event
   * @param name - Event name (e.g., "ai_teaser_ms")
   * @param value - Numeric value (usually duration in ms)
   * @param metadata - Optional metadata
   */
  log(name: string, value: number, metadata?: Record<string, unknown>): void {
    const event: TelemetryEvent = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    }

    this.events.push(event)

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }

    // Persist to IndexedDB (async, fire-and-forget)
    this.persistEvent(event).catch((error) => {
      console.error('[Telemetry] Failed to persist event:', error)
    })
  }

  /**
   * Log an error event to error pipeline
   */
  logError(
    error: Error | string,
    context?: Record<string, unknown>,
    severity: ErrorEvent['severity'] = 'medium'
  ): void {
    const errorEvent: ErrorEvent = {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: Date.now(),
      context,
      severity,
    }

    this.errors.push(errorEvent)

    // Keep only last 100 errors in memory
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100)
    }

    // Persist to IndexedDB
    this.persistError(errorEvent).catch((err) => {
      console.error('[Telemetry] Failed to persist error:', err)
    })
  }

  /**
   * Persist event to IndexedDB
   */
  private async persistEvent(event: TelemetryEvent): Promise<void> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction(['events'], 'readwrite')
      const store = transaction.objectStore('events')
      
      // Add event without id (auto-increment will assign)
      const eventWithoutId = { ...event }
      store.add(eventWithoutId)

      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      })
    } catch (error) {
      // Fail silently - telemetry should never break app
      console.error('[Telemetry] Persist event failed:', error)
    }
  }

  /**
   * Persist error to IndexedDB
   */
  private async persistError(error: ErrorEvent): Promise<void> {
    try {
      const db = await this.initDB()
      const transaction = db.transaction(['errors'], 'readwrite')
      const store = transaction.objectStore('errors')
      
      store.add(error)

      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      })
    } catch (err) {
      console.error('[Telemetry] Persist error failed:', err)
    }
  }

  /**
   * Register performance budget
   */
  registerBudget(budget: PerformanceBudget): void {
    this.budgets.push(budget)
  }

  /**
   * Check if metric exceeds budget
   */
  checkBudget(name: string, value: number): boolean {
    const budget = this.budgets.find((b) => b.name === name)
    if (!budget) return true

    return value <= budget.budgetMs
  }

  /**
   * Get performance statistics for an event
   */
  getStats(name: string): {
    count: number
    median: number
    p95: number
    max: number
    avg: number
  } | null {
    const filtered = this.events
      .filter((e) => e.name === name)
      .map((e) => e.value)
      .sort((a, b) => a - b)

    if (filtered.length === 0) return null

    const p95Index = Math.floor(filtered.length * 0.95)
    const sum = filtered.reduce((acc, val) => acc + val, 0)

    return {
      count: filtered.length,
      median: filtered[Math.floor(filtered.length / 2)],
      p95: filtered[p95Index],
      max: filtered[filtered.length - 1],
      avg: sum / filtered.length,
    }
  }

  /**
   * Get all persisted events from IndexedDB
   */
  async getPersistedEvents(): Promise<TelemetryEvent[]> {
    try {
      const db = await this.initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['events'], 'readonly')
        const store = transaction.objectStore('events')
        const request = store.getAll()

        request.onsuccess = () => resolve(request.result as TelemetryEvent[])
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('[Telemetry] Get persisted events failed:', error)
      return []
    }
  }

  /**
   * Get all persisted errors from IndexedDB
   */
  async getPersistedErrors(): Promise<ErrorEvent[]> {
    try {
      const db = await this.initDB()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['errors'], 'readonly')
        const store = transaction.objectStore('errors')
        const request = store.getAll()

        request.onsuccess = () => resolve(request.result as ErrorEvent[])
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.error('[Telemetry] Get persisted errors failed:', error)
      return []
    }
  }

  /**
   * Export events as JSON (memory + persisted)
   */
  async dump(): Promise<{
    events: TelemetryEvent[]
    errors: ErrorEvent[]
    budgets: PerformanceBudget[]
  }> {
    const persistedEvents = await this.getPersistedEvents()
    const persistedErrors = await this.getPersistedErrors()

    return {
      events: persistedEvents.length > 0 ? persistedEvents : [...this.events],
      errors: persistedErrors.length > 0 ? persistedErrors : [...this.errors],
      budgets: [...this.budgets],
    }
  }

  /**
   * Export events as CSV
   */
  async exportCSV(): Promise<string> {
    const persistedEvents = await this.getPersistedEvents()
    const events = persistedEvents.length > 0 ? persistedEvents : this.events

    const header = 'name,value,timestamp,metadata\n'
    const rows = events
      .map(
        (e) =>
          `${e.name},${e.value},${e.timestamp},${JSON.stringify(e.metadata || {})}`
      )
      .join('\n')

    return header + rows
  }

  /**
   * Export errors as CSV
   */
  async exportErrorsCSV(): Promise<string> {
    const persistedErrors = await this.getPersistedErrors()
    const errors = persistedErrors.length > 0 ? persistedErrors : this.errors

    const header = 'timestamp,severity,message,stack,context\n'
    const rows = errors
      .map((e) => {
        const escapedMessage = `"${e.message.replace(/"/g, '""')}"`
        const escapedStack = e.stack ? `"${e.stack.replace(/"/g, '""')}"` : ''
        const escapedContext = JSON.stringify(e.context || {})
        return `${e.timestamp},${e.severity},${escapedMessage},${escapedStack},${escapedContext}`
      })
      .join('\n')

    return header + rows
  }

  /**
   * Clear all events (memory and IndexedDB)
   */
  async clear(): Promise<void> {
    this.events = []
    this.errors = []

    try {
      const db = await this.initDB()
      
      // Clear events
      const eventsTransaction = db.transaction(['events'], 'readwrite')
      const eventsStore = eventsTransaction.objectStore('events')
      eventsStore.clear()

      // Clear errors
      const errorsTransaction = db.transaction(['errors'], 'readwrite')
      const errorsStore = errorsTransaction.objectStore('errors')
      errorsStore.clear()

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          eventsTransaction.oncomplete = () => resolve()
          eventsTransaction.onerror = () => reject(eventsTransaction.error)
        }),
        new Promise<void>((resolve, reject) => {
          errorsTransaction.oncomplete = () => resolve()
          errorsTransaction.onerror = () => reject(errorsTransaction.error)
        }),
      ])
    } catch (error) {
      console.error('[Telemetry] Clear failed:', error)
    }
  }
}

// Singleton instance
export const Telemetry = new TelemetryServiceClass()

// Standard event names (extended for M8)
export const TelemetryEvents = {
  AI_TEASER_MS: 'ai_teaser_ms',
  PROVIDER_FALLBACK: 'provider_fallback',
  SNAPSHOT_AGE_S: 'snapshot_age_s',
  REPLAY_OPEN_MS: 'replay_open_ms',
  JOURNAL_SAVE_MS: 'journal_save_ms',
  JOURNAL_GRID_MS: 'journal_grid_ms',
  EXPORT_ZIP_MS: 'export_zip_ms',
  OCR_PARSE_MS: 'ocr_parse_ms',
  API_REQUEST_MS: 'api_request_ms',

  // M8: New metrics
  OCR_CONFIDENCE_AVG: 'ocr_confidence_avg',
  AI_LATENCY: 'ai_latency',
  AI_PROVIDER_FALLBACK: 'ai_provider_fallback',
  ERROR_RATE: 'error_rate',
  OFFLINE_MODE: 'offline_mode',
} as const

// Register performance budgets
Telemetry.registerBudget({ name: TelemetryEvents.OCR_PARSE_MS, budgetMs: 500 })
Telemetry.registerBudget({ name: TelemetryEvents.AI_TEASER_MS, budgetMs: 3000 })
Telemetry.registerBudget({ name: TelemetryEvents.AI_LATENCY, budgetMs: 3000 })
Telemetry.registerBudget({ name: TelemetryEvents.REPLAY_OPEN_MS, budgetMs: 350 })
Telemetry.registerBudget({ name: TelemetryEvents.JOURNAL_SAVE_MS, budgetMs: 60 })
Telemetry.registerBudget({ name: TelemetryEvents.JOURNAL_GRID_MS, budgetMs: 250 })
Telemetry.registerBudget({ name: TelemetryEvents.EXPORT_ZIP_MS, budgetMs: 800 })
