/**
 * Window Controls Overlay (WCO) Detection and Management
 * 
 * Provides utilities for detecting and working with the Window Controls Overlay API
 * which allows PWAs to customize the title bar area on desktop platforms.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API
 */

export interface WindowControlsOverlayGeometry {
  titlebarAreaRect: DOMRect;
}

interface WindowControlsOverlay {
  visible: boolean;
  getTitlebarAreaRect: () => DOMRect;
  addEventListener: (event: string, handler: (event: GeometryChangeEvent) => void) => void;
  removeEventListener: (event: string, handler: (event: GeometryChangeEvent) => void) => void;
}

interface GeometryChangeEvent extends Event {
  titlebarAreaRect: DOMRect;
}

interface NavigatorWithWCO extends Navigator {
  windowControlsOverlay?: WindowControlsOverlay;
}

/**
 * Check if Window Controls Overlay is supported by the browser
 */
export function isWCOSupported(): boolean {
  return 'windowControlsOverlay' in navigator;
}

/**
 * Check if Window Controls Overlay is currently visible/active
 */
export function isWCOVisible(): boolean {
  if (!isWCOSupported()) {
    return false;
  }

  const nav = navigator as NavigatorWithWCO;
  return nav.windowControlsOverlay?.visible === true;
}

/**
 * Get the geometry of the titlebar area
 */
export function getTitlebarGeometry(): DOMRect | null {
  if (!isWCOSupported()) {
    return null;
  }

  const nav = navigator as NavigatorWithWCO;
  return nav.windowControlsOverlay?.getTitlebarAreaRect() || null;
}

/**
 * Subscribe to changes in WCO geometry
 */
export function onWCOGeometryChange(
  callback: (geometry: WindowControlsOverlayGeometry) => void
): () => void {
  if (!isWCOSupported()) {
    return () => {};
  }

  const nav = navigator as NavigatorWithWCO;
  const overlay = nav.windowControlsOverlay;
  
  if (!overlay) {
    return () => {};
  }

  const handler = (event: GeometryChangeEvent) => {
    callback({
      titlebarAreaRect: event.titlebarAreaRect,
    });
  };

  overlay.addEventListener('geometrychange', handler);

  return () => {
    overlay.removeEventListener('geometrychange', handler);
  };
}

/**
 * Get CSS environment variables for titlebar safe area
 * These can be used to position content correctly when WCO is active
 */
export function getTitlebarSafeArea() {
  return {
    top: 'env(titlebar-area-height, 0px)',
    left: 'env(titlebar-area-x, 0px)',
    width: 'env(titlebar-area-width, 100%)',
    height: 'env(titlebar-area-height, 33px)',
  };
}

/**
 * Log WCO status for debugging and telemetry
 */
export function logWCOStatus() {
  const supported = isWCOSupported();
  const visible = isWCOVisible();
  const geometry = getTitlebarGeometry();

  console.log('[WCO] Status:', {
    supported,
    visible,
    geometry: geometry ? {
      x: geometry.x,
      y: geometry.y,
      width: geometry.width,
      height: geometry.height,
    } : null,
  });

  return { supported, visible, geometry };
}
