/**
 * Privacy-Focused Telemetry System
 * 
 * Collects anonymous usage metrics for improving the app.
 * - No PII (Personally Identifiable Information) collected
 * - Stored locally in IndexedDB
 * - Respects user privacy settings
 * - Can be disabled in settings
 * - Exportable for analytics
 * 
 * Events tracked:
 * - install_prompt: When PWA install prompt appears
 * - installed: When PWA is successfully installed
 * - wco_visible: When Window Controls Overlay is active
 * - ai_latency_ms: AI analysis response time
 * - ai_accept: User accepted AI suggestion
 * - ai_reject: User rejected AI suggestion
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { loadSettings } from './store/settings';

// Telemetry Event Types
export type TelemetryEventType =
  | 'install_prompt'
  | 'installed'
  | 'install_prompt_dismissed'
  | 'wco_visible'
  | 'wco_hidden'
  | 'ai_latency_ms'
  | 'ai_accept'
  | 'ai_reject'
  | 'page_view'
  | 'feature_used';

export interface TelemetryEvent {
  id?: number;
  type: TelemetryEventType;
  timestamp: number;
  metadata?: Record<string, string | number | boolean>;
  sessionId: string;
}

interface TelemetryDB extends DBSchema {
  events: {
    key: number;
    value: TelemetryEvent;
    indexes: { 'by-type': string; 'by-timestamp': number };
  };
}

const DB_NAME = 'sparkfined-telemetry';
const DB_VERSION = 1;
const STORE_NAME = 'events';

let dbInstance: IDBPDatabase<TelemetryDB> | null = null;
let sessionId: string | null = null;

/**
 * Initialize the telemetry database
 */
async function getDB(): Promise<IDBPDatabase<TelemetryDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<TelemetryDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-type', 'type');
        store.createIndex('by-timestamp', 'timestamp');
      }
    },
  });

  return dbInstance;
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (sessionId) return sessionId;

  // Create a simple session ID (not PII, just for grouping events)
  sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  return sessionId;
}

/**
 * Check if telemetry is enabled
 */
function isTelemetryEnabled(): boolean {
  const settings = loadSettings();
  return settings.telemetryEnabled;
}

/**
 * Log a telemetry event
 */
export async function logEvent(
  type: TelemetryEventType,
  metadata?: Record<string, string | number | boolean>
): Promise<void> {
  // Respect user privacy settings
  if (!isTelemetryEnabled()) {
    console.log('[Telemetry] Event not logged (telemetry disabled):', type);
    return;
  }

  try {
    const db = await getDB();
    const event: TelemetryEvent = {
      type,
      timestamp: Date.now(),
      metadata: metadata || {},
      sessionId: getSessionId(),
    };

    await db.add(STORE_NAME, event);
    console.log('[Telemetry] Event logged:', type, metadata);
  } catch (error) {
    console.error('[Telemetry] Failed to log event:', error);
  }
}

/**
 * Get all telemetry events
 */
export async function getAllEvents(): Promise<TelemetryEvent[]> {
  try {
    const db = await getDB();
    return await db.getAll(STORE_NAME);
  } catch (error) {
    console.error('[Telemetry] Failed to get events:', error);
    return [];
  }
}

/**
 * Get events by type
 */
export async function getEventsByType(type: TelemetryEventType): Promise<TelemetryEvent[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex(STORE_NAME, 'by-type', type);
  } catch (error) {
    console.error('[Telemetry] Failed to get events by type:', error);
    return [];
  }
}

/**
 * Get events in time range
 */
export async function getEventsByTimeRange(
  startTime: number,
  endTime: number
): Promise<TelemetryEvent[]> {
  try {
    const db = await getDB();
    const allEvents = await db.getAll(STORE_NAME);
    return allEvents.filter(
      (event) => event.timestamp >= startTime && event.timestamp <= endTime
    );
  } catch (error) {
    console.error('[Telemetry] Failed to get events by time range:', error);
    return [];
  }
}

/**
 * Calculate AI acceptance rate
 */
export async function getAIAcceptanceRate(): Promise<number> {
  const accepts = await getEventsByType('ai_accept');
  const rejects = await getEventsByType('ai_reject');
  const total = accepts.length + rejects.length;
  
  if (total === 0) return 0;
  return (accepts.length / total) * 100;
}

/**
 * Calculate average AI latency
 */
export async function getAverageAILatency(): Promise<number> {
  const latencyEvents = await getEventsByType('ai_latency_ms');
  
  if (latencyEvents.length === 0) return 0;
  
  const totalLatency = latencyEvents.reduce(
    (sum, event) => sum + (Number(event.metadata?.latency) || 0),
    0
  );
  
  return totalLatency / latencyEvents.length;
}

/**
 * Export telemetry data as JSON
 */
export async function exportTelemetryData(): Promise<string> {
  const events = await getAllEvents();
  
  // Calculate summary statistics
  const summary = {
    totalEvents: events.length,
    eventTypes: Array.from(new Set(events.map((e) => e.type))),
    dateRange: {
      start: events.length > 0 ? new Date(Math.min(...events.map((e) => e.timestamp))) : null,
      end: events.length > 0 ? new Date(Math.max(...events.map((e) => e.timestamp))) : null,
    },
    aiAcceptanceRate: await getAIAcceptanceRate(),
    avgAILatency: await getAverageAILatency(),
  };

  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      summary,
      events,
    },
    null,
    2
  );
}

/**
 * Clear all telemetry data
 */
export async function clearTelemetryData(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
    console.log('[Telemetry] All data cleared');
  } catch (error) {
    console.error('[Telemetry] Failed to clear data:', error);
  }
}

/**
 * Get telemetry statistics
 */
export async function getTelemetryStats() {
  const events = await getAllEvents();
  const now = Date.now();
  const last24h = now - 24 * 60 * 60 * 1000;
  const last7days = now - 7 * 24 * 60 * 60 * 1000;

  return {
    total: events.length,
    last24h: events.filter((e) => e.timestamp >= last24h).length,
    last7days: events.filter((e) => e.timestamp >= last7days).length,
    byType: events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    aiAcceptanceRate: await getAIAcceptanceRate(),
    avgAILatency: await getAverageAILatency(),
  };
}
