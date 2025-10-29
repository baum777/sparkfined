/**
 * Settings Store
 * 
 * Manages user preferences and settings with localStorage persistence
 */

export interface AppSettings {
  // Desktop PWA settings
  customTitlebarEnabled: boolean;
  
  // UI preferences
  theme: 'dark' | 'light' | 'auto';
  
  // Feature flags
  experimentalFeatures: boolean;
  
  // Telemetry
  telemetryEnabled: boolean;
}

const SETTINGS_KEY = 'sparkfined-settings';

const DEFAULT_SETTINGS: AppSettings = {
  customTitlebarEnabled: true, // Enabled by default when supported
  theme: 'dark',
  experimentalFeatures: false,
  telemetryEnabled: true,
};

/**
 * Load settings from localStorage
 */
export function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('[Settings] Failed to load settings:', error);
  }
  
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('[Settings] Failed to save settings:', error);
  }
}

/**
 * Update a specific setting
 */
export function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): AppSettings {
  const settings = loadSettings();
  settings[key] = value;
  saveSettings(settings);
  return settings;
}

/**
 * Reset settings to defaults
 */
export function resetSettings(): AppSettings {
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}
