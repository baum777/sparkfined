# 📲 Sparkfined PWA Installation Guide

Complete guide for installing and updating the Sparkfined Progressive Web App on different platforms.

---

## Table of Contents

1. [Android (Chrome/Edge)](#android-chromeedge)
2. [Desktop (Chrome/Edge/Brave)](#desktop-chromeedgebrave)
3. [iOS / iPadOS (Safari)](#ios--ipados-safari)
4. [Update Behavior](#update-behavior)
5. [Troubleshooting](#troubleshooting)

---

## Android (Chrome/Edge)

### Requirements
- Android 5.0+ (Lollipop or newer)
- Chrome 90+ or Edge 90+
- Stable internet connection

### Installation Steps

1. **Open the App in Browser**
   - Navigate to `https://sparkfined.vercel.app` (or your deployment URL)
   - Wait for the page to fully load

2. **Install Prompt**
   - Chrome/Edge will show an install banner at the bottom: "Add Sparkfined to Home screen"
   - Alternatively, tap the **menu (⋮)** → **"Add to Home screen"** or **"Install app"**

3. **Confirm Installation**
   - Review the app name and icon
   - Tap **"Add"** or **"Install"**

4. **Launch the App**
   - Find the Sparkfined icon on your home screen
   - Tap to launch as a standalone app (no browser UI)

### Features on Android
- ✅ Standalone window (no browser chrome)
- ✅ Add to home screen with custom icon
- ✅ Offline support (caches app shell and routes)
- ✅ Push notifications (future)
- ✅ Background sync (future)

---

## Desktop (Chrome/Edge/Brave)

### Requirements
- Windows 10+, macOS 10.13+, or Linux
- Chrome 90+, Edge 90+, or Brave 1.30+

### Installation Steps

1. **Open the App in Browser**
   - Navigate to `https://sparkfined.vercel.app`
   - Wait for the page to fully load

2. **Install via Address Bar**
   - Look for the **install icon (⊕)** in the address bar (right side)
   - Click the icon → **"Install"**

   **Alternative:**
   - Click **menu (⋮)** → **"Apps"** → **"Install Sparkfined"**
   - Or: **Settings** → **"Install Sparkfined"**

3. **Confirm Installation**
   - A dialog appears: "Install app?"
   - Click **"Install"**

4. **Launch the App**
   - The app opens in a standalone window
   - Find it in your **Start Menu** (Windows), **Applications** (macOS), or **App Drawer** (Linux)
   - Pin to taskbar/dock for quick access

### Features on Desktop
- ✅ Standalone app window
- ✅ Window Controls Overlay (WCO) – integrates with OS title bar
- ✅ Offline support
- ✅ File system access (future)
- ✅ System integration (future)

---

## iOS / iPadOS (Safari)

> ⚠️ **Note:** iOS does not support full PWA installation via Chrome/Firefox. You must use **Safari**.

### Requirements
- iOS 11.3+ (iPhone/iPad)
- Safari browser

### Installation Steps (Add to Home Screen)

1. **Open in Safari**
   - Navigate to `https://sparkfined.vercel.app`
   - Ensure you're using **Safari**, not Chrome or another browser

2. **Add to Home Screen**
   - Tap the **Share button (⎘)** at the bottom (iPhone) or top (iPad)
   - Scroll down and select **"Add to Home Screen"**

3. **Customize Name (Optional)**
   - Edit the name if desired (default: "Sparkfined")
   - Tap **"Add"** (top right)

4. **Launch the App**
   - Find the Sparkfined icon on your home screen
   - Tap to launch in standalone mode

### Limitations on iOS
- ⚠️ Limited offline storage (< 50 MB)
- ⚠️ No background sync or push notifications
- ⚠️ Service worker may be evicted after ~1 week of inactivity
- ⚠️ Must use Safari for installation (Chrome/Firefox not supported)

### Re-Adding After Eviction
If the app stops working after extended inactivity:
1. Delete the home screen icon
2. Re-open in Safari
3. Re-add to home screen

---

## Update Behavior

### Manual Update Flow (Recommended)

**Sparkfined uses a manual update system** to prevent unexpected reloads:

1. **Update Available**
   - A blue banner appears at the top: **"New version available!"**
   - The app continues to work normally with the old version

2. **Apply Update**
   - Click **"Update Now"** in the banner
   - The app reloads automatically with the new version

3. **Dismiss Banner (Optional)**
   - Click **"✕"** to dismiss the banner
   - You can update later by refreshing the page manually

### Why Manual Updates?
- ✅ No unexpected reloads during active use
- ✅ User controls when to update (e.g., after finishing a task)
- ✅ Prevents data loss from auto-refresh

### Force Update (If Stuck)
If the update banner doesn't appear or you want to force a refresh:

1. **Clear Cache & Reload**
   - **Desktop:** `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS)
   - **Mobile:** Settings → Apps → Sparkfined → Storage → Clear Cache

2. **Unregister Service Worker**
   - Open DevTools (F12) → **Application** → **Service Workers**
   - Click **"Unregister"** → Reload the page

---

## Troubleshooting

### Install Button Not Showing

**Possible Causes:**
- App is already installed
- Browser doesn't support PWA installation
- Not on HTTPS (localhost is OK)
- Missing required manifest fields

**Solutions:**
1. Check if the app is already installed (Start Menu, App Drawer, Home Screen)
2. Try a different browser (Chrome, Edge, Brave, Safari on iOS)
3. Ensure you're on HTTPS or localhost
4. Open DevTools → **Console** for errors

---

### App Not Working Offline

**Check:**
1. Service worker is registered:
   - DevTools (F12) → **Application** → **Service Workers**
   - Status should be **"activated and running"**

2. Network requests are cached:
   - DevTools → **Application** → **Cache Storage**
   - Should see `workbox-precache-v2-...` entries

3. Force re-register:
   - Clear cache and reload (Ctrl+Shift+R)

---

### Update Banner Not Appearing

**Check:**
1. Service worker update detection:
   - DevTools → **Application** → **Service Workers**
   - Click **"Update"** to force a check

2. New version actually deployed:
   - Check deployment status on Vercel/Netlify
   - Ensure new version is live

3. Manual refresh:
   - Hard reload: `Ctrl+Shift+R`

---

### iOS: App Stops Working After ~1 Week

**Why?**
- iOS evicts service workers after prolonged inactivity to save storage

**Solution:**
1. Delete the home screen icon
2. Re-open in Safari
3. Re-add to home screen

---

### Desktop: App Window is Too Small

**Solution:**
1. Resize the window manually
2. The app remembers window size for next launch
3. Or: Uninstall and reinstall to reset

---

## Uninstall Instructions

### Android
1. Long-press the Sparkfined icon
2. Select **"App info"** or drag to **"Uninstall"**
3. Confirm uninstallation

### Desktop
**Chrome/Edge:**
1. Open the app
2. Menu (⋮) → **"Uninstall Sparkfined"**
3. Confirm uninstallation

**Alternative (all platforms):**
- Browser Settings → Apps → Find "Sparkfined" → Uninstall

### iOS
1. Long-press the Sparkfined icon
2. Select **"Remove App"**
3. Confirm deletion

---

## Support & Feedback

- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email:** support@sparkfined.com

---

## Version History

| Version | Date       | Changes                          |
|---------|------------|----------------------------------|
| v1.0.0  | 2025-10-29 | Initial release with manual updates |

---

**Happy Trading! 📈**
