/**
 * M-PWA-4: Desktop Titlebar Component
 * Custom titlebar for Window Controls Overlay mode
 */

import { useState, useEffect } from 'react'
import { hasWCO, getWCOGeometry, onWCOGeometryChange } from '@/lib/wco'
import { Telemetry } from '@/lib/TelemetryService'
import '../styles/titlebar.css'

interface TitlebarProps {
  enabled?: boolean
}

export function Titlebar({ enabled = true }: TitlebarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [geometry, setGeometry] = useState(getWCOGeometry())

  useEffect(() => {
    // Feature detection
    if (!hasWCO || !enabled) {
      setIsVisible(false)
      document.body.classList.remove('has-titlebar')
      return
    }

    setIsVisible(true)
    document.body.classList.add('has-titlebar')

    // Log telemetry
    Telemetry.log('wco_visible', 1, {
      geometry: getWCOGeometry(),
    })

    // Listen for geometry changes (window resize, fullscreen, etc.)
    const cleanup = onWCOGeometryChange(() => {
      setGeometry(getWCOGeometry())
    })

    return () => {
      cleanup()
      document.body.classList.remove('has-titlebar')
    }
  }, [enabled])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className="titlebar"
      data-testid="desktop-titlebar"
      style={{
        height: geometry?.height ? `${geometry.height}px` : undefined,
      }}
    >
      {/* Logo/Brand */}
      <div className="titlebar-logo">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span>Sparkfined</span>
      </div>

      {/* Navigation (optional) */}
      <div className="titlebar-actions">
        <button
          className="titlebar-btn btn"
          onClick={() => window.history.back()}
          aria-label="Back"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}
