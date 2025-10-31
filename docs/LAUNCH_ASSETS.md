# Launch Assets Specification - Beta Teaser (Wave 1)

**Project:** Sparkfined TA-PWA  
**Version:** v0.1.0-beta  
**Launch Date:** Nov 03 - Nov 07, 2025  
**Asset Deadline:** Nov 03, 2025 EOD

---

## 🎬 Video Clip Specification

### Primary Promo Clip (15-20s)

**Purpose:** Showcase the core Drop→Result→Journal→Replay flow in one smooth sequence.

**Technical Requirements:**
- **Duration:** 15-20 seconds
- **Resolution:** 1920x1080 (landscape) OR 1080x1920 (portrait for mobile)
- **Frame Rate:** 60 FPS (smooth animations)
- **Format:** MP4 (H.264 codec)
- **File Size:** < 5 MB (for Twitter/X upload)
- **Audio:** None (muted - relies on visual storytelling)

**Capture Method:**
- **Desktop:** OBS Studio or ScreenToGif
- **Mobile:** iOS Screen Recording or Android Screen Record
- **Browser:** Chrome/Safari with responsive mode (375x667 iPhone SE)

**Flow Script (Exact Sequence):**

| Timestamp | Action | Screen | Notes |
|-----------|--------|--------|-------|
| 0:00-0:02 | App open | Home Page | Dark mode, logo animation visible |
| 0:02-0:04 | Navigate to Analyze | Analyze Page | Show bottom nav tap |
| 0:04-0:08 | Drop screenshot | Drop zone → Result Card | Smooth transition, highlight S/R lines |
| 0:08-0:11 | Save trade | Save Modal → Success | Quick fill, green checkmark animation |
| 0:11-0:14 | Navigate to Journal | Journal Page | Show saved trade in list |
| 0:14-0:17 | Tap trade → Replay | Replay Page | Frame-by-frame controls visible |
| 0:17-0:20 | End screen | Logo + Tagline | "Sparkfined TA-PWA (Beta) — Drop. Analyze. Replay." |

