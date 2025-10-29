# Sparkfined PWA - Installation Guide

**Version:** 1.0.0-alpha  
**Last Updated:** 2025-10-29

---

## 📱 Mobile Installation

### Android (Chrome/Edge)

1. **Open Sparkfined** in Chrome or Edge browser
2. **Look for the install prompt** at the bottom of the screen
3. **Tap "Install"** button
4. App will be added to your home screen

**Alternative method:**
1. Tap the **three-dot menu** (⋮) in the browser
2. Select **"Add to Home screen"** or **"Install app"**
3. Confirm installation

### iOS (Safari)

1. **Open Sparkfined** in Safari
2. **Tap the Share button** (square with arrow pointing up)
3. **Scroll down** and tap **"Add to Home Screen"**
4. **Edit the name** if desired (default: "Sparkfined")
5. **Tap "Add"** in the top right

**Note:** On iOS, you'll see a blue hint banner with these instructions when you first visit the app. Tap "Got it" to dismiss it.

---

## 💻 Desktop Installation

### Windows/macOS/Linux (Chrome/Edge)

1. **Open Sparkfined** in Chrome or Edge
2. **Look for the install icon** in the address bar (➕ or ⬇️)
3. **Click the icon** or the **"Install"** banner at the bottom
4. Confirm installation in the popup

**Alternative method:**
1. Click the **three-dot menu** (⋮) in the browser
2. Select **"Install Sparkfined..."** or **"Install app"**
3. Confirm installation

### Desktop Features

Once installed on desktop, you'll get:

- **Custom Titlebar** (Window Controls Overlay)
  - Drag-and-drop area for window management
  - Back button navigation
  - Provider/AI status badges
  - Toggle in Settings if you prefer default titlebar

- **Standalone Window**
  - No browser UI clutter
  - Dedicated app icon in taskbar/dock
  - Alt+Tab app switching

- **Keyboard Shortcuts** (in Replay view)
  - `←` / `→` - Skip 5 seconds
  - `Shift` + `←` / `→` - Skip 20 seconds
  - `Ctrl` + Mouse Wheel - Zoom (0.5x - 3.0x)

---

## ⚙️ Settings

### Custom Desktop Titlebar

**Path:** Settings → Desktop → Custom Desktop Titlebar

- **Toggle ON/OFF** - Show or hide the custom titlebar
- **Default:** ON (when Window Controls Overlay is supported)
- **Fallback:** Automatically disabled if not supported

**Note:** This setting only affects installed desktop PWAs with WCO support (Chrome/Edge on Windows/macOS/Linux).

### Telemetry

**Path:** Settings → Privacy & Data → Telemetry

- **Toggle ON/OFF** - Enable or disable performance metrics collection
- **Default:** ON
- **Privacy:** All data stays local on your device, manual export only
- **No PII:** No personal information is collected

---

## 🌐 Offline Usage

Sparkfined works offline once installed:

- **App Shell** - Cached for instant offline startup
- **API Responses** - Cached for 5 minutes (Stale-While-Revalidate)
- **Images** - Cached for 30 days
- **Google Fonts** - Cached for 1 year

### Offline Capabilities

✅ **Available Offline:**
- App navigation (Home, Journal, Replay, Settings)
- Viewing saved trades in Journal
- Viewing replays
- Reading cached analysis results

❌ **Requires Internet:**
- New token analysis (requires API calls)
- AI-powered suggestions
- Fresh market data
- Exporting to external services

### Offline Indicator

When offline, you'll see an **"Offline"** badge in the app header or status bar.

---

## 🔄 Updates

### How Updates Work

Sparkfined uses a **non-aggressive update strategy**:

1. **New version detected** - You'll see a notification/banner
2. **Manual update** - Click "Update" to refresh
3. **Controlled timing** - Update won't interrupt your workflow

**Update prompt:** `registerType: 'prompt'` (not automatic)

### Force Update

If you need to force an update:

1. **Unregister Service Worker**
   - Open DevTools (F12)
   - Go to Application → Service Workers
   - Click "Unregister"
2. **Clear cache**
   - Application → Clear storage
3. **Reload** the app

---

## 🗑️ Uninstallation

### Android

1. **Long-press** the Sparkfined icon on home screen
2. Select **"Uninstall"** or **"Remove"**
3. Confirm removal

### iOS

1. **Long-press** the Sparkfined icon on home screen
2. Tap **"Remove App"**
3. Select **"Delete App"**
4. Confirm deletion

### Desktop (Chrome/Edge)

1. Open **chrome://apps** (Chrome) or **edge://apps** (Edge)
2. **Right-click** Sparkfined icon
3. Select **"Uninstall"** or **"Remove from Chrome/Edge"**
4. Confirm removal

**Clearing Data:**
To remove all local data after uninstalling:
1. Open browser DevTools (F12)
2. Application → Clear storage
3. Check "IndexedDB", "Local storage", "Session storage"
4. Click "Clear site data"

---

## 🐛 Troubleshooting

### Install button doesn't appear

**Possible causes:**
- Already installed
- Not using HTTPS (required for PWA)
- Browser doesn't support PWA installation
- Manifest or Service Worker errors

**Solutions:**
1. Check if already installed: Look for Sparkfined in your app drawer/start menu
2. Open browser DevTools → Console - Check for errors
3. Clear browser cache and try again
4. Use Chrome, Edge, or Safari (other browsers have limited support)

### App doesn't work offline

1. **Ensure service worker is active**
   - DevTools → Application → Service Workers
   - Status should be "activated and running"
2. **Check cache**
   - Application → Cache Storage
   - Should see "api-edge-cache", "images-cache", etc.
3. **Try reloading** once while online to populate cache

### Custom titlebar doesn't show (Desktop)

1. **Verify installation**
   - Must be installed as PWA (not just bookmarked)
   - Check if window has custom titlebar
2. **Check settings**
   - Settings → Desktop → Custom Desktop Titlebar
   - Should be toggled ON
3. **Browser support**
   - Chrome 105+ or Edge 105+ required
   - Not supported in Firefox or Safari

### iOS installation doesn't work

1. **Must use Safari** - Other browsers don't support A2HS on iOS
2. **Follow the in-app hint** - Blue banner with step-by-step instructions
3. **Dismiss popup blockers** if any

---

## 📊 Data & Privacy

### What data is stored locally?

- **Trades** - Your journal entries
- **Analysis Results** - Cached token snapshots
- **Telemetry** - Anonymous performance metrics (if enabled)
- **Settings** - Your app preferences
- **Service Worker Cache** - App shell and API responses

### What data leaves your device?

- **API Requests** - Only when analyzing tokens (contract addresses, no PII)
- **Telemetry Export** - Only when you manually export (Settings → Export)

**No automatic data collection. No tracking. No ads.**

---

## 🆘 Support

- **Issues:** https://github.com/baum777/sparkfined/issues
- **Docs:** `/docs` folder in repository
- **CI Status:** https://github.com/baum777/sparkfined/actions

---

**Enjoy your Sparkfined experience! 🚀**
