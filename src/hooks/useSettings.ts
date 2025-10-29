/**
 * M-PWA-5: Settings Hook
 * Persistent settings with localStorage
 */

import { useState, useEffect } from 'react'

export interface AppSettings {
  customTitlebar: boolean
  darkMode: boolean
  telemetryEnabled: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  customTitlebar: true, // Default ON if WCO available
  darkMode: true,
  telemetryEnabled: true,
}

const SETTINGS_KEY = 'sparkfined-settings'

/**
 * Load settings from localStorage
 */
function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error('[Settings] Failed to load settings:', error)
  }
  return DEFAULT_SETTINGS
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('[Settings] Failed to save settings:', error)
  }
}

/**
 * Settings hook with persistence
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  // Save to localStorage whenever settings change
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return {
    settings,
    updateSetting,
    resetSettings,
  }
}