**Visual Branding:**
- **Color Palette:** Dark background (#0A0A0A) with neon green (#00FF66) accents
- **Typography:** System fonts, clean and modern
- **Logo Placement:** Bottom-right corner (watermark, 15% opacity) throughout
- **Tagline:** Display at end screen for 3 seconds

**Post-Production:**
- Add 1-2 second fade-in at start
- Add 1 second fade-out at end
- Optional: Add subtle motion blur for transitions
- Optional: Speed up slow parts to fit 20s (1.2x-1.5x)
- Export with Twitter/X optimization settings

**Deliverables:**
- `sparkfined-beta-promo-landscape.mp4` (1920x1080)
- `sparkfined-beta-promo-portrait.mp4` (1080x1920, optional)
- `sparkfined-beta-promo-twitter.mp4` (<5 MB, optimized)

---

## 📸 Screenshot Specification

### Core Screenshots (4 Required)

**Technical Requirements:**
- **Resolution:** 1170x2532 (iPhone 14 Pro) OR 375x667 (iPhone SE, responsive)
- **Format:** PNG (lossless quality)
- **Color Mode:** RGB
- **Device Frame:** Use MockUPhone, Screely, or Figma device mockups
- **Background:** Gradient or solid color matching brand (dark with green accent)

---

### Screenshot 1: Home Page

**Purpose:** Show clean, minimal landing page with clear CTA.

**Elements to Capture:**
- Logo at top center with animation frame
- Welcome text: "Drop. Analyze. Replay."
- Bottom navigation bar (4 tabs)
- Dark mode active

**Composition:**
- Centered vertical layout
- Logo takes 30% of screen height
- Plenty of breathing room (negative space)

**Annotations (Optional):**
- Arrow pointing to "Analyze" tab with text: "Start here"

**File Name:** `01-home-page.png`

---

### Screenshot 2: Analyze Page - Result Card

**Purpose:** Highlight the S/R detection and volatility analysis.

**Elements to Capture:**
- Uploaded chart image (use demo screenshot from Dexscreener)
- Result card with S/R levels visible
- Volatility indicator (High/Medium/Low with color coding)
- "Save Trade" button prominent
- Offline indicator badge (if applicable)

**Composition:**
- Chart takes top 40% of screen
- Result card overlays bottom 60%
- Green accent on key metrics

**Annotations (Optional):**
- Highlight S/R lines with arrows: "Auto-detected levels"
- Point to volatility score: "Instant insights"

**File Name:** `02-analyze-result-card.png`

---

### Screenshot 3: Journal Page

**Purpose:** Show saved trades list and export functionality.

**Elements to Capture:**
- List of 3-5 saved trades (demo data)
- Each trade card shows:
  - Chart thumbnail
  - Timestamp
  - S/R levels count
  - Volatility badge
  - Edit/Delete actions
- Export button in header (📊)
- "Add New Trade" floating action button (optional)

**Composition:**
- Scrollable list with clean card design
- Consistent spacing and typography
- Green accent on active/selected items

**Annotations (Optional):**
- Arrow to export button: "Export to JSON/CSV"
- Callout: "Works 100% offline"

**File Name:** `03-journal-page.png`

---

### Screenshot 4: Replay Page

**Purpose:** Showcase replay controls and frame-by-frame navigation.

**Elements to Capture:**
- Chart in replay mode (mid-animation state)
- Time slider/scrubber at bottom
- Play/Pause/Speed controls visible
- Rewind/Forward buttons
- Current timestamp indicator
- Annotation layer (if any marks visible)

**Composition:**
- Chart takes 70% of screen
- Controls fixed at bottom
- Dark overlay for controls with glassmorphism effect

**Annotations (Optional):**
- Arrow to slider: "Scrub through time"
- Point to speed control: "0.5x / 1x / 2x"

**File Name:** `04-replay-page.png`

---

### Bonus Screenshot (Optional): Feedback Modal

**Purpose:** Show privacy-first feedback collection.

**Elements to Capture:**
- Feedback modal open (Step 1: Type selection)
- Three options: Bug / Idea / Other
- Privacy notice at bottom: "Stored locally, no tracking"
- 140-character text input visible

**File Name:** `05-feedback-modal.png`

---

## 🎨 Device Frame & Branding

### Device Mockup Options

**Recommended Tools:**
1. **MockUPhone** - https://mockuphone.com/
2. **Screely** - https://www.screely.com/
3. **Figma Device Mockups** - https://www.figma.com/community/plugin/785174732701004439
4. **Cleanshot X** (macOS) - Built-in device frames

**Frame Style:**
- iPhone 14 Pro (black bezel, dynamic island visible)
- OR iPhone SE (classic design, budget-friendly aesthetic)
- Shadow: Subtle drop shadow (10-20px blur, 20% opacity)
- Background: Dark gradient (#0A0A0A → #1A1A1A) with subtle green accent

### Logo & Branding Overlay

**Logo Specs:**
- Located in `src/components/Logo.tsx` (extract SVG/PNG)
- Size: 120x120px minimum
- Color: Neon green (#00FF66) with white text
- Placement: Top-center or bottom-right

**Tagline:**
```
Sparkfined TA-PWA (Beta)
Drop. Analyze. Replay.
```

**Typography:**
- Font: System font (SF Pro / Segoe UI / Roboto)
- Weight: Bold for "Sparkfined", Regular for tagline
- Color: White (#FFFFFF) with green accent on "Beta"

---

## 📦 Asset Organization

### Directory Structure

```
/assets/
  /launch/
    /video/
      sparkfined-beta-promo-landscape.mp4
      sparkfined-beta-promo-portrait.mp4
      sparkfined-beta-promo-twitter.mp4
    /screenshots/
      01-home-page.png
      02-analyze-result-card.png
      03-journal-page.png
      04-replay-page.png
      05-feedback-modal.png (optional)
    /mockups/
      iphone-mockup-home.png
      iphone-mockup-analyze.png
      iphone-mockup-journal.png
      iphone-mockup-replay.png
    /social/
      twitter-preview.png (1200x675)
      og-image.png (1200x630)
      discord-banner.png (960x540)
```

### Naming Convention

- Use kebab-case for file names
- Include version number for multiple iterations
- Add `-compressed` suffix for optimized versions
- Example: `02-analyze-result-card-v2-compressed.png`

---

## 🌐 Social Media Optimization

### Twitter/X Card Preview

**Dimensions:** 1200x675 (16:9 aspect ratio)  
**Format:** PNG or JPG  
**File Size:** < 1 MB

**Content:**
- Main screenshot (Analyze page result card) as background
- Dark overlay (50% opacity)
- Large logo at center
- Tagline: "Drop. Analyze. Replay."
- Hashtags: #Sparkfined #Cryptober #Solana #DegenTools
- URL: [Add demo URL after deployment]

**File Name:** `twitter-preview.png`

---

### Open Graph (OG) Image

**Dimensions:** 1200x630 (1.91:1 aspect ratio)  
**Format:** PNG or JPG  
**File Size:** < 1 MB

**Content:**
- Similar to Twitter card, adjusted for OG ratio
- Include "Beta v0.1" badge
- Add "Offline-Ready PWA" callout

**File Name:** `og-image.png`

---

### Discord Banner (Optional)

**Dimensions:** 960x540 (16:9)  
**Format:** PNG  
**File Size:** < 2 MB

**Content:**
- Collage of all 4 screenshots in 2x2 grid
- Logo overlay at center
- Tagline at bottom
- Invite link (if Discord server launched)

**File Name:** `discord-banner.png`

---

## ✅ Asset Checklist

### Must Have (Launch Blockers)
- [ ] 15-20s promo video (landscape, Twitter-optimized)
- [ ] Screenshot 1: Home Page (with device frame)
- [ ] Screenshot 2: Analyze Result Card (with device frame)
- [ ] Screenshot 3: Journal Page (with device frame)
- [ ] Screenshot 4: Replay Page (with device frame)
- [ ] Twitter card preview image (1200x675)
- [ ] Open Graph image (1200x630)

### Nice to Have (Post-Launch)
- [ ] Portrait promo video (1080x1920, for Instagram/TikTok)
- [ ] Feedback modal screenshot
- [ ] Discord banner
- [ ] GIF version of promo video (< 2 MB)
- [ ] Alternative device frames (iPad, Android)

---

## 🎬 Production Timeline

| Date | Task | Owner | Status |
|------|------|-------|--------|
| Nov 03 | Capture raw screenshots (4 core pages) | Team | ⏳ Pending |
| Nov 03 | Record 15-20s promo video | Team | ⏳ Pending |
| Nov 04 | Add device frames and branding | Design | ⏳ Pending |
| Nov 04 | Edit and export promo video | Video | ⏳ Pending |
| Nov 05 | Create social media preview images | Design | ⏳ Pending |
| Nov 05 | Review and approve all assets | PM | ⏳ Pending |
| Nov 06 | Upload to hosting (Cloudinary/S3) | Dev | ⏳ Pending |
| Nov 07 | Publish to X/Twitter and Discord | Marketing | ⏳ Pending |

---

## 📝 Notes for Asset Creator

### Tips for High-Quality Screenshots

1. **Clean Browser State**
   - Clear all browser extensions that add UI elements
   - Use Incognito/Private mode
   - Hide browser chrome (F11 fullscreen mode)

2. **Consistent Demo Data**
   - Use the same demo chart across all screenshots
   - Ensure timestamps are realistic (not 1970-01-01)
   - Fill in placeholder text with realistic values

3. **Lighting & Contrast**
   - Dark mode should be ENABLED for all screenshots
   - Ensure neon green (#00FF66) pops against dark bg
   - Check contrast ratios for accessibility

4. **Device Frames**
   - Use consistent device model across all mockups
   - Ensure frame shadows and reflections are subtle
   - Don't overdo the perspective/rotation (keep it clean)

5. **Annotations**
   - Use sparingly (1-2 per screenshot max)
   - Match brand colors (green for primary, white for secondary)
   - Keep text short and clear (5-7 words)

### Video Recording Tips

1. **Pre-Record Practice Runs**
   - Do 2-3 dry runs to get smooth timing
   - Mark exact timestamps for each action
   - Use a script or checklist

2. **Cursor Movement**
   - Move cursor smoothly (not too fast)
   - Pause on key elements for 1-2 seconds
   - Hide cursor during transitions (if possible)

3. **Transitions**
   - Use native app transitions (no custom effects)
   - Let animations complete fully (don't cut mid-frame)
   - Maintain consistent pacing throughout

4. **Optimization**
   - Export at 60 FPS for smoothness
   - Use H.264 codec (best compatibility)
   - Compress to < 5 MB using HandBrake or FFmpeg

---

## 🔧 Technical Specs Summary

| Asset Type | Dimensions | Format | Max Size | FPS | Notes |
|------------|------------|--------|----------|-----|-------|
| Promo Video (Landscape) | 1920x1080 | MP4 | 5 MB | 60 | Twitter-optimized |
| Promo Video (Portrait) | 1080x1920 | MP4 | 5 MB | 60 | Optional |
| Screenshots (Mobile) | 1170x2532 | PNG | 2 MB | - | iPhone 14 Pro |
| Screenshots (Responsive) | 375x667 | PNG | 1 MB | - | iPhone SE |
| Device Mockups | Variable | PNG | 3 MB | - | With shadow |
| Twitter Card | 1200x675 | PNG/JPG | 1 MB | - | 16:9 ratio |
| Open Graph | 1200x630 | PNG/JPG | 1 MB | - | 1.91:1 ratio |
| Discord Banner | 960x540 | PNG | 2 MB | - | Optional |

---

## 📧 Asset Delivery

**Upload Location:** [Add Cloudinary/S3 bucket URL]  
**Review Link:** [Add Google Drive/Dropbox link]  
**Approval Required:** Yes (by PM before public release)

---

**Last Updated:** 2025-10-25  
**Contact:** Sparkfined Team  
**Status:** ⏳ Assets pending creation
