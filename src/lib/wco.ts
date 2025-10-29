/**
 * M-PWA-4: Window Controls Overlay Detection
 * Feature detection for desktop PWA titlebar customization
 */

/**
 * Check if Window Controls Overlay is supported and active
 */
export const hasWCO = Boolean(
  typeof navigator !== 'undefined' &&
  (navigator as any).windowControlsOverlay?.visible
)

/**
 * Get WCO geometry (for positioning custom titlebar)
 */
export function getWCOGeometry() {
  if (!hasWCO) {
    return null
  }

  const wco = (navigator as any).windowControlsOverlay
  
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

  const wco = (navigator as any).windowControlsOverlay
  wco.addEventListener('geometrychange', callback)

  return () => {
    wco.removeEventListener('geometrychange', callback)
  }
}
