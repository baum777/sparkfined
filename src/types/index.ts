// Global type definitions

export interface AppConfig {
  apiBaseUrl: string
  apiKey: string
  enableAnalytics: boolean
  enableDebug: boolean
}

export type Theme = 'light' | 'dark'

export interface User {
  id: string
  email: string
  name: string
}
