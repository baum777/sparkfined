/**
 * M-PWA-5: Settings Page
 * User preferences and configuration
 */

import { useSettings } from '@/hooks/useSettings'
import { hasWCO } from '@/lib/wco'

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings } = useSettings()

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">
          Customize your Sparkfined experience
        </p>
      </div>

      {/* Desktop Titlebar Setting */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
          Desktop
        </h2>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white mb-1">
                Custom Desktop Titlebar
              </h3>
              <p className="text-xs text-gray-400">
                Show custom titlebar when installed as desktop app (Window Controls Overlay).
                {!hasWCO && (
                  <span className="block mt-1 text-yellow-500">
                    ⚠️ Not available: Install as desktop app to enable this feature.
                  </span>
                )}
              </p>
            </div>
            
            <button
              onClick={() => updateSetting('customTitlebar', !settings.customTitlebar)}
              disabled={!hasWCO}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${settings.customTitlebar ? 'bg-blue-600' : 'bg-gray-600'}
                ${!hasWCO ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              role="switch"
              aria-checked={settings.customTitlebar}
              aria-label="Toggle custom titlebar"
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.customTitlebar ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Privacy & Data */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
          Privacy & Data
        </h2>

        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white mb-1">
                Telemetry
              </h3>
              <p className="text-xs text-gray-400">
                Collect anonymous performance metrics to improve the app.
                All data stays local on your device.
              </p>
            </div>
            
            <button
              onClick={() => updateSetting('telemetryEnabled', !settings.telemetryEnabled)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
                ${settings.telemetryEnabled ? 'bg-blue-600' : 'bg-gray-600'}
              `}
              role="switch"
              aria-checked={settings.telemetryEnabled}
              aria-label="Toggle telemetry"
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${settings.telemetryEnabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
          Actions
        </h2>

        <button
          onClick={resetSettings}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded border border-gray-600 transition-colors"
        >
          Reset to Defaults
        </button>
      </section>

      {/* Info */}
      <section className="text-xs text-gray-500 space-y-1">
        <p>Version: 1.0.0-alpha</p>
        <p>Settings are stored locally on your device.</p>
        <p>No data is sent to external servers.</p>
      </section>
    </div>
  )
}
