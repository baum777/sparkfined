import { useSettings } from '../hooks/useSettings';
import { isWCOSupported } from '../lib/pwa/wco';

export default function SettingsPage() {
  const { settings, updateSetting } = useSettings();
  const wcoSupported = isWCOSupported();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-gray-400">Customize your Sparkfined experience</p>
      </div>

      {/* Desktop PWA Settings */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Desktop PWA
        </h2>
        
        <div className="space-y-4">
          {/* Custom Titlebar Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="customTitlebar" className="text-sm font-medium text-gray-200">
                Custom Desktop Titlebar
              </label>
              <p className="text-xs text-gray-400 mt-1">
                {wcoSupported 
                  ? 'Use a custom titlebar with window controls overlay (requires PWA installation)'
                  : 'Not supported on this browser or platform'
                }
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="customTitlebar"
                className="sr-only peer"
                checked={settings.customTitlebarEnabled}
                onChange={(e) => updateSetting('customTitlebarEnabled', e.target.checked)}
                disabled={!wcoSupported}
              />
              <div className={`w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                settings.customTitlebarEnabled && wcoSupported ? 'peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-purple-600' : ''
              } ${!wcoSupported ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
            </label>
          </div>

          {/* WCO Status Badge */}
          {wcoSupported && (
            <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-gray-300">
                  <p className="font-medium mb-1">Window Controls Overlay is supported</p>
                  <p className="text-gray-400">
                    Install this app to your desktop to enable the custom titlebar feature.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* UI Preferences */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Appearance
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="theme" className="text-sm font-medium text-gray-200">
                Theme
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Choose your preferred color scheme
              </p>
            </div>
            <select
              id="theme"
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value as 'dark' | 'light' | 'auto')}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </section>

      {/* Privacy & Data */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Privacy & Data
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="telemetry" className="text-sm font-medium text-gray-200">
                Anonymous Usage Analytics
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Help improve Sparkfined by sharing anonymous usage data (no PII collected)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="telemetry"
                className="sr-only peer"
                checked={settings.telemetryEnabled}
                onChange={(e) => updateSetting('telemetryEnabled', e.target.checked)}
              />
              <div className={`w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                settings.telemetryEnabled ? 'peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600' : ''
              }`}></div>
            </label>
          </div>
        </div>
      </section>

      {/* Advanced */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Advanced
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label htmlFor="experimental" className="text-sm font-medium text-gray-200">
                Experimental Features
              </label>
              <p className="text-xs text-gray-400 mt-1">
                Enable experimental features (may be unstable)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="experimental"
                className="sr-only peer"
                checked={settings.experimentalFeatures}
                onChange={(e) => updateSetting('experimentalFeatures', e.target.checked)}
              />
              <div className={`w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                settings.experimentalFeatures ? 'peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-600' : ''
              }`}></div>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
