/**
 * M-PWA-4: Window Controls Overlay Detection
 * Feature detection for desktop PWA titlebar customization
 */

interface WindowControlsOverlay {
  visible: boolean
  getTitlebarAreaRect?: () => { x: number; y: number; width: number; height: number }
  addEventListener: (event: string, callback: () => void) => void
  removeEventListener: (event: string, callback: () => void) => void
}

interface NavigatorWithWCO extends Navigator {
  windowControlsOverlay?: WindowControlsOverlay
}

/**
 * Check if Window Controls Overlay is supported and active
 */
export const hasWCO = Boolean(
  typeof navigator !== 'undefined' &&
  'windowControlsOverlay' in navigator &&
  (navigator as NavigatorWithWCO).windowControlsOverlay?.visible
)

/**
 * Get WCO geometry (for positioning custom titlebar)
 */
export function getWCOGeometry() {
  if (!hasWCO) {
    return null
  }

  const wco = (navigator as NavigatorWithWCO).windowControlsOverlay!
  
  return {
    visible: wco.visible,
    x: wco.getTitlebarAreaRect?.()?.x || 0,
    y: wco.getTitlebarAreaRect?.()?.y || 0,
    width: wco.getTitlebarAreaRect?.()?.width || 0,
    height: wco.getTitlebarAreaRect?.()?.height || 0,
  }
}

/**
 * Hook for WCO geometry changes
 */
export function onWCOGeometryChange(callback: () => void) {
  if (!hasWCO) {
    return () => {}
  }

  const wco = (navigator as NavigatorWithWCO).windowControlsOverlay!
  wco.addEventListener('geometrychange', callback)

  return () => {
    wco.removeEventListener('geometrychange', callback)
  }
}
