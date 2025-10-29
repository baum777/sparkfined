import { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '../lib/store/settings';
import { loadSettings, saveSettings, updateSetting } from '../lib/store/settings';

/**
 * Hook to manage app settings with localStorage persistence
 * 
 * Features:
 * - Reactive updates across components
 * - Automatic persistence
 * - Type-safe setting updates
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sparkfined-settings' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch (error) {
          console.error('[Settings] Failed to parse storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateSettingValue = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const updated = updateSetting(key, value);
    setSettings(updated);
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = loadSettings();
    setSettings(defaults);
  }, []);

  return {
    settings,
    updateSetting: updateSettingValue,
    resetSettings: resetToDefaults,
    saveSettings: () => saveSettings(settings),
  };
}
